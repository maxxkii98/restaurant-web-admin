<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

//Table
// import EditableTable from '@/components/table/EditableTable.vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TablePages from './TablePages.vue';
// theme breadcrumb
const page = ref({ title: 'จัดการ Table' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '/dashboard'
    },
    {
        text: 'จัดการ Table',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <!-- ---------------------------------------------------- -->
    <!-- Table Editable -->
    <!-- ---------------------------------------------------- -->
    <v-row>
        <v-col cols="12">
            <UiParentCard title="จัดการ Table">
                <TablePages />
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<style>
*{
    font-family: 'Prompt', 'sans-serif';
}
</style>