<template>
    <div>
      <v-row>
        <v-col cols="12">
          <div class="mb-4">
            <h3 class="text-gray-800 text-2xl font-semibold">Withdraw Ticket</h3>
            <p class="text-gray-600 text-sm">
              {{ new Date().toLocaleTimeString() }} at {{ new Date().toLocaleDateString() }}
            </p>
          </div>
        </v-col>
      </v-row>
  
      <v-container class="px-0">
        <!-- Pending Withdraw Section -->
        <v-row>
          <v-col cols="12">
            <v-card class="p-6 shadow-md bg-white rounded-lg">
              <div class="w-full">
                <!-- Header and Filters in the same row -->
                <div class="flex flex-wrap items-center justify-between mb-6">
                  <!-- Title -->
                  <h5 class="text-gray-800 text-lg font-semibold mb-2">Pending Withdraw</h5>
  
                  <!-- Filters Section -->
                  <div class="flex flex-wrap items-center gap-4">
                    <!-- Company Filter -->
                    <div class="relative w-80">
                      <div class="relative">
                        <input
                          type="text"
                          v-model="filters.company"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Select Company"
                        />
                        <div class="absolute inset-y-0 right-3 flex items-center">
                          <font-awesome-icon icon="chevron-down" class="text-gray-400 h-5 w-5" />
                        </div>
                      </div>
                    </div>
  
                    <!-- Select Date Range -->
                    <div class="relative w-80">
                      <div class="relative">
                        <input
                          type="text"
                          readonly
                          :value="dateRange"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Select Date Range"
                          @click="filters.dateMenu = !filters.dateMenu"
                        />
                        <div class="absolute inset-y-0 right-3 flex items-center">
                          <font-awesome-icon icon="calendar" class="text-gray-400 h-5 w-5" />
                        </div>
                        <div
                          v-if="filters.dateMenu"
                          class="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-md mt-1 p-3"
                        >
                          <v-date-picker v-model="filters.date" range scrollable @input="filters.dateMenu = false"></v-date-picker>
                        </div>
                      </div>
                    </div>
  
                    <!-- Download Button -->
                    <div>
                      <button
                        class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                      >
                        <font-awesome-icon icon="download" class="mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Withdraw Table -->
              <v-data-table class="min-h-[400px] mt-4" :headers="headers" :items="withdrawals" item-value="id" dense>
                <!-- Amount -->
                <template v-slot:[`item.amount`]="{ item }">
                  <span class="text-blue-500 font-medium">{{ item.amount.toLocaleString() }}</span>
                </template>
  
                <!-- Description -->
                <template v-slot:[`item.description`]="{ item }">
                  <div class="text-gray-600">{{ item.description }}</div>
                </template>
  
                <!-- Status -->
                <template v-slot:[`item.status`]="{}">
                  <button
                    class="text-white bg-red-500 px-3 py-1 rounded-lg shadow-md hover:bg-red-200 focus:outline-none"
                  >
                    Reject
                  </button>
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
    </div>
  </template>
  
  <script lang="ts">
import { ref, computed } from "vue";

export default {
  name: "WithdrawTicket",
  setup() {
    const headers = ref([
      { title: "Request", value: "time" },
      { title: "Company", value: "company" },
      { title: "Amount", value: "amount" },
      { title: "Description", value: "description" },
      { title: "Status", value: "status" },
      { title: "Action", value: "action" },
    ]);

    const withdrawals = ref([
      {
        id: 1,
        time: "1:09 PM at January 3rd 2025",
        company: "thbpartneraug",
        amount: 1100000.0,
        description: "SCB Bank PPS Solution Trading บริษัท ทีพีพีเอส จำกัด 4112151440",
        status: "Reject",
      },
      {
        id: 2,
        time: "1:08 PM at January 3rd 2025",
        company: "thbpartneraug",
        amount: 1000000.0,
        description: "Krungsri Bank PPS Solution Trading บริษัท ทีพีพีเอส จำกัด 809396794",
        status: "Reject",
      },
      {
        id: 3,
        time: "1:08 PM at January 3rd 2025",
        company: "thbpartneraug",
        amount: 1000000.0,
        description: "TTB Bank PPS Solution Trading บริษัท ทีพีพีเอส จำกัด 2372637054",
        status: "Reject",
      },
      {
        id: 4,
        time: "1:11 PM at January 2nd 2025",
        company: "thbpartneraug",
        amount: 1000000.0,
        description: "SCB Bank ไทยพาณิชย์ PPS Solution Trading Account No. 2728044290",
        status: "Reject",
      },
      {
        id: 5,
        time: "1:10 PM at January 2nd 2025",
        company: "thbpartneraug",
        amount: 1000000.0,
        description: "KTB Bank กรุงไทย PPS Solution Trading Account No. 0170441741",
        status: "Reject",
      },
    ]);

    const filters = ref<{
      company: string;
      date: [string, string] | null;
      dateMenu: boolean;
    }>({
      company: "",
      date: null,
      dateMenu: false,
    });

    const dateRange = computed(() => {
      if (filters.value.date && filters.value.date.length === 2) {
        const [start, end] = filters.value.date;
        return `${start} - ${end}`;
      }
      return "";
    });

    return {
      headers,
      withdrawals,
      filters,
      dateRange,
    };
  },
};
</script>

  