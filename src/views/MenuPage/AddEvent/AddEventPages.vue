<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import API_PATH from '@/config/apiPath';
import { useRouter } from 'vue-router';

// Interface for Event
interface Event {
    name: string;
    dateStart: string;
    dateEnd: string;
    location: string;
    prices: { type: string; amount: number }[];
    descriptions: { title: string; content: string[]; contentRaw?: string }[]; // เพิ่ม contentRaw
    totalTickets: number;
    imgConcert?: File | string | null;
    tables: string[]; // Array ของ tableId ที่เลือก
}

// Interface for Table

// Interface for Table
interface Table {
    _id: string;
    name: string;
    floor: number;
    status: string;
    price: number;
    isUsing: boolean;
    isDisabled?: boolean; // เพิ่มฟิลด์นี้
    message?: string;
}

// State management
const router = useRouter();
const newEvent = ref<Event>({
    name: "",
    dateStart: "",
    dateEnd: "",
    location: "",
    prices: [{ type: "", amount: 0 }],
    descriptions: [{ title: "", content: [""] }],
    totalTickets: 0,
    imgConcert: null,
    tables: [], // เริ่มต้นเป็น array ว่าง
})

const isSubmitting = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('');
const availableTables = ref<Table[]>([]);
const selectedTables = ref<string[]>([]);


// ดึงข้อมูลโต๊ะจาก API พร้อมตรวจสอบสถานะ `IsUsing`
const fetchAvailableTables = async () => {
    try {
        const response = await axios.get(API_PATH.GET_TABLE_AVAILLABLE);
        return response.data.map((table: Table): Table => ({
            ...table,
            isDisabled: false, // ใช้งานได้
            message: "สามารถเลือกได้",
        }));
    } catch (error) {
        console.error("Error fetching available tables:", error);
        throw new Error("Error fetching available tables");
    }
};

const fetchUsedTables = async () => {
    try {
        const response = await axios.get(API_PATH.GET_TABLE_USE);
        return response.data.map((table: Table): Table => ({
            ...table,
            isDisabled: true, // ไม่สามารถใช้งานได้
            message: "ถูกใช้งานแล้ว",
        }));
    } catch (error) {
        console.error("Error fetching used tables:", error);
        throw new Error("Error fetching used tables");
    }
};

const fetchTables = async () => {
    try {
        // ดึงข้อมูลแบบแยกส่วน
        const [availableTablesData, usedTablesData] = await Promise.all([
            fetchAvailableTables(),
            fetchUsedTables(),
        ]);

        // รวมข้อมูล โดยใช้ `_id` เป็นตัวกรองข้อมูลซ้ำ
        const combinedTablesMap = new Map<string, Table>();

        // เพิ่มโต๊ะที่ใช้งานไม่ได้ก่อน
        usedTablesData.forEach((table: Table) => {
            combinedTablesMap.set(table._id, table);
        });

        // เพิ่มโต๊ะที่ใช้งานได้ (ถ้าไม่ซ้ำกับโต๊ะที่ถูกใช้งานแล้ว)
        availableTablesData.forEach((table: Table) => {
            if (!combinedTablesMap.has(table._id)) {
                combinedTablesMap.set(table._id, table);
            }
        });

        // แปลง Map กลับไปเป็น Array
        availableTables.value = Array.from(combinedTablesMap.values());

        console.log("Final Combined Tables:", availableTables.value); // Debug ข้อมูลหลังรวม
    } catch (error) {
        console.error("Error fetching tables:", error);
        toastMessage.value = "เกิดข้อผิดพลาดในการดึงข้อมูลโต๊ะ";
        toastColor.value = "error";
        showToast.value = true;
    }
};




// ฟังก์ชันเลือกโต๊ะทั้งหมด
const selectAllTables = () => {
    selectedTables.value = availableTables.value
        .filter((table) => !table.isDisabled) // เลือกเฉพาะโต๊ะที่สามารถเลือกได้
        .map((table) => table._id);
    console.log("Selected Tables:", selectedTables.value); // Debug การเลือกโต๊ะทั้งหมด
};

// ฟังก์ชันยกเลิกการเลือกทั้งหมด
const clearSelection = () => {
    selectedTables.value = [];
};

