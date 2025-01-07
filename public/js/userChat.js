const socket = io();
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.querySelector('.chat-messages');


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
  
    if (message.trim()) {
      socket.emit('chatMessage', {
        message,
        user: document.querySelector('.user-icon-container p strong').textContent,
        role: '<%= user.role %>'
      });
  
      messageInput.value = '';
    }
});


socket.on('message', (data) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
      <p class="meta">${data.user} <span>${data.role}</span></p>
      <p class="text">${data.message}</p>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
