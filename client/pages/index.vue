<template>
  <div>
    <h1>{{ greeting }}</h1>
    <p v-if="greetingError">{{ greetingError }}</p>
    <p v-if="usersError">{{ usersError }}</p>
    <pre>{{ users }}</pre>
  </div>
</template>

<script setup lang="ts">
import { getErrorMessage } from "../utils/api-error";
import type { User } from "../composables/useUsersApi";

const greeting = ref("loading...");
const users = ref<User[]>([]);
const greetingError = ref("");
const usersError = ref("");
const api = useApi();
const usersApi = useUsersApi();

// Fetch data from the NestJS API on component mount
onMounted(async () => {
  try {
    greeting.value = await api.get<string>("/api");
  } catch (error) {
    greetingError.value = getErrorMessage(error);
    console.error("Failed to fetch greeting:", error);
  }

  try {
    users.value = await usersApi.getUsers();
  } catch (error) {
    usersError.value = getErrorMessage(error);
    console.error("Failed to fetch users:", error);
  }
});
</script>
