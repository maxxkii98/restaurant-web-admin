<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import HistoryLastEventPage from './HistoryLastEventPage.vue';

// theme breadcrumb
const page = ref({ title: 'ปะวัติ Event ล่าสุด' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '/dashboard'
    },
    {
        text: 'ปะวัติ Event ล่าสุด',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <!-- ใช้ $t สำหรับแปลข้อความ -->
    <BaseBreadcrumb
        :title="$t('ปะวัติ Event ล่าสุด')" 
        :breadcrumbs="breadcrumbs.map(b => ({ ...b, text: $t(b.text) }))"
    ></BaseBreadcrumb>

    <v-row>
        <v-col cols="12">
            <UiParentCard :title="$t('ปะวัติ Event ล่าสุด')">
                <HistoryLastEventPage />
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<style>
*{
    font-family: 'Prompt', 'sans-serif';
}
</style>