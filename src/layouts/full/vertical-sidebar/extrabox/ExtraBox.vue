<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router'; // Import useRouter

// ตัวแปรสำหรับเก็บข้อมูล Role และ Username
const username = ref('');
const role = ref('');
const router = useRouter(); // สร้าง instance ของ router

// State สำหรับ v-dialog
const showDialog = ref(false); // ควบคุมการแสดง v-dialog

// ดึงข้อมูลจาก localStorage เมื่อโหลดหน้า
onMounted(() => {
    username.value = localStorage.getItem('username') || 'Unknown User';
    role.value = localStorage.getItem('role') || 'Unknown Role';
});

// ฟังก์ชัน Logout
const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    router.push('/login'); // เปลี่ยนเส้นทางไปหน้า /login
};

// ฟังก์ชันแสดง v-dialog
const confirmLogout = () => {
    showDialog.value = true;
};

// ฟังก์ชันปิด v-dialog
const closeDialog = () => {
    showDialog.value = false;
};
</script>

<template>
    <v-sheet rounded="md" color="lightprimary" class="pa-4 ExtraBox hide-menu">
        <div class="d-flex align-center justify-space-between">
            <!-- Avatar -->
            <v-avatar size="50">
                <img src="@/assets/images/profile/user6.jpg" width="50" alt="User Profile" />
            </v-avatar>

            <!-- User Details -->
            <div>
                <h6 class="text-h6 d-flex align-center font-weight-semibold">{{ username }}</h6>
                <span class="text-subtitle-2 font-weight-medium text-grey100">{{ role }}</span>
            </div>

            <!-- Logout Button -->
            <div>
                <v-btn icon class="bg-lightprimary" flat size="small" @click="confirmLogout">
                    <Icon icon="solar:logout-linear" class="text-primary" stroke-width="3" height="24" width="24" />
                </v-btn>
            </div>
        </div>
    </v-sheet>

    <!-- v-dialog -->
   <!-- v-dialog -->
   <v-dialog v-model="showDialog" width="400">
        <v-card>
            <v-card-title>Confirm Logout</v-card-title>
            <v-card-text>Are you sure you want to log out?</v-card-text>
            <v-card-actions>
                <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
                <v-btn color="error" variant="text" @click="logout">Logout</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style lang="scss">
.ExtraBox {
    position: relative;
}

.line-height-none {
    line-height: normal;
}
</style>