// ฟังก์ชันดึงชื่อโต๊ะตาม ID
const getTableNameById = (id: string) => {
    const table = availableTables.value.find((table) => table._id === id);
    if (!table) {
        console.error(`Table with ID ${id} not found`);
    }
    return table ? table.name : "ไม่พบโต๊ะ";
};

// บันทึก Event ใหม่
const saveNewEvent = async () => {
    isSubmitting.value = true;

    try {
        // ตรวจสอบโต๊ะที่เลือก
        console.log("Selected Tables:", selectedTables.value); // Debug ค่า selectedTables
        if (!selectedTables.value.length) {
            toastMessage.value = "กรุณาเลือกโต๊ะก่อนสร้าง Event";
            toastColor.value = "error";
            showToast.value = true;
            isSubmitting.value = false;
            return;
        }
        // เพิ่ม ID ของโต๊ะที่เลือกลงใน newEvent.tables
        newEvent.value.tables = [...selectedTables.value];

        // เตรียมข้อมูลก่อนส่ง
        const eventData = prepareEventData(); // ยังคงเรียกใช้งาน prepareEventData

        // สร้าง FormData
        const formData = new FormData();
        formData.append("name", eventData.name);
        formData.append("dateStart", eventData.dateStart);
        formData.append("dateEnd", eventData.dateEnd);
        formData.append("location", eventData.location);
        formData.append("prices", JSON.stringify(eventData.prices));
        formData.append("descriptions", JSON.stringify(eventData.descriptions));
        formData.append("totalTickets", String(eventData.totalTickets));
        formData.append("tables", JSON.stringify(eventData.tables));

        if (eventData.imgConcert instanceof File) {
            formData.append("imgConcert", eventData.imgConcert);
        } else {
            formData.append("imgConcert", "");
        }

        // Debug ตรวจสอบข้อมูล FormData ก่อนส่ง
        console.log("FormData Entries:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        // ส่งข้อมูลไปยัง API
        const response = await axios.post(API_PATH.CREATE_EVENT, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Success:", response.data);
        toastMessage.value = "สร้าง Event สำเร็จ!";
        toastColor.value = "success";
        showToast.value = true;

        // เปลี่ยนหน้าไปยังหน้าหลัก
        router.push("/event");
    } catch (error) {
        // ตรวจสอบและกำหนดประเภทของ error
        const err = error as any; // หรือระบุประเภทเฉพาะเจาะจง เช่น AxiosError
        console.error("Error response:", err.response?.data || err.message);
        toastMessage.value = err.response?.data?.error || "เกิดข้อผิดพลาดในการสร้าง Event";
        toastColor.value = "error";
        showToast.value = true;
    } finally {
        isSubmitting.value = false;
    }
};



// เพิ่มคำอธิบายใหม่
const addDescription = () => {
    newEvent.value.descriptions.push({ title: "", content: [], contentRaw: "" }); // เพิ่ม contentRaw
};

// เมื่อผู้ใช้พิมพ์ใน v-textarea
const updateContentFromTextarea = (descriptionIndex: number) => {
    const description = newEvent.value.descriptions[descriptionIndex];

    // แปลงข้อความใน contentRaw เป็น Array แยกตามบรรทัด
    description.content = description.contentRaw?.split("\n").map((line) => line.trim()).filter(Boolean) || [];
};

const prepareEventData = () => {
    const preparedEvent = {
        ...newEvent.value,
        descriptions: newEvent.value.descriptions.map(({ title, content }) => ({ title, content })), // ลบ contentRaw
    };

    return preparedEvent;
};

// โหลดข้อมูลเมื่อหน้าเพจพร้อม
onMounted(() => {
    fetchTables();
    console.log("Available Tables on Mount:", availableTables.value);
});

// Handle file input change
const handleFileChange = (e: Event & { target: HTMLInputElement }) => {
    if (e.target && e.target.files && e.target.files[0]) {
        newEvent.value.imgConcert = e.target.files[0];
        console.log("Selected file:", e.target.files[0]);
    }
};
</script>

<template>
    <v-container class="font-prompt">
        <v-form>
            <v-text-field label="ชื่อ Event" v-model="newEvent.name" outlined />
            <v-text-field label="วันที่เริ่มต้น" v-model="newEvent.dateStart" outlined type="date" />
            <v-text-field label="วันที่สิ้นสุด" v-model="newEvent.dateEnd" outlined type="date" />
            <v-text-field label="สถานที่" v-model="newEvent.location" outlined />
            <v-text-field label="จำนวนตั๋วทั้งหมด" v-model="newEvent.totalTickets" outlined type="number" />
            <v-file-input label="รูปภาพ Event" outlined accept="image/*" @change="handleFileChange" />

            <!-- Prices -->
            <div>
                <h3 class="text-h3 mb-4">ราคา</h3>
                <v-row v-for="(price, index) in newEvent.prices" :key="index" class="mb-1 pa-0">
                    <v-col cols="6" class="pa-1" style="margin-bottom: -30px;">
                        <v-text-field label="ประเภท" v-model="price.type" outlined dense />
                    </v-col>
                    <v-col cols="6" class="pa-1" style="margin-bottom: -30px;">
                        <v-text-field label="ราคา" v-model="price.amount" outlined dense type="number" />
                    </v-col>
                </v-row>

                <v-btn class="mt-5 mb-5" small color="success" @click="newEvent.prices.push({ type: '', amount: 0 })">
                    เพิ่มราคา
                </v-btn>
            </div>

            <!-- Descriptions -->
            <div>
                <h3 class="text-h3 mb-4">คำอธิบาย</h3>
                <v-row v-for="(desc, index) in newEvent.descriptions" :key="index" class="mb-2">
                    <v-col cols="12" class="pa-1">
                        <!-- หัวข้อ -->
                        <v-text-field label="หัวข้อ" v-model="desc.title" outlined />

                        <!-- รายละเอียด -->
                        <v-textarea label="รายละเอียด" outlined rows="4" v-model="desc.contentRaw"
                            @input="updateContentFromTextarea(index)" />
                    </v-col>
                </v-row>

                <v-btn class="mt-5 mb-5" small color="success" @click="addDescription()">
                    เพิ่มคำอธิบาย
                </v-btn>

            </div>

            <!-- ส่วนแสดงผลโต๊ะ -->
            <div>
                <h3 class="text-h3 mb-4">เลือกโต๊ะ</h3>
                 <!-- ปุ่มเลือกทั้งหมด / ยกเลิกทั้งหมด -->
            <div class="d-flex gap-2 mt-3 mb-4">
                <v-btn color="success" @click="selectAllTables">เลือกทั้งหมด</v-btn>
                <v-btn color="error" @click="clearSelection">ยกเลิกทั้งหมด</v-btn>
            </div>

                <v-row>
                    <v-col cols="12" sm="6" md="2" v-for="table in availableTables" :key="table._id">
                        <div class="py-3 px-3 w-100 border border-dashed rounded-md"
                            :class="table.isDisabled ? 'bg-gray-200' : 'bg-white'">
                            <v-checkbox v-model="selectedTables" :value="table._id" color="primary" hide-details
                                :disabled="table.isDisabled">
                                <template v-slot:label>
                                    <div class="d-flex flex-column align-start">
                                        <h6 class="text-h6">{{ table.name }}</h6>
                                        <p>ชั้น: {{ table.floor }}</p>
                                        <p>ราคา: {{ table.price }} บาท</p>
                                        <p :class="table.isDisabled ? 'text-red-500' : 'text-green-500'">
                                            {{ table.message }}
                                        </p>
                                    </div>
                                </template>
                            </v-checkbox>
                        </div>
                    </v-col>
                </v-row>

            </div>


            <!-- แสดงโต๊ะที่เลือก -->
            <!-- <div class="mt-4">
                <h4>โต๊ะที่เลือก:</h4>
                <div v-if="selectedTables.length">
                    <ul>
                        <li v-for="tableId in selectedTables" :key="tableId">
                            {{ getTableNameById(tableId) }}
                        </li>
                    </ul>
                </div>
                <p v-else>ยังไม่ได้เลือกโต๊ะ</p>
            </div> -->


            <v-btn color="primary" rounded="pill" @click="saveNewEvent" :loading="isSubmitting" :disabled="isSubmitting"
                class="mt-4">
                บันทึก
            </v-btn>
        </v-form>

        <!-- Toast Message -->
        <v-snackbar v-model="showToast" :color="toastColor" timeout="3000">
            {{ toastMessage }}
        </v-snackbar>
    </v-container>
</template>
