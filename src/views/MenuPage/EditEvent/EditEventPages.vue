<template>
    <v-container>
        <v-form>
            <v-row>
                <!-- แสดงรูปภาพ Event -->
                <v-col cols="12" md="4">
                    <v-card class="mb-4 elevation-0 " v-if="eventToEdit.imgConcert">
                        <v-img :src="eventToEdit.imgConcert" alt="รูปภาพ Event" max-height="250" />
                    </v-card>
                    <v-file-input label="คลิกเพื่อเปลี่ยนรูปภาพ Event" outlined accept="image/*"
                        @change="handleFileChange" />
                </v-col>

                <!-- ข้อมูล Event -->
                <v-col cols="12" md="8">
                    <v-text-field label="ชื่อ Event" v-model="eventToEdit.name" outlined />
                    <v-text-field label="วันที่เริ่มต้น" v-model="formattedDateStart" outlined type="date" />
                    <v-text-field label="วันที่สิ้นสุด" v-model="formattedDateEnd" outlined type="date" />
                    <v-text-field label="สถานที่" v-model="eventToEdit.location" outlined />
                    <v-text-field label="จำนวนตั๋วทั้งหมด" v-model="eventToEdit.totalTickets" outlined type="number" />

                </v-col>
            </v-row>

            <!-- ราคาของ Event -->
            <div>
                <h3 class="text-h3 mb-4">ราคา</h3>
                <v-row v-for="(price, index) in eventToEdit.prices" :key="index" class="mb-2">
                    <v-col cols="6" class="pa-1" style="margin-bottom: -30px;">
                        <v-text-field v-model="price.type" label="ประเภท" outlined />
                    </v-col>
                    <v-col cols="6" class="pa-1" style="margin-bottom: -30px;">
                        <v-text-field v-model="price.amount" label="ราคา" outlined type="number" />
                    </v-col>
                </v-row>
                <v-btn color="success" small class="mt-5 mb-5" @click="addPrice">เพิ่มราคา</v-btn>
            </div>

            <!-- คำอธิบายของ Event -->
            <div>
                <h3 class="text-h3 mb-4">คำอธิบาย</h3>
                <v-row v-for="(desc, index) in eventToEdit.descriptions" :key="index" class="mb-2">
                    <v-col cols="6" class="pa-1" style="margin-bottom: -30px;">
                        <v-text-field v-model="desc.title" label="หัวข้อ" outlined />
                        <v-textarea v-model="desc.contentRaw" label="รายละเอียด" outlined rows="4"
                            @input="desc.content = (desc.contentRaw ?? '').split('\n')" />
                    </v-col>
                </v-row>
                <v-btn color="success" small class="mt-5 mb-5" @click="addDescription">เพิ่มคำอธิบาย</v-btn>
            </div>

            <!-- ส่วนเลือกโต๊ะ -->
            <div>
                <h3 class="text-h3 mb-4">เลือกโต๊ะ</h3>
                <div class="d-flex gap-2 mb-4">
                    <v-btn color="success" @click="selectAllAvailableTables">เลือกโต๊ะทั้งหมด</v-btn>
                    <v-btn color="error" @click="clearTableSelection">ยกเลิกเลือกทั้งหมด</v-btn>
                </div>
                <v-row>
                    <v-col cols="12" sm="6" md="2" v-for="table in [...availableTables, ...usedTables]"
                        :key="table._id">
                        <div class="relative py-3 px-3 w-100 border border-dashed rounded-md"
                            :class="table.isDisabled ? 'bg-gray-200' : 'bg-white'">
                            <!-- Delete Icon -->
                            <v-icon v-if="table.isDisabled" small
                                class="absolute top-2 right-2 cursor-pointer text-red-500"
                                @click="confirmDeleteTable(table)">
                                mdi-delete
                            </v-icon>
                            <!-- Checkbox for Selecting Tables -->
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


            <v-btn color="primary" rounded="pill" @click="updateEvent" :loading="isSubmitting" :disabled="isSubmitting"
                class="mt-4">
                บันทึก
            </v-btn>
        </v-form>

        <!-- Delete Confirmation Modal -->
        <v-dialog v-model="isDeleteModalOpen" persistent max-width="400px">
            <v-card>
                <v-card-title>ยืนยันการลบ</v-card-title>
                <v-card-text>
                    <p>คุณต้องการลบโต๊ะ <strong>{{ selectedTableToDelete?.name }}</strong> หรือไม่?</p>
                    <p v-if="selectedTableToDelete?.status === 'reserved'" class="text-red-500">
                        ไม่สามารถลบได้เนื่องจากโต๊ะนี้ถูกจองแล้ว
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" @click="cancelDelete">ยกเลิก</v-btn>
                    <v-btn color="success" @click="deleteTableConfirm"
                        :disabled="selectedTableToDelete?.status === 'reserved'">
                        ลบ
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Toast Message -->
        <v-snackbar v-model="showToast" :color="toastColor" timeout="3000" style="z-index: 9999;">
            {{ toastMessage }}
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import API_PATH from '@/config/apiPath';

