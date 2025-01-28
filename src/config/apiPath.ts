const isProduction = import.meta.env.PROD; // ตรวจสอบว่าอยู่ใน Production หรือไม่
const BASE_URL = isProduction
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000";

export default {
    BASE_URL, // BASE URL สำหรับ API

    //dashboard
    DATA_CONCERT_ACTIVE_AND_AMOUNT: `${BASE_URL}/api/concerts/active-concerts/reserved-tables`,

    USER_LOGIN: `${BASE_URL}/api/users/login`,
    USER_CREATE: `${BASE_URL}/api/users/create`,
    USER_UPDATE: `${BASE_URL}/api/users/update/:id`,
    USER_DELETE: `${BASE_URL}/api/users/delete/:id`,
    GETALL_USER: `${BASE_URL}/api/users/getAlluser`,

    GET_EVENT: `${BASE_URL}/api/concerts`,
    CREATE_EVENT: `${BASE_URL}/api/concerts`,
    UPDATE_EVENT: `${BASE_URL}/api/concerts/:id`,
    DELETE_EVENT: `${BASE_URL}/api/concerts/:id`,
    GET_EVENT_BY_ID: `${BASE_URL}/api/concerts/:id`,
    DELETE_TABLE_FROM_CONCERT: `${BASE_URL}/api/concerts/:concertId/tables/:tableId`,

    GET_TABLE: `${BASE_URL}/api/tables`,
    GET_TABLE_USE: `${BASE_URL}/api/tables/used`,
    GET_TABLE_AVAILLABLE: `${BASE_URL}/api/tables/available`,
    CREATE_TABLE: `${BASE_URL}/api/tables`,
    UPDATE_TABLE: `${BASE_URL}/api/tables/:id`,
    DELETE_TABLE: `${BASE_URL}/api/tables/:id`,

    STAFF_SCAN_QR: `${BASE_URL}/api/booking/:id/status`,
    GET_BOOKING_ALL: `${BASE_URL}/api/bookings`,



    GET_SETTING_PROFILE: `${BASE_URL}/api/setting-profile`,
    UPDATE_SETTING_PROFILE: `${BASE_URL}/api/setting-profile`,
    GET_PROFILE_SLIDER: `${BASE_URL}/api/setting-profile/picslider`,
    UPDATE_PROFILE_SLIDER: `${BASE_URL}/api/setting-profile/picslider`,
    GET_GALLERY_IMAGES: `${BASE_URL}/api/setting-profile/galleryImages`,
    UPDATE_GALLERY_IMAGES: `${BASE_URL}/api/setting-profile/galleryImages`,
};
