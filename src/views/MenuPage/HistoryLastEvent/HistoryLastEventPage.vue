<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import API_PATH from "@/config/apiPath";
import LastProfitEvent from '@/components/dashboards/dashboard1/LastProfitEvent.vue';


interface Booking {
    idBooking: string;
    customer: { name: string; profileImage: string; phoneNumber: string };
    table: { name: string; floor: number; price: number };
    concert: { name: string; location: string; status: string };
    statusPayment: string;
    statusStaffProof: string;
    verifiedBy?: { username: string; role: string }; // เพิ่มข้อมูลผู้ยืนยัน
    verifiedAt?: string; // เพิ่มข้อมูลเวลายืนยัน
}

const bookings = ref<Booking[]>([]);
const search = ref("");
const page = ref(1);
const itemsPerPage = 10;
const message = ref("");
const showDialog = ref(false);
const selectedBookingId = ref<string>('');
const enteredBookingId = ref<string | null>(null);
const selectedTab = ref("all"); // ตัวเลือกแท็บ ("all", "verified", "not-verified")


// จำนวนข้อมูล
const totalBookings = computed(() => bookings.value.length);
const verifiedBookings = computed(() =>
    bookings.value.filter((booking) => booking.statusStaffProof === "verified").length
);
const notVerifiedBookings = computed(() =>
    bookings.value.filter((booking) => booking.statusStaffProof === "not-verified").length
);

// ตัวเลือกกราฟ
const chartOptions = computed(() => ({
    series: [totalBookings.value, verifiedBookings.value, notVerifiedBookings.value],
    labels: ["ทั้งหมด", "ยืนยันแล้ว", "ยังไม่ยืนยัน"],
    chart: {
        type: "donut",
        height: 200,
        fontFamily: "'Prompt', sans-serif",
    },
    colors: ["#2196f3", "#4caf50", "#f44336"], // สีสำหรับแต่ละสถานะ
    tooltip: {
        enabled: true, // เปิด tooltip
        theme: "dark",
        y: {
            formatter: (value: number) => `${value} คน`, // แสดงข้อมูลใน tooltip
        },
    },
    dataLabels: {
        enabled: true, // แสดง Label ในวงกลม
        style: {
            fontSize: "10px",
            fontWeight: "bold",
        },
        formatter: (_: string, opts: any) =>
            `${opts.w.globals.series[opts.seriesIndex]} คน`, // แสดงข้อมูลจำนวนในวงกลม
    },
    legend: { show: false }, // ไม่แสดง legend ใต้ Chart
    plotOptions: {
        pie: {
            donut: {
                size: "60%", // ขนาดของวงใน
                labels: {
                    show: true,
                    total: {
                        show: true,
                        label: "ทั้งหมด",
                        formatter: () => `${totalBookings.value} คน`,
                    },
                },
            },
        },
    },
}));

const fetchBookings = async () => {
    try {
        const response = await axios.get(API_PATH.GET_BOOKING_ALL);
        console.log("Raw bookings data:", response.data.bookings);

        // กรองข้อมูลเฉพาะ Concert ที่ยัง Active
        bookings.value = response.data.bookings.filter(
            (booking: Booking) => booking.concert.status === "Active"
        );

        console.log("Filtered bookings (Active):", bookings.value);
    } catch (error: any) {
        console.error("Error fetching bookings:", error.message);
        message.value = "ไม่สามารถดึงข้อมูลการจองได้";
    }
};


const filteredBookings = computed(() =>
    bookings.value.filter((booking) => {
        // กรองข้อมูลตามสถานะที่เลือกในแท็บ
        if (selectedTab.value === "verified") {
            return booking.statusStaffProof === "verified";
        }
        if (selectedTab.value === "not-verified") {
            return booking.statusStaffProof === "not-verified";
        }
        return true; // "all" คืนค่าข้อมูลทั้งหมด
    }).filter((booking) =>
        // กรองข้อมูลตามคำค้นหา
        booking.customer.name.toLowerCase().includes(search.value.toLowerCase()) ||
        booking.customer.phoneNumber.includes(search.value) ||
        booking.idBooking.toLowerCase().includes(search.value.toLowerCase())
    )
);