// Interfaces
interface Event {
    name: string;
    dateStart: string;
    dateEnd: string;
    location: string;
    prices: { type: string; amount: number }[];
    descriptions: { title: string; content: string[]; contentRaw?: string }[];
    totalTickets: number;
    imgConcert?: File | string | null;
    tables: string[];
}

interface Table {
    _id: string;
    name: string;
    floor: number;
    status: string;
    price: number;
    isDisabled?: boolean;
    isUsing?: boolean; // เพิ่มฟิลด์นี้
    message?: string;
}

const router = useRouter();
const route = useRoute();

// Data
const eventId = route.params.id as string;
const eventToEdit = ref<Event>({
    name: '',
    dateStart: '',
    dateEnd: '',
    location: '',
    prices: [{ type: '', amount: 0 }],
    descriptions: [{ title: '', content: [''], contentRaw: '' }],
    totalTickets: 0,
    imgConcert: null,
    tables: [],
});

const isSubmitting = ref(false);
const availableTables = ref<Table[]>([]);
const usedTables = ref<Table[]>([]);
const selectedTables = ref<(string | Table)[]>([]);
const selectedTableToDelete = ref<Table | null>(null);
const isDeleteModalOpen = ref(false);

const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('');

// Select all tables that are "ยังไม่ได้เพิ่มโต๊ะนี้"
const selectAllAvailableTables = () => {
    selectedTables.value = availableTables.value
        .filter((table) => !table.isDisabled)
        .map((table) => table._id);
};

// Clear all selected tables
const clearTableSelection = () => {
    selectedTables.value = [];
};

// Fetch available tables
const fetchAvailableTables = async () => {
    try {
        const response = await axios.get(API_PATH.GET_TABLE_AVAILLABLE);
        availableTables.value = response.data.map((table: Table) => ({
            ...table,
            isDisabled: false,
            message: 'ยังไม่ได้เพิ่มโต๊ะนี้',
        }));
    } catch (error) {
        console.error('Error fetching available tables:', error);
    }
};

// Fetch used tables
const fetchUsedTables = async () => {
    try {
        const response = await axios.get(API_PATH.GET_TABLE_USE);
        usedTables.value = response.data.map((table: Table) => ({
            ...table,
            isDisabled: true,
            message: 'โต๊ะนี้ถูกเพิ่มแล้ว',
        }));
    } catch (error) {
        console.error('Error fetching used tables:', error);
    }
};

// Fetch event details and initialize selected tables
const fetchEvent = async () => {
    try {
        const response = await axios.get(API_PATH.GET_EVENT_BY_ID.replace(':id', eventId));
        const event = response.data;

        eventToEdit.value = {
            ...event,
            descriptions: event.descriptions.map((desc: any) => ({
                title: desc.title,
                content: desc.content || [],
                contentRaw: (desc.content || []).join('\n'),
            })),
        };

        // Set selected tables from event data
        selectedTables.value = event.tables || [];

        // Fetch tables data
        await Promise.all([fetchAvailableTables(), fetchUsedTables()]);
    } catch (error) {
        console.error('Error fetching event:', error);
    }
};

// Open delete confirmation modal
const confirmDeleteTable = (table: Table) => {
    selectedTableToDelete.value = table;
    isDeleteModalOpen.value = true;
};

// Cancel delete operation
const cancelDelete = () => {
    selectedTableToDelete.value = null;
    isDeleteModalOpen.value = false;
};

