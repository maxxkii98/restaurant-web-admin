// rolesConfig.ts

// กำหนด Role-specific เมนู
export const roleBasedMenu: Record<string, string[]> = {
    Viewer: ['Report Data', 'Setting'],
    User: ['Make Reports', 'Expense Menu', 'Report Data', 'Setting'],
    Administrator: [
        'Dashboard',
        'Make Reports',
        'Expense Menu',
        'Report Data',
        'Staff Management',
        'Product Management',
        'Account Management',
        'Finance',
        'Setting',
    ],
    SuperUser: [], // SuperUser สามารถดูได้ทั้งหมด
};

// กำหนด Role-specific Routes
export const roleBasedRoutes: Record<string, string[]> = {
    Viewer: ['/reportdaily', '/reportduringtoday', '/setting'], // Routes สำหรับ Viewer
    User: [
        '/event',
        '/addevent',
        '/history-last-event',
        '/report-all-event',
        '/expense',
        '/reportdaily',
        '/reportduringtoday',
        '/setting',
        '/expenselist',
    ], // Routes สำหรับ User
    Administrator: [
        '/dashboard',
        '/makereport',
        '/expense',
        '/reportdaily',
        '/staff',
        '/product',
        '/request',
        '/makeseeding',
        '/reportduringtoday',
        '/expenselist',
        '/account',
        '/finance',
        '/setting',
    ], // Routes สำหรับ Administrator
    SuperUser: ['*'], // SuperUser สามารถเข้าถึงทุกเส้นทาง
};

// ฟังก์ชันตรวจสอบว่า Role มีสิทธิ์เข้าถึง Route หรือไม่
export const isRouteAllowedForRole = (role: string, path: string): boolean => {
    if (roleBasedRoutes[role]?.includes('*')) {
        // SuperUser หรือ Role ที่กำหนด '*' สามารถเข้าถึงทุก Route
        return true;
    }
    return roleBasedRoutes[role]?.includes(path) || false;
};
