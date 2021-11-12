<template>
  <div class="container">
    <div class="welcome">
      <div class="welcome-left">
        <img src="@/assets/images/chat-bg.svg" alt="" />
      </div>
      <div class="welcome-right">
        <div v-if="isLoggedChecked">
          <h1 class="logo">Get's started</h1>
          <div v-show="showLogin">
            <p class="caption">
              Don't have an account?
              <span class="link" @click="showLogin = false">Sign up</span>
            </p>
            <LoginForm />
          </div>
          <div v-show="!showLogin">
            <p class="caption">
              Already have an account?
              <span class="link" @click="showLogin = true">Login</span>
            </p>
            <SignupForm />
          </div>
        </div>
        <div v-else class="spinner-holder">
          <Spinner />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import SignupForm from '../components/SignupForm.vue';
import Spinner from '../components/SpinnerLoader.vue';

export default {
  components: { LoginForm, SignupForm, Spinner },
  setup() {
    const showLogin = ref(true);
    const isLoggedChecked = ref(false);
    const router = useRouter();

    const user = getAuth().currentUser;

    // console.log('user: ', user)

    if (user) {
      router.push({ name: 'Chat' });
    } else {
      isLoggedChecked.value = true;
    }

    return { showLogin, isLoggedChecked };
  },
};
</script>

<style lang="scss">
.welcome {
  display: flex;
  background: transparent;
  min-height: 360px;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 40px;

  &-left {
    text-align: left;
    flex-shrink: 0;
    flex-basis: 50%;
    background-color: #eaf3fa;
    display: flex;
    align-items: flex-end;

    @media (max-width: 660px) {
      display: none;
    }

    img {
      width: 100%;
      display: flex;
    }
  }

  &-right {
    text-align: left;
    flex-grow: 1;
    padding: 30px 34px;
    background: rgba(#fff, 0.9);
  }
}

.spinner-holder {
  height: 100%;
  display: flex;
}
</style>
