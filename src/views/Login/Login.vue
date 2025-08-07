<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from "@/api/auth.service.ts";

const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    await authService.login(form.value);
    router.push('/note/list'); // hoặc { name: 'note-list' }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Đăng nhập thất bại';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <h2>🔐 Đăng nhập</h2>
    <form @submit.prevent="handleSubmit" class="login-form">
      <label for="email">Email</label>
      <input v-model="form.email" id="email" type="email" required />

      <label for="password">Mật khẩu</label>
      <input v-model="form.password" id="password" type="password" required />

      <div class="error" v-if="error">{{ error }}</div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-container h2 {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form label {
  margin-top: 10px;
  font-weight: bold;
}

.login-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 4px;
  font-size: 16px;
}

.login-form .error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.login-form button {
  margin-top: 20px;
  padding: 12px;
  background-color: #42b983;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-form button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
