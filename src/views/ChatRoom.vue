<template>
  <div class="container container--chat">
    <div class="chat-holder">
      <div class="chat">
        <div class="chat-top">
          <div class="chat-user-details" v-if="user">
            <div class="chat-user-details-name">{{ user.displayName }}</div>
            <div class="chat-user-details-email">{{ user.email }}</div>
          </div>
          <div class="chat-sign-out">
            <button class="btn btn--small btn--secondary" @click="signOut">
              Logout
            </button>
          </div>
        </div>
        <div class="chat-stage">
          <div class="chat-stage-inner" ref="chatStageInner" v-if="user">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="{
                'message-holder--current-user': message.user_uid == user.uid,
              }"
              class="message-holder"
            >
              <div
                class="message"
                :class="{
                  'message--current-user': message.user_uid == user.uid,
                }"
              >
                <div class="message-top">
                  <div class="message-top-name">{{ message.user_uid == user.uid
                    ? 'You'
                    : message.display_name }}</div>
                  <div class="message-top-time">
                    {{ new Date(message.createdAt)
                    .toLocaleString('ru', { timeZone: 'Europe/Kiev' }) }}</div>
                </div>
                <div class="message-body">{{ message.message }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-bottom">
          <div class="chat-bottom-inner">
            <div class="chat-input">
              <textarea
                v-model="inputArea"
                @keydown.enter.prevent="sendMessage"
              ></textarea>
            </div>
            <div class="chat-action">
              <button
                class="btn btn--small"
                :class="{ loading: isMessageSending }"
                @click="sendMessage"
              >
                <span class="btn-caption">Send</span>
                <span class="spinner"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
import {
  collection,
  query,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import getMessages from '../composables/getMessages';
import { database } from '../firebase/config';

export default {
  setup() {
    const router = useRouter();
    const chatStageInner = ref(null);
    const inputArea = ref('');
    const auth = getAuth();
    const user = ref(null);
    const isMessageSending = ref(false);
    user.value = auth.currentUser;

    const {
      messages,
      load,
    } = getMessages();

    const scrollChatBottom = () => {
      if (chatStageInner.value) {
        chatStageInner.value.scrollTop = chatStageInner.value.scrollHeight;
      }
    };

    load().then(() => {
      const q = query(collection(database, 'messages'));

      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const messageExist = messages.value.find((mes) => mes.id === change.doc.id);

            if (!messageExist) {
              messages.value.push({
                ...change.doc.data(),
                id: change.doc.id,
              });
            }
          }

          setTimeout(scrollChatBottom, 100);
        });
      });
    });

    // console.log(messages)

    onAuthStateChanged(auth, (userData) => {
      user.value = userData;
      // console.log(userData)
    });

    onMounted(() => {
      scrollChatBottom();
    });

    const signOut = () => {
      getAuth()
        .signOut()
        .then(() => {
          router.push('/');
        });
    };

    const sendMessage = async () => {
      isMessageSending.value = true;
      const message = {
        message: inputArea.value,
        createdAt: Date.now(),
        user_uid: user.value.uid,
        display_name: user.value.displayName,
      };
      await addDoc(collection(database, 'messages'), message);
      isMessageSending.value = false;

      inputArea.value = '';
    };

    return {
      signOut,
      user,
      messages,
      chatStageInner,
      sendMessage,
      inputArea,
      isMessageSending,
    };
  },
};
</script>

<style lang="scss">
.chat {
  max-width: 600px;
  width: 100%;
  margin: auto;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  height: 100%;

  max-height: 800px;
  padding: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    border-radius: 0;
  }

  &-holder {
    padding: 80px 0;
    height: 100%;
    overflow: hidden;
    display: block;
    align-items: center;
    justify-content: center;

    @media (max-width: 480px) {
      padding: 0;
    }
  }

  &-top {
    flex-basis: 70px;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eaf3fa;
    padding: 0 15px;
    padding-bottom: 10px;
  }

  &-stage {
    overflow: hidden;
    border-radius: 12px;
    flex-grow: 1;
    margin-top: -10px;
    background: #fff;
    box-shadow: 0 -10px 11px -10px rgba(0, 0, 0, 0.1);
    position: relative;

    &::after {
      content: "";
      height: 20px;
      width: 100%;
      left: 0;
      top: 0;
      position: absolute;
      background: linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0));
    }

    &-inner {
      height: 100%;
      overflow: auto;
      padding: 15px 15px 0 15px;
      display: flex;
      flex-direction: column;
    }
  }

  &-bottom {
    flex-shrink: 0;
    border-radius: 20px;
    padding: 10px;

    &-inner {
      border: 2px solid #eaf3fa;
      display: flex;
      overflow: hidden;
      align-items: center;
      border-radius: 20px;
    }

    textarea {
      border: none;
      width: 100%;
      font-size: 16px;
      resize: none;
      padding: 10px 15px;
      height: 42px;
      display: block;
      outline: none;
      color: $font-color;
      font-family: "Lato", sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      border-radius: 20px;
    }
  }

  &-input {
    flex-grow: 1;
  }

  &-action {
    padding-right: 10px;
  }

  &-user-details {
    flex-grow: 1;
    text-align: left;

    &-name {
      font-size: 16px;
      font-weight: bold;
    }

    &-email {
      font-size: 10px;
      opacity: 0.5;
    }
  }
}

.message {
  background-color: #e8f5e9;
  max-width: 60%;
  border-radius: 15px 15px 15px 0;
  padding: 10px 16px;
  text-align: left;
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.02);
  display: inline-block;

  &-holder {
    margin-bottom: 10px;
    text-align: left;

    &--current-user {
      text-align: right;
    }
  }

  @media (max-width: 480px) {
    max-width: calc(100% - 50px);
    font-size: 16px;
    padding: 8px 16px;
  }

  &--current-user {
    background-color: #f5f5f5;
    border-radius: 15px 15px 0 15px;
    align-self: flex-end;
  }

  &-top {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    padding-bottom: 5px;

    &-name {
      font-weight: bold;
    }

    &-time {
      opacity: 0.3;
      margin-left: 5px;
    }
  }
}
</style>
