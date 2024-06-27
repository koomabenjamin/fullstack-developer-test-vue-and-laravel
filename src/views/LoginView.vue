<template>
  <div
    class="min-h-screen flex items-center justify-center bg-lime-50 bg-opacity-50"
  >
    <div
      class="max-w-md w-full space-y-8 p-6 bg-lime-100 bg-opacity-50 rounded-lg shadow-md"
    >
      <!-- <div class="min-h-screen flex items-center justify-center bg-black bg-opacity-50">
      <div class="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md"> -->
      <div class="text-center">
        <!-- <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"> -->
        <h2 class="mt-6 text-center text-2xl font-bold text-gray-900">
          Account Login
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="submitLoginData">
        <div class="rounded-md shadow-sm space-y-4">
          <div class="mt-2">
            <label for="email" class="sr-only">Email Address</label>
            <InputForm
              id="email"
              name="email"
              type="email"
              v-model="email"
              placeholder="E-mail Address"
              required
            />
          </div>
          <div class="mt-4">
            <label for="password" class="sr-only">Password</label>
            <InputForm
              id="password"
              name="password"
              type="password"
              v-model="password"
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-indigo-600 hover:text-indigo-500"
              >Forgot password?</a
            >
          </div>
        </div>

        <div>
          <Button
            :disabled="isLoading"
            type="submit"
            label="Sign In"
            class="flex w-full justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span><i v-if="isLoading" class="fa fa-spinner fa-spin"></i></span>
          </Button>
          <!-- <Button type="submit" label="Sign In" class="flex w-full justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" /> -->
        </div>

        <p class="text-center text-sm text-gray-600">
          Don't Have an Account?
          <a
            href="#"
            @click.prevent="goToRegister"
            class="font-semibold text-indigo-600 hover:text-indigo-500"
            >Sign Up</a
          >
        </p>
      </form>

      <!-- <p class="mt-4">Input Email: {{ email }}</p>
          <p>Input Password: {{ password }}</p> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2/dist/sweetalert2";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import Button from "../components/shared/Button.vue";
import InputForm from "../components/shared/Input.vue";

const email = ref("projectcode@gmail.com");
const password = ref("projectcode");
const isLoading = ref(false);
const router = useRouter();

const submitLoginData = async () => {
  const authStore = useAuthStore();
  isLoading.value = true;
  console.log("Email: ", email.value);
  console.log("Password: ", password.value);

  try {
    await authStore.login(email.value, password.value);
    router.push("/");
  } catch (error) {
    console.log("BAckEND ERROR: ", error);
    let errorMessage = "An error occurred during login. Please try again.";
    if (error) {
      errorMessage = error;
    }

    Swal.fire({
      position: "bottom-end",
      toast: true,
      icon: "error",
      title: "An Error Occured",
      text: errorMessage,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#fff",
    }).then((result) => {});
  } finally {
    isLoading.value = false;
  }
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<style scoped></style>
