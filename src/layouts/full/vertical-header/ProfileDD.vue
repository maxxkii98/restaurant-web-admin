<script setup lang="ts">
import { CircleXIcon, MailIcon } from 'vue-tabler-icons';
import { profileDD } from '@/_mockApis/headerData';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';

const authStore = useAuthStore();
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="true" class="profile_popup">
        <!-- <template v-slot:activator="{ props }">
            <div class=" text-left px-0 cursor-pointer" variant="text" v-bind="props">
                <div class="d-flex align-center">
                    <v-avatar size="50">
                        <img src="@/assets/images/profile/user6.jpg" width="50" alt="Mike Nielsen" />
                    </v-avatar>
                    <div class="ml-md-4 d-md-block d-none">
                        <h6 class="text-h6 d-flex align-center text-black font-weight-semibold">Mike Nielsen</h6>
                        <span class="text-subtitle-2 font-weight-medium text-grey100">Admin</span>
                    </div>
                </div>
            </div>
        </template> -->
    </v-menu>
</template>
