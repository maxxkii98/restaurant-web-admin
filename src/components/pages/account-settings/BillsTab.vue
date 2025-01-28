
<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import API_PATH from "@/config/apiPath";

// State สำหรับจัดการข้อมูล
const photos = ref([]); // เก็บข้อมูล galleryImages
const selectedFiles = ref<File[]>([]); // ไฟล์ใหม่ที่ต้องการอัปโหลด
const isSubmitting = ref(false);
const error = ref("");

// State สำหรับ Snackbar
const showToast = ref(false);
const toastMessage = ref("");
const toastColor = ref("");

// State สำหรับ Modal ยืนยันการลบ
const showDeleteModal = ref(false); // เปิด/ปิด Modal
const selectedImageToDelete = ref(""); // เก็บ URL ของรูปที่เลือกจะลบ

// ดึงข้อมูล galleryImages จาก API
const fetchPhotos = async () => {
  try {
    const response = await axios.get(API_PATH.GET_GALLERY_IMAGES);
    photos.value = response.data;
  } catch (err: any) {
    error.value = err.response?.data?.error || "ไม่สามารถโหลดข้อมูลได้";
  }
};

// อัปเดตรูป galleryImages (เพิ่มรูปใหม่)
const updatePhotos = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();

    // ใส่ไฟล์ใหม่
    selectedFiles.value.forEach((file) => {
      formData.append("files", file);
    });

    // เรียก API อัปเดต
    await axios.put(API_PATH.UPDATE_GALLERY_IMAGES, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // แสดงข้อความสำเร็จ
    toastMessage.value = "อัปเดตรูปภาพสำเร็จ!";
    toastColor.value = "success";
    showToast.value = true;

    selectedFiles.value = []; // รีเซ็ตไฟล์ที่เลือก
    fetchPhotos(); // โหลดข้อมูลใหม่
  } catch (err: any) {
    toastMessage.value = "เกิดข้อผิดพลาดในการอัปเดตรูปภาพ";
    toastColor.value = "error";
    showToast.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

// แสดง Modal ยืนยันการลบ
const confirmDeletePhoto = (imageUrl: string) => {
  selectedImageToDelete.value = imageUrl; // เก็บ URL รูปที่ต้องการลบ
  showDeleteModal.value = true; // เปิด Modal
};

// ลบรูปภาพ
const deletePhoto = async () => {
  try {
    await axios.delete(API_PATH.UPDATE_GALLERY_IMAGES, {
      data: { imageUrl: selectedImageToDelete.value },
    });

    // แสดงข้อความสำเร็จ
    toastMessage.value = "ลบรูปภาพสำเร็จ!";
    toastColor.value = "success";
    showToast.value = true;

    fetchPhotos(); // โหลดข้อมูลใหม่
  } catch (err: any) {
    toastMessage.value = "เกิดข้อผิดพลาดในการลบรูปภาพ";
    toastColor.value = "error";
    showToast.value = true;
  } finally {
    showDeleteModal.value = false; // ปิด Modal
  }
};

// โหลดข้อมูลเมื่อ Component ถูก mount
onMounted(() => {
  fetchPhotos();
});
</script>


<template>
    <v-row>
      <v-col cols="12">
        <v-card elevation="10" class="bg-surface pa-4">
          <v-card-item>
            <h4 class="text-h4 mb-4">รูปภาพ</h4>
  
            <!-- ข้อความแจ้งเตือน -->
            <p class="mb-4 text-red-600 text-lg">
              กรุณาอัปโหลดรูปภาพที่มีขนาด 893x593 พิกเซล เพื่อให้แสดงผลได้ดีที่สุด
            </p>
  
            <!-- ข้อความแจ้งข้อผิดพลาด -->
            <div v-if="error" class="text-error mb-4">{{ error }}</div>
  
            <!-- แสดงรูปภาพ galleryImages -->
            <v-row class="gy-4">
              <v-col cols="4" v-for="(item, index) in photos" :key="index">
                <img
                  :src="item"
                  :alt="`Photo ${index}`"
                  class="w-100 rounded-md mb-2"
                />
                <v-btn
                  color="error"
                  small
                  class="mt-2"
                  @click="confirmDeletePhoto(item)"
                >
                  ลบรูปภาพ
                </v-btn>
              </v-col>
            </v-row>
  
            <!-- อัปโหลดรูปใหม่ -->
            <v-file-input
              multiple
              label="เพิ่มรูปภาพใหม่"
              variant="outlined"
              prepend-icon="mdi-camera"
              accept="image/*"
              v-model="selectedFiles"
              hide-details
              class="mt-4"
            ></v-file-input>
  
            <!-- ปุ่มอัปเดต -->
            <div class="d-flex justify-end mt-4">
              <v-btn
                color="primary"
                rounded
                :loading="isSubmitting"
                @click="updatePhotos"
              >
                อัปเดต
              </v-btn>
            </div>
          </v-card-item>
        </v-card>
  
        <!-- Snackbar -->
        <v-snackbar v-model="showToast" :color="toastColor" timeout="3000">
          {{ toastMessage }}
        </v-snackbar>
  
        <!-- Modal ยืนยันการลบ -->
        <v-dialog v-model="showDeleteModal" max-width="400px" class="p-4 py-5 font-prompt">
          <v-card>
            <v-card-title class="text-h6">ยืนยันการลบรูปภาพ</v-card-title>
            <v-card-text>คุณต้องการลบรูปภาพนี้ใช่หรือไม่?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="showDeleteModal = false">
                ยกเลิก
              </v-btn>
              <v-btn color="primary" @click="deletePhoto">
                ยืนยัน
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </template>
  