// Confirm deletion of a table
const deleteTableConfirm = async () => {
    if (!selectedTableToDelete.value) return;

    try {
        const { _id } = selectedTableToDelete.value;

        // เรียก API เพื่อทำการลบโต๊ะ
        await axios.delete(
            `${API_PATH.DELETE_TABLE_FROM_CONCERT.replace(":concertId", eventId).replace(":tableId", _id)}`
        );

        toastMessage.value = "ลบโต๊ะสำเร็จ";
        toastColor.value = "success";
        showToast.value = true;

        // Refresh หน้าเว็บหลังจากลบเสร็จ
        window.location.reload();
    } catch (error) {
        console.error("Error deleting table:", error);
        toastMessage.value = error.response?.data?.error || "เกิดข้อผิดพลาดในการลบโต๊ะ";
        toastColor.value = "error";
        showToast.value = true;
    } finally {
        isDeleteModalOpen.value = false;
        selectedTableToDelete.value = null;
    }
};



// File input handler
const handleFileChange = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    if (target?.files?.[0]) {
        eventToEdit.value.imgConcert = target.files[0];
    }
};

// Functions
const addPrice = () => {
    eventToEdit.value.prices.push({ type: '', amount: 0 });
};

const addDescription = () => {
    eventToEdit.value.descriptions.push({ title: '', content: [], contentRaw: '' });
};

// Computed properties for formatted dates
const formattedDateStart = computed({
    get: () => {
        if (!eventToEdit.value.dateStart) return '';
        return new Date(eventToEdit.value.dateStart).toISOString().split('T')[0];
    },
    set: (value: string) => {
        eventToEdit.value.dateStart = value;
    },
});

const formattedDateEnd = computed({
    get: () => {
        if (!eventToEdit.value.dateEnd) return '';
        return new Date(eventToEdit.value.dateEnd).toISOString().split('T')[0];
    },
    set: (value: string) => {
        eventToEdit.value.dateEnd = value;
    },
});

// Update event handler
const updateEvent = async () => {
    isSubmitting.value = true;

    try {
        // ตรวจสอบข้อมูลโต๊ะที่เลือก
        if (!selectedTables.value.length) {
            console.error('No tables selected.');
            toastMessage.value = 'กรุณาเลือกโต๊ะอย่างน้อย 1 โต๊ะก่อนทำการบันทึก';
            toastColor.value = 'error';
            showToast.value = true; // แสดง Toast Message
            isSubmitting.value = false;
            return;
        }

        // สร้างสำเนา eventToEdit และเตรียมข้อมูล
        const eventData = {
            ...eventToEdit.value,
            descriptions: eventToEdit.value.descriptions.map(({ title, content }) => ({
                title,
                content,
            })), // ลบ contentRaw
            tables: selectedTables.value.map((tableId) => {
                // แปลง Object เป็น String ของ `_id`
                return typeof tableId === 'string' ? tableId : tableId._id;
            }),
        };

        // ตรวจสอบข้อมูลก่อนแปลงเป็น FormData
        console.log('Event Data Before Submit:', eventData);

        // สร้าง FormData
        const formData = new FormData();
        formData.append('name', eventData.name);
        formData.append('dateStart', eventData.dateStart);
        formData.append('dateEnd', eventData.dateEnd);
        formData.append('location', eventData.location);
        formData.append('prices', JSON.stringify(eventData.prices));
        formData.append('descriptions', JSON.stringify(eventData.descriptions));
        formData.append('totalTickets', String(eventData.totalTickets));
        formData.append('tables', JSON.stringify(eventData.tables)); // ส่ง tables เป็น JSON ที่มี `_id` เป็น String

        // ตรวจสอบว่ามีรูปภาพและแปลงเป็น File หากจำเป็น
        if (eventData.imgConcert instanceof File) {
            formData.append('imgConcert', eventData.imgConcert);
        } else if (typeof eventData.imgConcert === 'string') {
            formData.append('imgConcert', eventData.imgConcert);
        } else {
            formData.append('imgConcert', '');
        }

        // Debug ตรวจสอบข้อมูล FormData
        console.log('FormData Before Submit:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        // ส่งข้อมูลไปยัง API
        const response = await axios.put(API_PATH.UPDATE_EVENT.replace(':id', eventId), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        toastMessage.value = 'อัปเดต Event สำเร็จ';
        toastColor.value = 'success';
        showToast.value = true; // แสดง Toast Message
        router.push('/event');
    } catch (error) {
        const err = error as any;
        const errorMessage = err.response?.data?.error || err.message || 'เกิดข้อผิดพลาดในการอัปเดต Event';
        // ใช้ Toast Message แทน alert
        toastMessage.value = errorMessage;
        toastColor.value = 'error';
        showToast.value = true; // แสดง Toast Message
    } finally {
        isSubmitting.value = false;
    }
};


// On component mount
onMounted(() => {
    fetchEvent();
});
</script>
