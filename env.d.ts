/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // เพิ่ม environment variables อื่นๆ ถ้ามี
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
