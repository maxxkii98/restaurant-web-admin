<template>
    <div class="container mx-auto px-0">
        <!-- Header -->
        <div class="mb-6">
            <h3 class="text-gray-800 text-2xl font-semibold">Find Transaction</h3>
            <p class="text-gray-600 text-sm">
                {{ new Date().toLocaleTimeString() }} at {{ new Date().toLocaleDateString() }}
            </p>
        </div>

        <!-- Find Transaction Form -->
        <div class="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Find transaction</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Ref 1 -->
                <div>
                    <label for="ref1" class="block text-sm font-medium text-gray-700 mb-1">Ref 1</label>
                    <input id="ref1" v-model="form.ref1" type="text" placeholder="Ref 1"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <!-- Ref 2 -->
                <div>
                    <label for="ref2" class="block text-sm font-medium text-gray-700 mb-1">Ref 2 (optional)</label>
                    <input id="ref2" v-model="form.ref2" type="text" placeholder="Ref 2"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
            </div>

            <!-- Submit Button -->
            <button @click="findTransaction"
                class="w-full md:w-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Submit
            </button>
        </div>

        <!-- Result Section -->
        <div v-if="result" class="bg-white shadow-md rounded-lg p-6 border border-gray-300">
  <!-- Result Header -->
  <h5 class="text-lg font-semibold text-gray-800 mb-4">
    Result ({{ result.records }} Record{{ result.records > 1 ? 's' : '' }})
  </h5>

  <!-- Result Box -->
  <div class="bg-blue-50 shadow-md rounded-lg p-6 border border-blue-300 relative">
    <!-- Result Icon -->
    <div class="absolute top-2 right-2 flex items-center bg-green-100 border border-green-500 text-green-700 px-3 py-1 rounded-full text-sm">
      <i class="fas fa-check-circle mr-2"></i>
      Result
    </div>

    <!-- Result Content -->
    <div>
      <p class="text-lg text-blue-600 mb-2"><strong>Company:</strong> {{ result.company }}</p>
      <p class="text-sm text-gray-800 mb-2"><strong>Status:</strong>
        <span
          :class="{
            'text-white bg-green-500 font-medium px-2 py-1 rounded ml-2': result.status === 'Paid',
            'text-black bg-yellow-400 font-medium px-2 py-1 rounded ml-2': result.status === 'Pending',
          }"
        >
          {{ result.status }}
        </span>
      </p>
      <p class="text-sm text-gray-800 mb-2"><strong>Create Time:</strong> {{ result.createTime }}</p>
      <p class="text-sm text-gray-800 mb-2"><strong>Paid Time:</strong> {{ result.paidTime }}</p>
      <p class="text-sm text-gray-800 mb-2"><strong>Reference 1:</strong> {{ result.reference1 }}</p>
      <p class="text-sm text-gray-800 mb-2"><strong>Reference 2:</strong> {{ result.reference2 }}</p>
      <p class="text-sm text-gray-800 mb-2"><strong>Payer:</strong> {{ result.payer }}</p>
      <p class="text-sm text-gray-800 mb-2"><strong>Payee:</strong> {{ result.payee }}</p>
      <p class="text-sm text-gray-800"><strong>Comment:</strong> {{ result.comment }}</p>
    </div>
  </div>
</div>



    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'FindTransaction',
    setup() {
        // Form Data
        const form = ref({
            ref1: '',
            ref2: '',
        });

        // Mock Result
        const result = ref(null);

        // Find Transaction Function
        const findTransaction = () => {
            // Mock API Response
            result.value = {
                records: 1,
                company: 'thbpartneraug',
                status: 'Paid',
                createTime: '05/01/2025 19:58:31',
                paidTime: '05/01/2025 19:59:04',
                reference1: '677AE817F3A032688AADC',
                reference2: 'E487',
                payer: 'สมชัย แสนดี',
                payee: 'PEAKPAY NETWORK CO.,LTD.',
                comment: '-',
            };
        };

        return {
            form,
            result,
            findTransaction,
        };
    },
};
</script>