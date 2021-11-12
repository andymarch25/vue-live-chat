<template>
  <div class="form-wrap">
    <form @submit.prevent="handleSubmit">
      <div class="input-control">
        <input
          type="email"
          required
          placeholder="Email"
          v-model="email"
          autocomplete="email"
          class="input-field"
        />
      </div>
      <div class="input-control">
        <input
          type="password"
          required
          placeholder="Password"
          v-model="password"
          class="input-field"
        />
      </div>
      <div class="form-action">
        <button class="btn" :class="{ loading: authProcessing }" type="submit">
          <span class="btn-caption">Login</span>
          <span class="spinner"></span>
        </button>
      </div>
    </form>
    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const authProcessing = ref(false);
    const errorMsg = ref(null);
    const router = useRouter();

    const auth = getAuth();
    // anov25m@gmail.com

    const handleSubmit = () => {
      errorMsg.value = null;
      authProcessing.value = true;
      
      // Sign in existing (login)
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          // Signed in
          router.push({ name: 'ChatRoom' });
          // ...
        })
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            errorMsg.value = 'User not found';
          } else if (error.code === 'auth/wrong-password') {
            errorMsg.value = 'Wrong password';
          } else {
            errorMsg.value = error.message;
          }
          // console.log('error', error.value);
        })
        .finally(() => {
          authProcessing.value = false;
        });
    };

    return {
      email,
      password,
      handleSubmit,
      errorMsg,
      authProcessing,
    };
  },
};
</script>