const updateStatus = async () => {
    if (!selectedBookingId.value || enteredBookingId.value !== selectedBookingId.value) {
        message.value = "ไอดีการจองไม่ถูกต้อง";
        return;
    }
    try {
        const response = await axios.put(
            API_PATH.STAFF_SCAN_QR.replace(":id", selectedBookingId.value),
            { statusStaffProof: "verified" }
        );
        message.value = response.data.message || "อัปเดตสถานะสำเร็จ";
        await fetchBookings();
        showDialog.value = false;
    } catch (error: any) {
        console.error("Error updating booking status:", error.message);
        message.value = "ไม่สามารถอัปเดตสถานะได้";
    }
};

onMounted(() => {
    fetchBookings();
});
</script>


<template>

<v-card elevation="0" class="mb-8 p-0">
    <v-row>
        <!-- ด้านซ้าย: ApexChart -->
        <v-col cols="12" md="6" elevation="1"> <!-- เปลี่ยน cols="6" เป็น cols="12" md="6" -->
            <v-card-item class="p-2">
                <apexchart type="donut" :options="chartOptions" :series="chartOptions.series"></apexchart>

                <v-row class="d-flex align-center justify-space-between">
                    <v-col cols="4" class="d-flex align-center">
                        <div class="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                        <div>
                            <h5 class="text-xl font-bold text-blue-700">{{ totalBookings }}</h5>
                            <h6 class="text-sm text-gray-600">จองทั้งหมด</h6>
                        </div>
                    </v-col>

                    <v-col cols="4" class="d-flex align-center">
                        <div class="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <div>
                            <h5 class="text-xl font-bold text-green-700">{{ verifiedBookings }}</h5>
                            <h6 class="text-sm text-gray-600">ยืนยันแล้ว</h6>
                        </div>
                    </v-col>

                    <v-col cols="4" class="d-flex align-center">
                        <div class="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                        <div>
                            <h5 class="text-xl font-bold text-red-700">{{ notVerifiedBookings }}</h5>
                            <h6 class="text-sm text-gray-600">ยังไม่ยืนยัน</h6>
                        </div>
                    </v-col>
                </v-row>

            </v-card-item>
        </v-col>

        <!-- ด้านขวา: LastProfitEvent -->
        <v-col cols="12" md="6"> <!-- เปลี่ยน cols="6" เป็น cols="12" md="6" -->
            <LastProfitEvent />
        </v-col>
    </v-row>
