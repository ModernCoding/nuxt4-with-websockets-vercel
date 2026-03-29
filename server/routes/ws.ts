export default defineWebSocketHandler({
  open(peer) {
    console.log(`[ws] connected: ${peer.id}`);
    // Default: everyone joins a "lobby"
    peer.subscribe("lobby");
  },

  message(peer, message) {
    const data = JSON.parse(message.text());

    // Switch rooms: { type: 'join', room: 'room1' }
    if (data.type === 'join') {
      peer.subscribe(data.room);
      peer.publish(data.room, { user: 'system', text: `User ${peer.id} joined ${data.room}` });
    } 
    
    // Chat message: { type: 'chat', room: 'room1', text: 'Hello!' }
    else if (data.type === 'chat') {
      const payload = { user: peer.id, text: data.text };
      
      // Send to everyone else in the room
      peer.publish(data.room, JSON.stringify(payload));
      
      // Optionally echo back to sender
      peer.send(JSON.stringify(payload));
    }
  },

  close(peer) {
    console.log(`[ws] closed: ${peer.id}`);
  }
});