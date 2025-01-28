<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import API_PATH from '@/config/apiPath';


// Interface for Event
interface Event {
    _id?: string;
    name: string;
    dateStart: string;
    location: string;
    prices: { type: string; amount: number }[];
    descriptions: { title: string; content: string }[]; // content เป็น string
    totalTickets: number;
    imgConcert?: File | string | null;
    status?: string;
}

// State management
const events = ref<Event[]>([]);


const dialog = ref(false);
const isSubmitting = ref(false);
const selectedEventId = ref<string | null>(null);
const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('');


// Fetch events from the API
const fetchEvents = async () => {
    try {
        const response = await axios.get(API_PATH.GET_EVENT);
        events.value = response.data.map((event: any) => ({
            ...event,
            prices: typeof event.prices === 'string' ? JSON.parse(event.prices) : event.prices || [],
            descriptions: typeof event.descriptions === 'string' ? JSON.parse(event.descriptions) : event.descriptions || [],
            status: event.status || 'Unknown', // กำหนดค่าเริ่มต้นหากไม่มีสถานะ
        }));
    } catch (error: any) {
        console.error('Error fetching events:', error);
        toastMessage.value = 'ไม่สามารถโหลดข้อมูล Event ได้';
        toastColor.value = 'error';
        showToast.value = true;
    }
};


// State for delete dialog
const deleteDialog = ref(false);
const eventToDelete = ref<string | null>(null);

// Open delete confirmation dialog
const openDeleteConfirmation = (event: Event) => {
    eventToDelete.value = event._id || null;
    deleteDialog.value = true;
};

// Confirm deletion
const confirmDelete = async () => {
    if (eventToDelete.value) {
        await deleteEvent(eventToDelete.value);
        closeDeleteDialog();
    }
};

// Close delete dialog
const closeDeleteDialog = () => {
    deleteDialog.value = false;
    eventToDelete.value = null;
};


// Delete event
const deleteEvent = async (eventId: string) => {
    try {
        await axios.delete(API_PATH.DELETE_EVENT.replace(':id', eventId));
        toastMessage.value = 'ลบ Event สำเร็จ!';
        toastColor.value = 'success';
        showToast.value = true;
        fetchEvents();
    } catch (error) {
        toastMessage.value = 'เกิดข้อผิดพลาดในการลบ Event';
        toastColor.value = 'error';
        showToast.value = true;
    }
};


// On component mount
onMounted(() => {
    fetchEvents();
});
</script>

<template>
    <v-container class="font-prompt">
        <div class="d-flex justify-end mb-4">
            <v-btn color="primary" @click="$router.push('/addevent')" rounded="pill">
                สร้าง Event
            </v-btn>
        </div>
        <!-- Events Table -->
        <v-table>
            <thead>
                <tr>
                    <th>รูปภาพ</th>
                    <th>ชื่อ Event</th>
                    <th>วันที่</th>
                    <th>สถานที่</th>
                    <th>ราคา</th>
                    <th>จำนวนตั๋ว</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in events" :key="event._id">
                    <td>
                        <v-img v-if="event.imgConcert" :src="event.imgConcert" max-width="400" max-height="400"
                            class="rounded-lg mb-3 w-24 mt-5" contain aspect-ratio="1" />
                    </td>
                    <td>{{ event.name }}</td>
                    <td>{{ new Date(event.dateStart).toLocaleDateString('en-EN', {
                        year: 'numeric', month: 'long', day:
                            'numeric'
                    }) }}</td>
                    <td>{{ event.location }}</td>
                    <td>
                        <ul>
                            <li v-for="price in event.prices" :key="price.type">
                                {{ price.type }}: {{ price.amount }} บาท
                            </li>
                        </ul>
                    </td>
                    <td>{{ event.totalTickets }}</td>
                    <td>
                        <!-- แสดงสถานะ -->
                        <span :class="event.status === 'Active' ? 'text-green-500' : 'text-gray-500'">
                            {{ event.status === 'Active' ? 'กำลังใช้งาน' : 'สิ้นสุด' }}
                        </span>
                    </td>
                    <td>
                        <!-- ปุ่มแก้ไข -->
                        <!-- ปุ่มแก้ไข -->
                        <v-tooltip text="แก้ไข">
                            <template v-slot:activator="{ props }">
                                <v-btn icon flat @click="$router.push(`/editevent/${event._id}`)" v-bind="props">
                                    <v-icon color="primary">mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                        </v-tooltip>


                        <!-- ปุ่มลบ -->
                        <v-tooltip text="ลบ">
                            <template v-slot:activator="{ props }">
                                <v-btn variant="text" icon color="error" small v-if="event._id"
                                    @click="openDeleteConfirmation(event)" v-bind="props">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </td>

                </tr>
            </tbody>
        </v-table>

        <!-- Dialog for Delete Confirmation -->
        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card>
                <v-card-title class="text-h5">ยืนยันการลบ</v-card-title>
                <v-card-text>
                    <p>คุณต้องการลบ Event นี้หรือไม่?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" text @click="closeDeleteDialog">ยกเลิก</v-btn>
                    <v-btn color="error" @click="confirmDelete">ลบ</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!-- Toast Message -->
        <v-snackbar v-model="showToast" :color="toastColor" timeout="3000">
            {{ toastMessage }}
        </v-snackbar>
    </v-container>
</template>
