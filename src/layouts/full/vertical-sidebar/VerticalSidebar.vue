<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';
import sidebarItems from './sidebarItem';
import type { menu } from './sidebarItem';

import NavGroup from './NavGroup/index.vue';
import NavItem from './NavItem/index.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import ExtraBox from './extrabox/ExtraBox.vue';
import Logo from '../logo/Logo.vue';

// กำหนด Role-specific เมนู
const roleBasedMenu: Record<string, string[]> = {
    Viewer: ['Report Data','Setting'],
    User: ['Make Reports', 'Expense Menu', 'Report Data','Setting'],
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

const customizer = useCustomizerStore();
const sidebarMenu = shallowRef<menu[]>([]); // ระบุชนิดข้อมูลเมนู

// ดึง Role จาก localStorage และกรองเมนู
const filterSidebarMenu = () => {
    const role = (localStorage.getItem('role') || 'Viewer') as keyof typeof roleBasedMenu;
    const allowedMenus = roleBasedMenu[role] || [];

    // ถ้าเป็น SuperUser ให้แสดงเมนูทั้งหมด
    if (role === 'SuperUser') {
        sidebarMenu.value = sidebarItems;
    } else {
        sidebarMenu.value = sidebarItems.filter((item) =>
            allowedMenus.includes(item.title || '') || 
            (item.children && item.children.some((child) => allowedMenus.includes(child.title || '')))
        );
    }
};

// ดึงเมนูเมื่อ component โหลด
onMounted(() => {
    filterSidebarMenu();
});
</script>

<template>
    <v-navigation-drawer
        left
        v-model="customizer.Sidebar_drawer"
        rail-width="70"
        app
        class="leftSidebar ml-sm-5 mt-sm-5 bg-containerBg"
        elevation="10"
        :rail="customizer.mini_sidebar"
        expand-on-hover
        width="270"
    >
        <div class="pa-5 pl-4 ">
            <Logo />
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <perfect-scrollbar class="scrollnavbar bg-containerBg overflow-y-hidden">
            <v-list class="py-4 px-4 bg-containerBg">
                <!---Menu Loop -->
                <template v-for="(item, i) in sidebarMenu" :key="i">
                    <!---Item Sub Header -->
                    <NavGroup :item="item" v-if="item.header" />
                    <!---If Has Child -->
                    <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
                    <!---Single Item-->
                    <NavItem :item="item" v-else class="leftPadding" />
                    <!---End Single Item-->
                </template>
            </v-list>
            <div class="pa-6 px-4 userbottom bg-containerBg mt-10">
                <ExtraBox />
            </div>
        </perfect-scrollbar>
    </v-navigation-drawer>
</template>
