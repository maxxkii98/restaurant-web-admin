<script setup lang="ts">
// import { ref } from 'vue';
// import CongratsCard from '@/components/dashboards/dashboard1/CongratulationsCard.vue';
// import Payments from '@/components/dashboards/dashboard1/Payments.vue';
// import Products from '@/components/dashboards/dashboard1/ProductsChart.vue';
import LastProfitEvent from '@/components/dashboards/dashboard1/LastProfitEvent.vue';
// import Customers from '@/components/dashboards/dashboard1/Customers.vue';
import ProductsTable from '@/components/dashboards/dashboard1/ProductsTable.vue';
// import VisitFromUsa from '@/components/dashboards/dashboard1/VisitFromUsa.vue';
// import LatestReviews1 from '@/components/dashboards/dashboard1/LatestReviews.vue';
import Snackbar from '@/components/dashboards/snackbar.vue';
import TopCards from '@/components/widgets/cards/TopCards.vue';
import NetSells from "@/components/widgets/charts/NetSells.vue";
// import ProductSales from "@/components/dashboards/dashboard2/ProductSales.vue";
</script>

<template>
  <!-- Loader -->
  <Snackbar />
  <!-- Loader -->
  <v-row>
    <!-- Congratulation Card -->
    <v-col cols="12">
      <TopCards />
    </v-col>
    <v-col cols="6">
      <LastProfitEvent />
    </v-col>
    <!-- <v-col cols="6">
      <NetSells />
    </v-col> -->
    
    <!-- Products Table  -->
    <!-- <v-col cols="12" sm="12" lg="12">
      <ProductsTable />
    </v-col> -->
    <!-- Visit From USA  -->
    <!-- <v-col cols="12" sm="12" lg="4">
      <VisitFromUsa />
    </v-col> -->
    <!-- Latest reviews -->
   
  </v-row>
</template>


<!-- <DashboardCards />
    <LatestReviews /> -->