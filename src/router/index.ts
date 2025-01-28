import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { isRouteAllowedForRole } from '@/config/rolesConfig';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/dashboard', // เปลี่ยนเส้นทางไปหน้า Login
        },
        MainRoutes,
        AuthRoutes,
        {
            path: '/404',
            name: 'NotFound',
            component: () => import('@/views/authentication/Error.vue'), // หน้า 404
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/404', // เปลี่ยนเส้นทางสำหรับเส้นทางที่ไม่พบ
        },
    ],
});

// Add navigation guard
// Add navigation guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('username'); // ตรวจสอบการเข้าสู่ระบบ
    const role = localStorage.getItem('role') || ''; // ดึง role จาก localStorage


    // ถ้าปลายทางคือ /login ให้ข้ามการตรวจสอบ
    if (to.path === '/login') {
        next(); // อนุญาตให้เข้าถึง
        return;
    }

    // ถ้าปลายทางคือ /404 หรือเป็น wildcard ให้ข้ามการตรวจสอบ
    if (to.path === '/404' || to.matched.some(record => record.path === '*')) {
        next(); // อนุญาตให้เข้าถึง
        return;
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        // ถ้าไม่ได้เข้าสู่ระบบให้ไปหน้า Login
        next('/login');
    } else if (to.meta.allowedRoles) {
        // ตรวจสอบสิทธิ์ Role
        const allowedRoles = to.meta.allowedRoles as string[];
        if (allowedRoles.includes(role)) {
            next();
        } else {
            next('/404'); // ถ้าไม่มีสิทธิ์ให้ไปหน้า 404
        }
    } else {
        // ตรวจสอบสิทธิ์สำหรับเส้นทางทั่วไป
        const isAllowed = isRouteAllowedForRole(role, to.path);
        if (isAllowed) {
            next();
        } else {
            next('/404'); // ถ้าไม่มีสิทธิ์ให้ไปหน้า 404
        }
    }
});



export default router;
