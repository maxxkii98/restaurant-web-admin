<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

//Table
// import EditableTable from '@/components/table/EditableTable.vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import MakeSeedingPages from './MakeSeedingPages.vue';
// theme breadcrumb
const page = ref({ title: 'Make Seeding Management' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '/dashboard'
    },
    {
        text: 'Make Seeding Management',
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
            <UiParentCard title="Make Seeding Management">
                <MakeSeedingPages />
            </UiParentCard>
        </v-col>
    </v-row>
</template>
