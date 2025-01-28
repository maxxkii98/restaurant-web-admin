import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean; // ระบุว่าต้องการการล็อกอินหรือไม่
        allowedRoles?: string[]; // ระบุ Roles ที่อนุญาตให้เข้าถึง
    }
}
