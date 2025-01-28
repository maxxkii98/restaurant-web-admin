<template>
    <v-container>
        <!-- Pending Withdraw -->
        <v-row>
            <v-col cols="12">
                <v-card class="p-6 shadow-md bg-white rounded-lg">
                    <h5 class="text-gray-800 text-lg font-semibold mb-4">Pending Withdraw</h5>
                    <v-data-table class="min-h-[400px]" :items="pendingWithdrawals" :headers="[
                        { title: 'Request', value: 'requestTime' },
                        { title: 'Company', value: 'company' },
                        { title: 'Amount', value: 'amount' },
                        { title: 'Description', value: 'description' },
                        { title: 'Status', value: 'status' },
                        { title: 'Action', value: 'action', sortable: false }
                    ]">
                        <!-- Amount -->
                        <template v-slot:[`item.amount`]="{ item }">
                            <span class="text-blue-500 font-medium">{{ item.amount.toLocaleString() }}</span>
                        </template>

                        <!-- Description -->
                        <template v-slot:[`item.description`]="{ item }">
                            <div class="text-left whitespace-pre-line leading-6">
                                {{ item.description }}
                            </div>
                        </template>

                        <!-- Status -->
                        <template v-slot:[`item.status`]="{ item }">
                            <v-btn size="small" class="bg-red-500 text-white rounded-lg px-4 py-1 shadow-sm"
                                @click="handleReject(item)">
                                Reject
                            </v-btn>
                        </template>

                        <!-- Action -->
                        <template v-slot:[`item.action`]="{}">
                            <v-btn icon variant="text" class="text-gray-500 hover:text-gray-800">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
    name: 'LatestReviews', // กำหนดชื่อของ component
    setup() {
        // Mock Data
        const pendingWithdrawals = ref([
            {
                requestTime: '1:09 PM at January 3rd 2025',
                company: 'thbpartneraug',
                amount: 1100000.0,
                description: 'SCB Bank PPS Solution Trading บริษัท ที.เอ็น.พี ซัพพอร์ท สินค้า 4112151440',
                status: 'Pending',
            },
            {
                requestTime: '1:08 PM at January 3rd 2025',
                company: 'thbpartneraug',
                amount: 1000000.0,
                description: 'Krungsri Bank PPS Solution Trading บริษัท ที.เอ็น.พี ซัพพอร์ท สินค้า 8039697974',
                status: 'Pending',
            },
            {
                requestTime: '1:08 PM at January 3rd 2025',
                company: 'thbpartneraug',
                amount: 1000000.0,
                description: 'TTB Bank PPS Solution Trading บริษัท ที.เอ็น.พี ซัพพอร์ท สินค้า 2327637054',
                status: 'Pending',
            },
            {
                requestTime: '1:11 PM at January 2nd 2025',
                company: 'thbpartneraug',
                amount: 1000000.0,
                description: 'ไทยพาณิชย์ SCB bank ร้าน พิ.เอ็น.พี Vsp luxury branded Account No. 2782490420',
                status: 'Pending',
            },
            {
                requestTime: '1:10 PM at January 2nd 2025',
                company: 'thbpartneraug',
                amount: 1000000.0,
                description: 'KTB Bank กรุงไทย PPS Solution Trading Account No. 0170417411',
                status: 'Pending',
            },
        ]);

        const handleReject = (item: any) => {
            console.log('Rejected withdrawal:', item);
        };

        return {
            pendingWithdrawals,
            handleReject,
        };
    },
};
</script>
