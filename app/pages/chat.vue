<script setup>
const messages = ref([]);
const newMessage = ref("");
const room = ref("lobby");
let ws;

onMounted(() => {
  // Use 'ws://' for dev and 'wss://' for production
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    messages.value.push(data);
  };
});

const sendMessage = () => {
  const payload = { type: 'chat', room: room.value, text: newMessage.value };
  ws.send(JSON.stringify(payload));
  newMessage.value = "";
};

const joinRoom = (name) => {
  room.value = name;
  ws.send(JSON.stringify({ type: 'join', room: name }));
  messages.value = []; // Clear local history when switching rooms
};
</script>

<template>
  <div class="p-4">
    <div class="flex gap-2 mb-4">
      <button @click="joinRoom('lobby')" class="border p-1">Lobby</button>
      <button @click="joinRoom('gaming')" class="border p-1">Gaming</button>
    </div>

    <div class="h-64 border overflow-y-auto p-2 mb-4">
      <div v-for="(m, i) in messages" :key="i">
        <strong>{{ m.user }}:</strong> {{ m.text }}
      </div>
    </div>

    <input v-model="newMessage" @keyup.enter="sendMessage" class="border p-2 w-full" placeholder="Type a message..." />
  </div>
</template>