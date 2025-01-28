import axios from "axios";
import type { AxiosInstance } from "axios"; // ระบุว่าเป็น type-only import
import API_PATH from "@/config/apiPath";

// สร้าง Axios Instance พร้อมกำหนดค่าพื้นฐาน
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_PATH.BASE_URL, // ใช้ BASE_URL จาก apiPath.ts
    timeout: 5000, // เวลา timeout ในการเรียก API
    headers: {
        "Content-Type": "application/json", // กำหนด Header เริ่มต้น
    },
});

export default axiosInstance;
