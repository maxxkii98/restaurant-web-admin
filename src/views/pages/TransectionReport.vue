<template>
    <div>
        <v-row>
            <v-col cols="12">
                <div class="mb-4">
                    <h3 class="text-gray-800 text-2xl font-semibold">Transaction and Report</h3>
                    <p class="text-gray-600 text-sm">
                        {{ new Date().toLocaleTimeString() }} at {{ new Date().toLocaleDateString() }}
                    </p>
                </div>
            </v-col>
        </v-row>

        <v-container class="px-0">
            <!-- Transactions Section -->
            <v-row>
                <v-col cols="12">
                    <v-card class="p-6 shadow-md bg-white rounded-lg">
                        <div class="w-full">
                            <!-- Header and Filters in the same row -->
                            <div class="flex flex-wrap items-center justify-between mb-6">
                                <!-- Title -->
                                <h5 class="text-gray-800 text-lg font-semibold mb-2">Transactions</h5>

                                <!-- Filters Section -->
                                <div class="flex flex-wrap items-center gap-4">
                                    <!-- Company Filter -->
                                    <div class="relative w-80">
                                        <!-- <label class="block text-sm font-medium text-gray-700 mb-1">Company</label> -->
                                        <div class="relative">
                                            <input type="text" v-model="filters.company"
                                                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Select Company" />
                                            <div class="absolute inset-y-0 right-3 flex items-center">
                                                <!-- ใช้ Tabler Icon -->
                                                <font-awesome-icon icon="chevron-down" class="text-gray-400 h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Select Date Range -->
                                    <div class="relative w-80">
                                        <!-- <label class="block text-sm font-medium text-gray-700 mb-1">Select Date Range</label> -->
                                        <div class="relative">
                                            <input type="text" readonly :value="dateRange"
                                                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Select Date Range"
                                                @click="filters.dateMenu = !filters.dateMenu" />
                                            <div class="absolute inset-y-0 right-3 flex items-center">
                                                <font-awesome-icon icon="calendar" class="text-gray-400 h-5 w-5" />
                                            </div>
                                            <div v-if="filters.dateMenu"
                                                class="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-md mt-1 p-3">
                                                <v-date-picker v-model="filters.date" range scrollable
                                                    @input="filters.dateMenu = false"></v-date-picker>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Download Button -->
                                    <div>
                                        <button
                                            class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">
                                            <font-awesome-icon icon="download" class="mr-2" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Transactions Table -->
                        <v-data-table class="min-h-[400px] mt-4" :headers="headers" :items="transactions"
                            item-value="id" dense>
                            <!-- Amount -->
                            <template v-slot:[`item.amount`]="{ item }">
                                <span class="text-blue-500 font-medium">{{ item.amount.toLocaleString() }}</span>
                            </template>

                            <!-- Status -->
                            <template v-slot:[`item.status`]="{ item }">
                                <span :class="{
                                    'text-white bg-green-500 font-medium rounded-lg px-2 py-1': item.status === 'Paid',
                                    'text-black bg-gray-200 font-medium rounded-lg px-2 py-1': item.status === 'Pending',
                                }">
                                    {{ item.status }}
                                </span>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';


export default {
    name: 'TransactionReport',
    setup() {
        const headers = ref([
            { title: 'Time', value: 'time' },
            { title: 'Company', value: 'company' },
            { title: 'Amount', value: 'amount' },
            { title: 'Reference Transaction', value: 'reference' },
            { title: 'Status', value: 'status' },
        ]);

        const transactions = ref([
            {
                id: 1,
                time: '8:47 PM at January 5th 2025',
                company: 'thbpartneraug',
                amount: 2000.0,
                reference: '336845798',
                status: 'Paid',
            },
            {
                id: 2,
                time: '8:47 PM at January 5th 2025',
                company: 'thbpartneraug',
                amount: 24192.0,
                reference: '336845790',
                status: 'Paid',
            },
            {
                id: 3,
                time: '7:58 PM at January 5th 2025',
                company: 'thbpartneraug',
                amount: 10368.0,
                reference: '336843988',
                status: 'Paid',
            },
            {
                id: 4,
                time: '7:54 PM at January 5th 2025',
                company: 'thbpartneraug',
                amount: 600.0,
                reference: '336843811',
                status: 'Pending',
            },
            {
                id: 5,
                time: '7:53 PM at January 5th 2025',
                company: 'thbpartneraug',
                amount: 2000.0,
                reference: '336843790',
                status: 'Paid',
            },
        ]);

        const filters = ref<{
            company: string;
            date: [string, string] | null;
            dateMenu: boolean;
        }>({
            company: '',
            date: null,
            dateMenu: false,
        });

        const dateRange = computed(() => {
            if (filters.value.date && filters.value.date.length === 2) {
                const [start, end] = filters.value.date;
                return `${start} - ${end}`;
            }
            return '';
        });

        return {
            headers,
            transactions,
            filters,
            dateRange,
        };
    },
};
</script>