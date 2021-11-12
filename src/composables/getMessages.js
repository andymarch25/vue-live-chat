import { ref } from 'vue';
import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { database } from '../firebase/config';

const getMessages = () => {
  const messages = ref([]);
  const error = ref(null);
  const loaded = ref(false);

  const load = async () => {
    try {
      const messagesRef = collection(database, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);

      messages.value = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      loaded.value = true;
    } catch (err) {
      error.value = err.message;
    }
  };
  return {
    messages,
    error,
    loaded,
    load,
  };
};

export default getMessages;
