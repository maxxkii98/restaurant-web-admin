<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import StaffScanPage from './StaffScanPage.vue';

// theme breadcrumb
const page = ref({ title: 'ข้อมูลการจอง' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '/dashboard'
    },
    {
        text: 'ข้อมูลการจอง',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <!-- ใช้ $t สำหรับแปลข้อความ -->
    <BaseBreadcrumb
        :title="$t('ข้อมูลการจอง')" 
        :breadcrumbs="breadcrumbs.map(b => ({ ...b, text: $t(b.text) }))"
    ></BaseBreadcrumb>

    <v-row>
        <v-col cols="12">
            <UiParentCard :title="$t('ข้อมูลการจอง')">
                <StaffScanPage />
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<style>
*{
    font-family: 'Prompt', 'sans-serif';
}
</style>