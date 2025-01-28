<template>
    <v-row class="font-prompt">
        <!-- ปุ่มเพิ่มโต๊ะ -->
        <v-col cols="12" class="d-flex justify-end font-prompt">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" rounded="pill">
                        <v-icon class="mr-2">mdi-plus</v-icon> เพิ่มโต๊ะ
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="px-4 pt-6 justify-space-between d-flex align-center">
                        <span class="text-h5">{{ formTitle }}</span>
                        <v-btn @click="close" :ripple="false" density="compact" icon="mdi-close"></v-btn>
                    </v-card-title>
                    <v-card-text class="px-4">
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.name"
                                        label="ชื่อโต๊ะ" />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.price"
                                        label="ราคา" type="number" />
                                </v-col>
                                <v-col cols="12">
                                    <v-select variant="outlined" hide-details v-model="editedItem.floor" label="ชั้น"
                                        placeholder="เลือกชั้น" :items="floorOptions" />
                                </v-col>
                                <v-col cols="12">
                                    <v-select variant="outlined" hide-details v-model="editedItem.status" label="สถานะ"
                                        :items="statusOptions" />
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <div class="pa-4 d-flex justify-end gap-2">
                        <v-spacer></v-spacer>
                        <v-btn @click="close" class="bg-error px-3 rounded-pill">ยกเลิก</v-btn>
                        <v-btn color="primary"
                            :disabled="!editedItem.name || !editedItem.price || !editedItem.floor || !editedItem.status"
                            class="px-3 rounded-pill" @click="save">
                            บันทึก
                        </v-btn>
                    </div>
                </v-card>
            </v-dialog>
        </v-col>

        <!-- ตารางข้อมูล -->
        <v-col cols="12">
            <perfect-scrollbar>
                <div class="border-table">
                    <v-table class="mt-2">
                        <thead>
                            <tr>
                                <th>ชื่อโต๊ะ</th>
                                <th>ชั้น</th>
                                <th>ราคา</th>
                                <th>สถานะ</th>
                                <th>การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in paginatedItems" :key="item._id">
                                <td>{{ item.name }}</td>
                                <td>{{ item.floor }}</td>
                                <td>{{ item.price }} บาท</td>
                                <td>
                                    <v-chip rounded="pill"
                                        :color="statusColorMap[item.status ? item.status.toLowerCase() : '']"
                                        size="small" label>
                                        {{ item.status || 'ไม่มีสถานะ' }}
                                    </v-chip>
                                </td>
                                <td>
                                    <!-- ปุ่ม Edit พร้อม Tooltip -->
                                    <v-tooltip v-if="item.status !== 'reserved'" text="แก้ไข">
                                        <template v-slot:activator="{ props }">
                                            <v-btn icon flat @click="edit(item)" v-bind="props">
                                                <v-icon color="primary">mdi-pencil</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-tooltip>

                                    <!-- ปุ่ม Delete พร้อม Tooltip -->
                                    <v-tooltip v-if="item.status !== 'reserved'" text="ลบ">
                                        <template v-slot:activator="{ props }">
                                            <v-btn icon flat @click="confirmDelete(item)" v-bind="props"
                                                :disabled="item.status === 'reserved'">
                                                <v-icon color="error">mdi-delete</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-tooltip>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div class="text-center pt-2 mb-3 px-3">
                        <v-pagination v-model="pagination" :length="totalPages"></v-pagination>
                        <v-text-field :model-value="itemsPerPage" class="pa-2" label="Items per page" type="number"
                            min="1" max="15" hide-details
                            @update:model-value="itemsPerPage = parseInt($event, 10)"></v-text-field>
                    </div>
                </div>
            </perfect-scrollbar>
            <!-- Modal ยืนยันการลบ -->
            <v-dialog v-model="deleteDialog" max-width="400">
                <v-card>
                    <v-card-title class="text-h5">ยืนยันการลบ</v-card-title>
                    <v-card-text>
                        คุณต้องการลบโต๊ะ <strong>{{ itemToDelete?.name }}</strong> หรือไม่?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="grey" @click="closeDeleteDialog">ยกเลิก</v-btn>
                        <v-btn color="error" @click="deleteConfirmed">ลบ</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-snackbar v-model="showToast" :color="toastColor" timeout="3000">
                {{ toastMessage }}
            </v-snackbar>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axiosInstance from "@/config/axios";
import API_PATH from "@/config/apiPath";

// Interface สำหรับ Table
interface Table {
    _id: string;
    name: string;
    price: number;
    floor: string; // เพิ่ม floor
    status: string;
}

// สถานะที่ใช้
const statusOptions = ["available", "reserved"];
const floorOptions = ["1", "2", "3", "4"]; // เพิ่มตัวเลือกชั้น
const statusColorMap: Record<string, string> = {
    available: "success", // เขียว
    reserved: "error", // แดง
};

const formTitle = computed(() => {
    return editedIndex.value === -1 ? "เพิ่มโต๊ะ" : "แก้ไขโต๊ะ";
});



