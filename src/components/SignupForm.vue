<template>
  <div class="form-wrap">
    <form @submit.prevent="handleSubmit">
      <div class="input-control">
        <input
          type="text"
          required
          placeholder="Display name"
          v-model="displayName"
          class="input-field"
        />
      </div>
      <div class="input-control">
        <input
          type="email"
          required
          placeholder="Email"
          v-model="email"
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
        <button
          class="btn btn--secondary"
          :class="{ loading: authProcessing }"
          type="submit"
        >
          <span class="btn-caption">Sign up</span>
          <span class="spinner"></span>
        </button>
      </div>
    </form>
    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const displayName = ref('');
    const authProcessing = ref(false);
    const errorMsg = ref(null);
    const auth = getAuth();
    const router = useRouter();

    const handleSubmit = () => {
      authProcessing.value = true;

      // Create account
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
          // Signed in

          const { user } = userCredential;

          updateProfile(user, {
            displayName: displayName.value,
          }).then(() => {
            router.push({ name: 'ChatRoom' });
          });
        })
        .catch((error) => {
          if (error.code === 'auth/weak-password') {
            errorMsg.value = 'Password should be at least 6 characters';
          } else if (error.code === 'auth/email-already-in-use') {
            errorMsg.value = 'User already exists. Please use Login form';
          } else {
            errorMsg.value = error.message;
          }
        })
        .finally(() => {
          authProcessing.value = false;
        });
    };

    return {
      displayName,
      email,
      password,
      handleSubmit,
      errorMsg,
      authProcessing,
    };
  },
};
</script>