</v-card>


    <!-- ค้นหา -->
    <v-text-field v-model="search" label="ค้นหาโดยชื่อ, เบอร์โทร หรือไอดีการจอง" variant="outlined" dense
        class="mb-0"></v-text-field>

    <!-- Tabs -->
    <v-tabs v-model="selectedTab" class="mb-4">
        <v-tab value="all">ทั้งหมด</v-tab>
        <v-tab value="not-verified">ยังไม่ยืนยัน</v-tab>
        <v-tab value="verified">ยืนยันแล้ว</v-tab>
    </v-tabs>

    <!-- เงื่อนไขแสดงผล -->
    <div v-if="bookings.length === 0">
        <p class="text-gray-500 text-center mt-8 text-lg">ยังไม่มีข้อมูล event ปัจจุบัน</p>
    </div>
    <div v-else>
        <!-- ตารางข้อมูล -->
        <v-table>
            <thead>
                <tr>
                    <th>ไอดีการจอง</th>
                    <th>ลูกค้า</th>
                    <th>โต๊ะ</th>
                    <th>คอนเสิร์ต</th>
                    <th class="text-subtitle-1 font-weight-semibold">สถานะการจ่ายเงิน</th>
                    <th>สถานะกานยืนยัน</th>
                    <th>ยืนยันด้วย</th> <!-- คอลัมน์ใหม่ -->
                    <th>การดำเนินการ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(booking, index) in filteredBookings.slice((page - 1) * itemsPerPage, page * itemsPerPage)"
                    :key="index">
                    <td class="text-subtitle-1 font-weight-semibold mb-1">{{ booking.idBooking }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <div class="ml-3">
                                <h4 class="text-subtitle-1 font-weight-semibold mb-1">ชื่อ : {{
                                    booking.customer.name }}</h4>
                                <p class="text-sm text-gray-500">เบอร์โทร : {{ booking.customer.phoneNumber }}</p>
                            </div>
                        </div>
                    </td>
                    <!-- โต๊ะ -->
                    <td>
                        <p class="text-subtitle-1  mb-1 mt-3">โต๊ะ: {{ booking.table.name }}</p>
                        <p class="text-subtitle-1  mb-1">ชั้น: {{ booking.table.floor }}</p>
                        <p class="text-subtitle-1  mb-1">ราคา: {{ booking.table.price }} บาท</p>
                    </td>
                    <td class="text-subtitle-1  mb-1">{{ booking.concert.name }}</td>
                    <!-- สถานะการจ่ายเงิน -->
                    <td>
                        <span :class="{
                            'bg-green-100 text-green-700 px-3 py-1 rounded-full': booking.statusPayment === 'paid',
                            'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full': booking.statusPayment === 'pending',
                            'bg-red-100 text-red-700 px-3 py-1 rounded-full': booking.statusPayment === 'unpaid'
                        }">
                            {{ booking.statusPayment === 'paid' ? 'จ่ายแล้ว' : booking.statusPayment === 'pending' ?
                                'รอดำเนินการ' : 'ยังไม่จ่าย' }}
                        </span>
                    </td>
                    <td>
                        <span :class="{
                            'bg-green-100 text-green-700 px-3 py-1 rounded-full': booking.statusStaffProof === 'verified',
                            'bg-red-100 text-red-700 px-3 py-1 rounded-full': booking.statusStaffProof === 'not-verified'
                        }">
                            {{ booking.statusStaffProof === 'verified' ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน' }}
                        </span>
                    </td>
                    <td>
                        <div v-if="booking.verifiedBy && booking.verifiedAt">
                            <p>ชื่อ: {{ booking.verifiedBy.username }}</p>
                            <p>Role: {{ booking.verifiedBy.role }}</p>
                            <p>
                                เวลา: {{ new Date(booking.verifiedAt).toLocaleDateString("en-GB") }}
                                {{ new Date(booking.verifiedAt).toLocaleTimeString("en-GB", { hour12: false }) }}
                            </p>
                        </div>
                        <div v-else>
                            <p class="text-gray-500">ยังไม่มีการยืนยัน</p>
                        </div>
                    </td>

                    <td>
                        <v-btn class="bg-indigo-600 text-white px-4 py-2 rounded"
                            :disabled="booking.statusStaffProof === 'verified'"
                            :class="booking.statusStaffProof === 'verified' ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600'"
                            @click="() => {
                                if (booking.statusStaffProof !== 'verified') {
                                    showDialog = true;
                                    selectedBookingId = booking.idBooking;
                                    enteredBookingId = '';
                                }
                            }">
                            {{ booking.statusStaffProof === 'verified' ? 'ยืนยันแล้ว' : 'ยืนยัน' }}
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <!-- Pagination -->
        <v-pagination v-model="page" :length="Math.ceil(filteredBookings.length / itemsPerPage)"></v-pagination>

        <!-- Dialog -->
        <v-dialog v-model="showDialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <h3>ยืนยันการเปลี่ยนสถานะ</h3>
                </v-card-title>
                <v-card-text>
                    <p class="mb-5">กรุณากรอกไอดีการจองเพื่อยืนยัน: <strong>{{ selectedBookingId }}</strong></p>
                    <v-text-field v-model="enteredBookingId" label="ไอดีการจอง" variant="outlined" dense></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn class="bg-gray-500 text-white px-4 py-2 rounded" @click="showDialog = false">
                        ยกเลิก
                    </v-btn>
                    <v-btn class="bg-indigo-600 text-white px-4 py-2 rounded"
                        :disabled="enteredBookingId !== selectedBookingId" @click="updateStatus">
                        ยืนยัน
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style>
* {
    font-family: 'Prompt', 'sans-serif';
}
.v-card-item {
  padding: 0.5rem !important; /* เปลี่ยนค่า default padding */
}
.v-card-text {
  padding: 1.0rem !important; /* เปลี่ยนค่า default padding */
}
</style>