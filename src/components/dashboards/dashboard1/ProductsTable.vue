<script setup lang="ts">
import { ref } from "vue";
import { ProductTableData, tableActionData } from "@/_mockApis/components/dashboards/dashboard1";
const items = ref([
    { title: "Action" },
    { title: "Another action" },
    { title: "Something else here" },
]);
</script>
<template>
    <VCard elevation="10">
        <v-card-text>
            <div class="border-table">
                <h1 class="text-2xl font-semibold font-prompt mb-4 text-gray-800">
                    Pending Withdraw
                </h1>
                <v-table class="mb-0">
                    <template v-slot:default>
                        <thead class="font-prompt font-bold">
                            <tr>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Request</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Company</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Amount</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Description</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Status</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap">Action</th>
                                <th class="text-h6 font-weight-semibold text-no-wrap"></th>
                            </tr>
                        </thead>
                        <tbody class="font-prompt font-normal">
                            <tr v-for="item in ProductTableData" :key="item.request" class="month-item">
                                <td>
                                    <div class="d-flex align-center overflow-hidden">
                                        <!-- <img :src="item.img" alt="user" width="60" /> -->
                                        <div class="mx-0">
                                            <h6 class="text-h6  text-no-wrap text-truncate">
                                                {{ item.request }}
                                            </h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-center overflow-hidden">
                                        <!-- <img :src="item.img" alt="user" width="60" /> -->
                                        <div class="mx-0">
                                            <h6 class="text-h6  text-no-wrap text-truncate">
                                                {{ item.company }}
                                            </h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-center overflow-hidden">
                                        <!-- <img :src="item.img" alt="user" width="60" /> -->
                                        <div class="mx-0">
                                            <h6 class="text-h6  text-no-wrap text-truncate">
                                                {{ item.amount }}
                                            </h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-center overflow-hidden">
                                        <!-- <img :src="item.img" alt="user" width="60" /> -->
                                        <div class="mx-0">
                                            <h6 class="text-h6  text-no-wrap text-truncate">
                                                {{ item.description }}
                                            </h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <v-chip :class="'font-weight-medium bg-light' + item.statuscolor" variant="outlined"
                                        size="x-small" :color="item.statuscolor">{{
                                            item.statustext
                                        }}</v-chip>
                                </td>
                                <td class="text-right">
                                    <v-btn size="30" icon variant="flat" class="grey100">
                                        <v-avatar size="22">
                                            <DotsVerticalIcon size="20" color="grey100" />
                                        </v-avatar>
                                        <v-menu activator="parent">
                                            <v-list>
                                                <v-list-item value="action" v-for="list in tableActionData"
                                                    :key="list.listtitle" hide-details min-height="38">
                                                    <v-list-item-title>
                                                        <v-avatar size="20" class="mr-2">
                                                            <component :is="list.icon" stroke-width="2" size="20" />
                                                        </v-avatar>
                                                        {{ list.listtitle }}
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </v-btn>
                                </td>

                            </tr>
                        </tbody>
                    </template>
                </v-table>
            </div>
        </v-card-text>
    </VCard>
</template>


<style>
/* Import Google Font */
@import url("https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700&display=swap");

.font-prompt {
    font-family: "Prompt", sans-serif;
}
</style>