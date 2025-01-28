<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import EventPages from './EventPages.vue';

// theme breadcrumb
const page = ref({ title: 'Make Report' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '/dashboard'
    },
    {
        text: 'จัดการ Event',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <!-- ใช้ $t สำหรับแปลข้อความ -->
    <BaseBreadcrumb
        :title="$t('จัดการ Event')" 
        :breadcrumbs="breadcrumbs.map(b => ({ ...b, text: $t(b.text) }))"
    ></BaseBreadcrumb>

    <v-row>
        <v-col cols="12">
            <UiParentCard :title="$t('จัดการ Event')">
                <EventPages />
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<style>
*{
    font-family: 'Prompt', 'sans-serif';
}
</style>