// ข้อมูลที่ใช้
const tables = ref<Table[]>([]);
// State สำหรับ Snackbar
const showToast = ref(false);
const toastMessage = ref("");
const toastColor = ref("");
const deleteDialog = ref(false);
const itemToDelete = ref<Table | null>(null);
const valid = ref(true);
const dialog = ref(false);
const pagination = ref(1);
const itemsPerPage = ref(15);
const editedIndex = ref(-1);
const editedItem = ref<Table>({
    _id: "",
    name: "",
    price: 0,
    floor: "", // เพิ่ม floor
    status: "available",
});

// การคำนวณข้อมูลที่แสดงในแต่ละหน้า
const paginatedItems = computed(() => {
    const start = (pagination.value - 1) * itemsPerPage.value;
    return tables.value.slice(start, start + itemsPerPage.value);
});

// รวมหน้าทั้งหมด
const totalPages = computed(() => Math.ceil(tables.value.length / itemsPerPage.value));

// ดึงข้อมูลทั้งหมด
const fetchTables = async () => {
    try {
        const response = await axiosInstance.get(API_PATH.GET_TABLE);
        tables.value = response.data;
    } catch (error) {
        console.error("Error fetching tables:", error);
    }
};

// บันทึกข้อมูล
const save = async () => {
    try {
        const { _id, ...payload } = editedItem.value;

        if (editedIndex.value > -1) {
            await axiosInstance.put(API_PATH.UPDATE_TABLE.replace(":id", _id), payload);
        } else {
            await axiosInstance.post(API_PATH.CREATE_TABLE, payload);
        }

        // โหลดข้อมูลใหม่หลังจากบันทึกสำเร็จ
        await fetchTables();
        close();

        // แสดง Toast message สำเร็จ
        toastMessage.value = editedIndex.value > -1 ? "แก้ไขข้อมูลสำเร็จ" : "เพิ่มโต๊ะใหม่สำเร็จ";
        toastColor.value = "success";
        showToast.value = true;
    } catch (err) {
        const error = err as any; // หรือใช้ AxiosError หากใช้ axios

        console.error("Error saving table:", error);

        // ตรวจสอบข้อผิดพลาดว่ามาจากชื่อซ้ำ
        if (error.response && error.response.status === 400) {
            toastMessage.value = "ไม่สามารถใช้ชื่อนี้ได้ เพราะมีอยู่ในระบบแล้ว";
            toastColor.value = "error";
            showToast.value = true;
        } else {
            toastMessage.value = "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
            toastColor.value = "error";
            showToast.value = true;
        }
    }
};

// เปิด Modal ยืนยันการลบ
const confirmDelete = (item: Table) => {
    itemToDelete.value = item;
    deleteDialog.value = true;
};
// ดำเนินการลบเมื่อผู้ใช้ยืนยัน
const deleteConfirmed = async () => {
    if (itemToDelete.value?._id) { // ใช้ Optional Chaining เพื่อตรวจสอบว่ามีค่า
        try {
            await axiosInstance.delete(API_PATH.DELETE_TABLE.replace(":id", itemToDelete.value._id));
            tables.value = tables.value.filter((table) => table._id !== itemToDelete.value!._id); // ใช้ Non-null Assertion Operator (!) ที่นี่เพื่อให้แน่ใจว่าไม่เป็น null

            toastMessage.value = "ลบข้อมูลสำเร็จ!";
            toastColor.value = "success";
            showToast.value = true;
        } catch (error) {
            console.error("Error deleting table:", error);

            toastMessage.value = "เกิดข้อผิดพลาดในการลบข้อมูล";
            toastColor.value = "error";
            showToast.value = true;
        } finally {
            closeDeleteDialog();
        }
    } else {
        // กรณีที่ itemToDelete.value เป็น null
        toastMessage.value = "ไม่พบรายการที่ต้องการลบ";
        toastColor.value = "error";
        showToast.value = true;
    }
};



// ปิด Modal ยืนยันการลบ
const closeDeleteDialog = () => {
    deleteDialog.value = false;
    itemToDelete.value = null;
};

const edit = (item: Table) => {
    editedIndex.value = tables.value.indexOf(item);
    editedItem.value = { ...item, status: item.status || "available" };
    dialog.value = true;
};

// ปิดฟอร์ม
const close = () => {
    dialog.value = false;
    editedItem.value = { _id: "", name: "", price: 0, floor: "", status: "available" };
    editedIndex.value = -1;
};

// โหลดข้อมูลเมื่อเริ่มต้น
onMounted(fetchTables);
</script>

<style>
.form-control {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #f0eeee;
    border-radius: 5px;
}

.form-control:focus {
    outline: none;
    border-color: #3f51b5;
}

.highlight {
    background-color: #3f51b5;
    color: white;
    font-weight: bold;
}

.select-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
}

.select-wrapper .form-control {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 2.5rem;
    width: 100%;
}

.select-wrapper .select-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #6c757d;
}

* {
    font-family: 'Prompt', 'sans-serif';
}
</style>
