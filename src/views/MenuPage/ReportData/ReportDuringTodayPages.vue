<template>
    <v-row>
        <!-- Table Content -->
        <v-col cols="12">
            <perfect-scrollbar>
                <div class="border-table">
                    <v-table class="mt-2">
                        <thead class="font-prompt font-bold">
                            <tr>
                                <th class="text-subtitle-1 font-weight-semibold">Round</th>
                                <th class="text-subtitle-1 font-weight-semibold">Product</th>
                                <th class="text-subtitle-1 font-weight-semibold">Stock</th>
                                <th class="text-subtitle-1 font-weight-semibold">Sale Amount</th>
                                <th class="text-subtitle-1 font-weight-semibold">Buy Amount</th>
                                <th class="text-subtitle-1 font-weight-semibold">Add On Amount</th>
                                <th class="text-subtitle-1 font-weight-semibold">Trial Amount</th>
                                <th class="text-subtitle-1 font-weight-semibold">Voucher Amount</th>
                                <th class="text-subtitle-1 font-weight-semibold">Account Name</th>
                                <th class="text-subtitle-1 font-weight-semibold">Cash Amount</th>
                                <th class="text-subtitle-1 font-weight-semibold">Client Register</th>
                                <th class="text-subtitle-1 font-weight-semibold">Client Active</th>
                                <th class="text-subtitle-1 font-weight-semibold">Created At</th>
                            </tr>
                        </thead>
                        <tbody class="font-prompt font-normal">
                            <tr v-for="report in paginatedItems" :key="report._id">
                                <td class="text-subtitle-1">{{ report.round }}</td>
                                <td class="text-subtitle-1">{{ report.product }}</td>
                                <td class="text-subtitle-1">{{ report.stock }}</td>
                                <td class="text-subtitle-1">{{ report.saleAmount }}</td>
                                <td class="text-subtitle-1">{{ report.buyAmount }}</td>
                                <td class="text-subtitle-1">{{ report.addOnAmount }}</td>
                                <td class="text-subtitle-1">{{ report.trialAmount }}</td>
                                <td class="text-subtitle-1">{{ report.voucherAmount }}</td>
                                <td class="text-subtitle-1">{{ report.account?.name || "N/A" }}</td>
                                <td class="text-subtitle-1">{{ report.account?.cashAmount || 0 }}</td>
                                <td class="text-subtitle-1">{{ report.client?.register || 0 }}</td>
                                <td class="text-subtitle-1">{{ report.client?.active || 0 }}</td>
                                <td class="text-subtitle-1">
                                    {{ new Date(report.createdAt).toLocaleString() }}
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div class="text-center pt-2 mb-3 px-3">
                        <v-pagination
                            v-model="pagination"
                            :length="totalPages"
                        ></v-pagination>
                        <v-text-field
                            :model-value="itemsPerPage"
                            class="pa-2"
                            label="Items per page"
                            type="number"
                            min="1"
                            max="15"
                            hide-details
                            @update:model-value="itemsPerPage = parseInt($event, 10)"
                        ></v-text-field>
                    </div>
                </div>
            </perfect-scrollbar>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axiosInstance from "@/config/axios";
import API_PATH from "@/config/apiPath";
import type { AxiosResponse } from "axios";

// Interfaces
interface Account {
    name: string;
    cashAmount: number;
}

interface Client {
    register: number;
    active: number;
}

interface MakeReport {
    _id: string;
    round: string;
    product: string;
    stock: number;
    saleAmount: number;
    buyAmount: number;
    addOnAmount: number;
    trialAmount: number;
    voucherAmount: number;
    account?: Account;
    client?: Client;
    createdAt: string; // Added createdAt field
}

// Data references
const makeReports = ref<MakeReport[]>([]);
const itemsPerPage = ref(10);
const pagination = ref(1);

// Fetch MakeReports for predefined rounds
const fetchMakeReports = async () => {
    try {
        const response: AxiosResponse<MakeReport[]> = await axiosInstance.get(API_PATH.GET_DURING_ROUND);

        // Log fetched data for debugging
        // console.log("Fetched MakeReports data:", response.data);

        makeReports.value = response.data;
    } catch (error) {
        console.error("Error fetching MakeReports:", error);
    }
};

// Computed properties
const paginatedItems = computed(() => {
    const start = (pagination.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return makeReports.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(makeReports.value.length / itemsPerPage.value);
});

// Fetch data on mounted
onMounted(fetchMakeReports);
</script>

