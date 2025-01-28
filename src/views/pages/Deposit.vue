<template>
    <div class="container mx-auto px-0">
        <!-- Header -->
        <div class="mb-6">
            <h3 class="text-gray-800 text-2xl font-semibold">Deposit</h3>
            <p class="text-gray-600 text-sm">
                {{ new Date().toLocaleTimeString() }} at {{ new Date().toLocaleDateString() }}
            </p>
        </div>

        <!-- Manual Transaction Form -->
        <div class="bg-white shadow-md rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Manual transaction</h4>
            <div class="grid grid-cols-1 gap-4">
                <!-- Company Dropdown -->
                <div class="relative">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <select v-model="form.company"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none">
                        <option disabled value="">Select Company</option>
                        <option v-for="company in companies" :key="company" :value="company">
                            {{ company }}
                        </option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-3 top-9 text-gray-400 pointer-events-none"></i>
                </div>


                <!-- Fee Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fee (percentage)</label>
                    <div class="relative">
                        <input type="number" v-model="form.fee" placeholder="%"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        <span class="absolute inset-y-0 right-3 flex items-center text-gray-400">%</span>
                    </div>
                </div>

                <!-- Amount Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input type="number" v-model="form.amount" placeholder="xx,xxxx"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <!-- Comment Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
                    <textarea v-model="form.comment" rows="3" placeholder="Note"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>
            </div>

            <!-- Buttons -->
            <div class="mt-4 flex justify-between">
                <button @click="submitForm"
                    class="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                    Submit
                </button>
                <button @click="clearForm"
                    class="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    Clear
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
    name: "Deposit",
    setup() {
        // Form data
        const form = ref({
            company: "",
            fee: "",
            amount: "",
            comment: "",
        });

        // Example companies
        const companies = ref(["Company A", "Company B", "Company C"]);

        // Methods
        const submitForm = () => {
            console.log("Form Submitted:", form.value);
            alert("Transaction Submitted Successfully!");
            clearForm();
        };

        const clearForm = () => {
            form.value = {
                company: "",
                fee: "",
                amount: "",
                comment: "",
            };
        };

        return {
            form,
            companies,
            submitForm,
            clearForm,
        };
    },
};
</script>

<style scoped>
/* Optional custom styles */
</style>