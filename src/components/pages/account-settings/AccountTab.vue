<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import API_PATH from "@/config/apiPath";

// ข้อมูล SettingProfile
const name = ref("");
const contact = ref({ name: "", phoneNumber: "", lineId: "" });
const about = ref("");
const description = ref("");
const location = ref({ googleMapsUrl: "", latitude: "", longitude: "" });
const logo = ref<File | null>(null); // ใช้สำหรับเก็บไฟล์โลโก้ใหม่
const previewLogo = ref(""); // ใช้สำหรับแสดงตัวอย่างโลโก้
const error = ref("");
const isSubmitting = ref(false);

// State สำหรับ Toast Message
const showToast = ref(false);
const toastMessage = ref("");
const toastColor = ref("");

// ดึงข้อมูลจาก API
const fetchProfile = async () => {
  try {
    const response = await axios.get(API_PATH.GET_SETTING_PROFILE);
    const profile = response.data;

    // กำหนดค่าให้กับฟิลด์
    name.value = profile.name || "";
    contact.value = profile.contact || { name: "", phoneNumber: "", lineId: "" };
    about.value = profile.about || "";
    description.value = profile.description || "";
    location.value = profile.location || { googleMapsUrl: "", latitude: "", longitude: "" };
    previewLogo.value = profile.logo || "";
  } catch (err: any) {
    error.value = err.response?.data?.error || "ไม่สามารถโหลดข้อมูลได้";
  }
};

// อัปเดตข้อมูล
const saveProfile = async () => {
  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("about", about.value);
    formData.append("description", description.value);
    formData.append("contact", JSON.stringify(contact.value));
    formData.append("location", JSON.stringify(location.value));

    if (logo.value) {
      formData.append("logo", logo.value); // เพิ่มไฟล์โลโก้หากมีการเปลี่ยนแปลง
    }

    await axios.put(API_PATH.UPDATE_SETTING_PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // แสดงข้อความสำเร็จ
    toastMessage.value = "บันทึกข้อมูลสำเร็จ!";
    toastColor.value = "success";
    showToast.value = true;

    fetchProfile(); // โหลดข้อมูลใหม่
  } catch (err: any) {
    toastMessage.value = "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
    toastColor.value = "error";
    showToast.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

// อัปเดตโลโก้เมื่อเลือกไฟล์ใหม่
const handleLogoChange = (file: File | null) => {
  if (file) {
    logo.value = file;

    // แสดงตัวอย่างโลโก้
    const reader = new FileReader();
    reader.onload = (e) => {
      previewLogo.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// โหลดข้อมูลเมื่อ Component ถูก mount
onMounted(() => {
  fetchProfile();
});
</script>


<template>
    <v-card elevation="10" class="pa-4">
      <h5 class="text-h5 mb-4">แก้ไขข้อมูลโปรไฟล์</h5>
  
      <!-- ข้อความแจ้งข้อผิดพลาด -->
      <div v-if="error" class="mt-3 text-error">{{ error }}</div>
  
      <!-- ฟอร์ม -->
      <v-row class="ma-sm-n2 ma-n1">
        <v-col cols="12" sm="6">
          <v-label class="mb-2 font-weight-medium">ชื่อร้าน</v-label>
          <v-text-field color="primary" variant="outlined" v-model="name" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-label class="mb-2 font-weight-medium">เกี่ยวกับ</v-label>
          <v-text-field color="primary" variant="outlined" v-model="about" />
        </v-col>
        <v-col cols="12" sm="12">
          <v-label class="mb-2 font-weight-medium">คำอธิบาย</v-label>
          <v-textarea color="primary" variant="outlined" v-model="description" rows="3" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-label class="mb-2 font-weight-medium">ชื่อผู้ติดต่อ</v-label>
          <v-text-field color="primary" variant="outlined" v-model="contact.name" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-label class="mb-2 font-weight-medium">เบอร์โทรศัพท์</v-label>
          <v-text-field color="primary" variant="outlined" v-model="contact.phoneNumber" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-label class="mb-2 font-weight-medium">LINE ID</v-label>
          <v-text-field color="primary" variant="outlined" v-model="contact.lineId" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-label class="mb-2 font-weight-medium">ลิงก์ Google Maps</v-label>
          <v-text-field color="primary" variant="outlined" v-model="location.googleMapsUrl" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-label class="mb-2 font-weight-medium">ละติจูด</v-label>
          <v-text-field color="primary" variant="outlined" v-model="location.latitude" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-label class="mb-2 font-weight-medium">ลองจิจูด</v-label>
          <v-text-field color="primary" variant="outlined" v-model="location.longitude" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-label class="mb-2 font-weight-medium">โลโก้</v-label>
          <v-img :src="previewLogo" alt="Logo Preview" class="mb-3" max-width="150" max-height="150" />
          <v-file-input
            label="อัปโหลดโลโก้"
            variant="outlined"
            prepend-icon="mdi-camera"
            accept="image/*"
            hide-details
            @change="handleLogoChange"
          ></v-file-input>
        </v-col>
      </v-row>
  
      <!-- ปุ่ม -->
      <div class="d-flex justify-end mt-5 pb-3">
        <v-btn
          size="large"
          color="primary"
          rounded="pill"
          class="mr-4"
          :loading="isSubmitting"
          @click="saveProfile"
        >
          บันทึก
        </v-btn>
        <v-btn size="large" class="bg-lighterror text-error" rounded="pill" @click="fetchProfile">
          ยกเลิก
        </v-btn>
      </div>
    </v-card>
  
    <!-- Toast Message -->
    <v-snackbar v-model="showToast" :color="toastColor" timeout="3000">
      {{ toastMessage }}
    </v-snackbar>
  </template>
  