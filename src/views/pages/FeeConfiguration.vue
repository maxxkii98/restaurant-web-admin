<template>
    <div class="container mx-auto px-2">
      <!-- Header Section -->
      <div class="mb-4">
        <h3 class="text-gray-800 text-2xl font-semibold">Fee Configuration</h3>
        <p class="text-gray-600 text-sm">
          {{ new Date().toLocaleTimeString() }} at {{ new Date().toLocaleDateString() }}
        </p>
      </div>
  
      <!-- Table Section -->
      <v-row>
        <v-col cols="12">
          <v-card class="p-6 shadow-md bg-white rounded-lg" max-width="100%">
            <v-data-table
              class="min-h-[200px]"
              :headers="headers"
              :items="tiers"
              item-value="id"
              dense
            ></v-data-table>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Add Tier and Ratio Section -->
      <div class="bg-white shadow-md rounded-lg p-6 mt-6 max-w-4xl ml-0">
  <h5 class="text-gray-800 text-lg font-semibold mb-4">Add Tier and Ratio</h5>
  <form @submit.prevent="submitForm" class="space-y-4">
    <!-- Name Rate -->
    <div>
      <label for="nameRate" class="block text-gray-700 mb-2">Name Rate</label>
      <input
        id="nameRate"
        type="text"
        v-model="form.nameRate"
        placeholder="Enter name rate"
        class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      />
    </div>

    <!-- Volume Min, Max, Fee Rows -->
    <div v-for="(row, index) in form.volumes || []" :key="index" class="grid grid-cols-3 gap-4">
      <div>
        <label for="min" class="block text-gray-700 mb-2">Volume Min</label>
        <input
          type="text"
          v-model="row.min"
          placeholder="Enter minimum volume"
          class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
      <div>
        <label for="max" class="block text-gray-700 mb-2">Volume Max</label>
        <input
          type="text"
          v-model="row.max"
          placeholder="Enter maximum volume"
          class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
      <div>
        <label for="fee" class="block text-gray-700 mb-2">Fee (%)</label>
        <input
          type="text"
          v-model="row.fee"
          placeholder="Enter fee percentage"
          class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-4">
      <button
        type="button"
        class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
        @click="clearForm"
      >
        Clear
      </button>
      <button
        type="submit"
        class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 shadow-md"
      >
        Submit
      </button>
    </div>
  </form>
</div>

    </div>
  </template>
  
  <script lang="ts">
  import { ref } from 'vue';
  
  export default {
    name: 'FeeConfiguration',
    setup() {
      // Reactive headers and data
      const headers = ref([
        { title: 'Tier', value: 'tier' },
        { title: 'Company', value: 'company' },
        { title: 'Fee (%)', value: 'fee' },
        { title: 'Number of members', value: 'members' },
      ]);
  
      const tiers = ref([
        { id: 1, tier: 'Tier 1', company: 'Alpha Corp', fee: 5, members: 100 },
        { id: 2, tier: 'Tier 2', company: 'Beta Ltd.', fee: 10, members: 50 },
        { id: 3, tier: 'Tier 3', company: 'Gamma Enterprises', fee: 15, members: 20 },
      ]);
  
      const formValid = ref(false);
  
      // Reactive form data
      const form = ref({
        nameRate: '',
        volumes: [
          { min: '', max: '', fee: '' },
          { min: '', max: '', fee: '' },
          { min: '', max: '', fee: '' },
        ],
      });
  
      // Clear form without losing reactivity
      const clearForm = () => {
        form.value.nameRate = '';
        form.value.volumes = form.value.volumes.map(() => ({
          min: '',
          max: '',
          fee: '',
        }));
      };
  
      // Submit form logic
      const submitForm = () => {
        console.log('Form Submitted:', form.value);
        clearForm();
      };
  
      return {
        headers,
        tiers,
        formValid,
        form,
        clearForm,
        submitForm,
      };
    },
  };
  </script>
  