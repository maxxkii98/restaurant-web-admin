<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import API_PATH from "@/config/apiPath";

const router = useRouter();

const username = ref("");
const password = ref("");
const isSubmitting = ref(false);
const apiError = ref("");

const passwordRules = ref([
  (v: string) => !!v || "Password is required",
  (v: string) =>
    v.length >= 6 || "Password must be at least 6 characters long",
]);

async function handleLogin() {
  isSubmitting.value = true;
  apiError.value = "";

  try {
    const response = await axios.post(API_PATH.USER_LOGIN, {
      username: username.value,
      password: password.value,
    });

    // Handle login success
    if (response.data && response.data.user) {
      console.log("Login successful:", response.data);

      // Store username and role in localStorage
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("role", response.data.user.role);

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      throw new Error("Invalid login response format");
    }
  } catch (error: any) {
    apiError.value =
      error.response?.data?.message || "Failed to login. Please try again.";
    console.error("Login error:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <!-- Username Input -->
    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-grey200">
      Username
    </v-label>
    <VTextField
      v-model="username"
      required
      hide-details="auto"
      placeholder="Enter your username"
      class="mb-6"
    ></VTextField>

    <!-- Password Input -->
    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-grey200">
      Password
    </v-label>
    <VTextField
      v-model="password"
      :rules="passwordRules"
      required
      hide-details="auto"
      type="password"
      placeholder="Enter your password"
      class="mb-6"
    ></VTextField>

    <!-- Login Button -->
    <v-btn
      size="large"
      rounded="pill"
      :loading="isSubmitting"
      color="primary"
      block
      type="submit"
    >
      Sign In
    </v-btn>

    <!-- Error Alert -->
    <div v-if="apiError" class="mt-4">
      <v-alert type="error" dense>
        {{ apiError }}
      </v-alert>
    </div>
  </form>
</template>
