<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import API_PATH from "@/config/apiPath";

const total = ref({
  price: {
    now: 0, // ราคารวมปัจจุบัน
    want: 0, // ราคารวมที่ตั้งไว้
  },
});

const Percentage = computed(() => {
  const { now, want } = total.value.price;
  return want > 0 ? `${((now / want) * 100).toFixed(1)}%` : "0%";
});

const fetchData = async () => {
  try {
    const response = await axios.get(API_PATH.DATA_CONCERT_ACTIVE_AND_AMOUNT);
    const reservedTables = response.data.tables || [];

    // คำนวณยอดรวมจากราคาโต๊ะที่จองไว้
    const totalNow = reservedTables.reduce((sum: number, table: { price?: number }) => 
      sum + (table.price || 0), 
      0
    );

    total.value = {
      price: {
        now: totalNow,
        want: 100000, // กำหนดเป้าหมายยอดที่ต้องการ
      },
    };
  } catch (error: unknown) {
    // ตรวจสอบว่ามี `message` หรือไม่
    if (axios.isAxiosError(error)) {
      console.error("Error fetching data:", error.response?.data?.message || error.message);
    } else if (error instanceof Error) {
      console.error("Error fetching data:", error.message);
    } else {
      console.error("Error fetching data: Unknown error");
    }
  }
};


onMounted(() => {
  fetchData();
});
</script>

<template>
    <v-card elevation="1" class="roun-">
        <v-card-text class="position-relative">
            <div class="d-flex justify-space-between d-block">
                <div>
                    <h5 class="text-h5 mb-1 font-weight-semibold">
                        กำไรรวมของ Event ล่าสุด
                    </h5>
                    <div class="text-subtitle-1 text-grey100 pb-1 font-weight-medium">ข้อมูลล่าสุด</div>
                </div>
                <div class="mt-1 text-right">
                    <v-chip color="success" class="bg-lightsuccess" variant="outlined" size="x-small">
                        {{ Percentage }}
                    </v-chip>
                </div>
            </div>
            <div class="my-sm-14 my-8">
                <div class="d-flex align-center justify-space-between mb-2">
                    <h5 class="text-h6 font-weight-semibold">{{ total.price.now.toLocaleString() }} บาท</h5>
                    <div class="text-subtitle-1 font-weight-semibold">{{ total.price.want.toLocaleString() }} บาท</div>
                </div>
                <v-progress-linear 
                    :model-value="(total.price.now / total.price.want) * 100" 
                    height="7" 
                    bg-color="bglight" 
                    color="primary" 
                    rounded>
                </v-progress-linear>
            </div>
        </v-card-text>
    </v-card>
</template>


<style>
*{
    font-family: 'Prompt', 'sans-serif';
}
</style>