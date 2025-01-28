<template>
    <div class="container mx-auto px-0">
        <!-- Header -->
        <div class="mb-6">
            <h3 class="text-gray-800 text-2xl font-semibold">Setting</h3>
            <p class="text-gray-600 text-sm">{{ new Date().toLocaleTimeString() }} at {{ new Date().toLocaleDateString()
                }}</p>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Sidebar -->
            <div class="bg-white shadow-md rounded-lg p-6">
                <div class="flex justify-center mb-4">
                    <div
                        class="bg-gradient-to-r from-blue-500 to-cyan-500 w-96 h-24 flex items-center justify-center rounded-lg shadow-md">
                        <i class="fas fa-user-cog text-white text-3xl"></i>
                    </div>
                </div>
                <ul class="text-sm text-gray-600 divide-y divide-gray-300 space-y-4">
                    <li class="py-3 flex justify-between">
                        <span><strong>Company:</strong></span>
                        <span>peakpaynetwork</span>
                    </li>
                    <li class="py-3 flex justify-between">
                        <span><strong>Address:</strong></span>
                        <span>100</span>
                    </li>
                    <li class="py-3 flex justify-between">
                        <span><strong>Info:</strong></span>
                        <span>test</span>
                    </li>
                </ul>
            </div>

            <!-- Content Section -->
            <div class="md:col-span-2 bg-white shadow-md rounded-lg p-6">
                <div>
                    <!-- Tabs -->
                    <div class="flex border-b mb-4">
                        <button class="px-4 py-2 text-blue-500 border-b-2 border-blue-500 focus:outline-none"
                            :class="{ 'text-gray-500 border-transparent': activeTab !== 'account' }"
                            @click="activeTab = 'account'">
                            Account
                        </button>
                        <button class="px-4 py-2 text-gray-500 border-b-2 border-transparent focus:outline-none"
                            :class="{ 'text-blue-500 border-blue-500': activeTab === 'password' }"
                            @click="activeTab = 'password'">
                            Change Password
                        </button>
                    </div>

                    <!-- Account Tab -->
                    <div v-if="activeTab === 'account'">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" v-model="form.firstName"
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" v-model="form.lastName"
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="text" v-model="form.phone"
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                        </div>
                        <button
                            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            @click="saveSettings">
                            Save
                        </button>
                    </div>

                    <!-- Change Password Tab -->
                    <div v-if="activeTab === 'password'">
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input type="password" v-model="form.currentPassword"
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input type="password" v-model="form.newPassword"
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input type="password" v-model="form.confirmPassword"
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                        </div>
                        <button
                            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            @click="changePassword">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
    name: "Setting",
    setup() {
        const activeTab = ref("account");

        const form = ref({
            firstName: "admin03",
            lastName: "peakpay",
            phone: "66+ 1234",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        const saveSettings = () => {
            console.log("Settings saved:", form.value);
        };

        const changePassword = () => {
            if (form.value.newPassword !== form.value.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            console.log("Password changed successfully");
        };

        return {
            activeTab,
            form,
            saveSettings,
            changePassword,
        };
    },
};
</script>

<style scoped>
/* Add any scoped styling if necessary */
</style>