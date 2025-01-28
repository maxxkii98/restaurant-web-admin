<template>
    <div class="bg-gray-100 mb-10">
      <v-row>
        <v-col cols="12">
          <div class="mb-4">
            <h3 class="text-gray-800 text-2xl font-semibold">Dashboard Overview</h3>
            <p class="text-gray-600 text-sm">
              {{ new Date().toLocaleTimeString() }} at {{ new Date().toLocaleDateString() }}
            </p>
          </div>
        </v-col>
      </v-row>
  
      <!-- Grid Container -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1 -->
        <div class="bg-white shadow rounded-lg p-4 flex justify-between items-center">
          <div>
            <h5 class="text-gray-600 text-sm">Balance Bank Account</h5>
            <h4 class="text-blue-600 text-lg font-semibold">{{ balanceBankAccount }}</h4>
          </div>
          <div class="bg-blue-600 p-2 rounded-full">
            <v-icon size="36" class="text-white">mdi-cash</v-icon>
          </div>
        </div>
  
        <!-- Card 2 -->
        <div class="bg-white shadow rounded-lg p-4 flex justify-between items-center">
          <div>
            <h5 class="text-gray-600 text-sm">Today Deposit</h5>
            <h4 class="text-blue-600 text-lg font-semibold">{{ todayDeposit }}</h4>
          </div>
          <div class="bg-blue-600 p-2 rounded-full">
            <v-icon size="36" class="text-white">mdi-bank-transfer-in</v-icon>
          </div>
        </div>
  
        <!-- Card 3 -->
        <div class="bg-white shadow rounded-lg p-4 flex justify-between items-center">
          <div>
            <h5 class="text-gray-600 text-sm">Today Withdraw</h5>
            <h4 class="text-blue-600 text-lg font-semibold">{{ todayWithdraw }}</h4>
          </div>
          <div class="bg-blue-600 p-2 rounded-full">
            <v-icon size="36" class="text-white">mdi-bank-transfer-out</v-icon>
          </div>
        </div>
  
        <!-- Card 4 -->
        <div class="bg-white shadow rounded-lg p-4 flex justify-between items-center">
          <div>
            <h5 class="text-gray-600 text-sm">Today Revenue (Company Fee)</h5>
            <h4 class="text-blue-600 text-lg font-semibold">{{ companyFee }}</h4>
          </div>
          <div class="bg-blue-600 p-2 rounded-full">
            <v-icon size="36" class="text-white">mdi-currency-usd</v-icon>
          </div>
        </div>
  
        <div class="bg-white shadow rounded-lg p-4 flex justify-between items-center h-full">
          <div>
            <h5 class="text-gray-600 text-sm">Company Account</h5>
            <h4 class="text-blue-600 text-lg font-semibold">{{ companyAccount }}</h4>
          </div>
          <div class="bg-blue-600 p-2 rounded-full">
            <v-icon size="36" class="text-white">mdi-account-multiple</v-icon>
          </div>
        </div>
  
        <div class="bg-white shadow rounded-lg p-4 flex justify-between items-center h-full">
          <div>
            <h5 class="text-gray-600 text-sm">This Month Revenue</h5>
            <h4 class="text-blue-600 text-lg font-semibold">{{ thisMonthRevenue }}</h4>
          </div>
          <div class="bg-blue-600 p-2 rounded-full">
            <v-icon size="36" class="text-white">mdi-chart-bar</v-icon>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "DashboardCards",
    data() {
      return {
        balanceBankAccount: "238632047.01",
        todayDeposit: "482933.48",
        todayWithdraw: "0.00",
        companyFee: "476143.63",
        companyAccount: 4,
        thisMonthRevenue: "7093636.08",
      };
    },
  };
  </script>
  