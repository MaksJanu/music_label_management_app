const socket = io();
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.querySelector('.chat-messages');
const welcomeMessage = document.getElementById('welcome-message');
const leaveRoomButton = document.getElementById('leave-room');
let currentRoom = 'global';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('room');
  const sessionDate = urlParams.get('date');

  if (roomId && sessionDate) {
    joinRoom(roomId, sessionDate);
  } else {
    joinRoom('global');
  }
});

document.querySelectorAll('.join-room').forEach(button => {
  button.addEventListener('click', () => {
    const roomId = button.dataset.roomId;
    const sessionDate = button.dataset.sessionDate;
    joinRoom(roomId, sessionDate);
  });
});

leaveRoomButton.addEventListener('click', () => {
  leaveRoom(currentRoom);
  joinRoom('global');
  // Remove room parameters from URL
  const url = new URL(window.location);
  url.searchParams.delete('room');
  url.searchParams.delete('date');
  window.history.pushState({}, '', url);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const userRole = chatForm.dataset.userRole;

  if (message.trim()) {
    socket.emit('chatMessage', {
      roomId: currentRoom,
      data: {
        message,
        user: document.querySelector('.user-icon-container p strong').textContent,
        role: userRole
      }
    });

    messageInput.value = '';
  }
});

socket.on('message', (data) => {
  const div = document.createElement('div');
  div.classList.add('message');
  if (chatMessages.children.length === 0) {
    div.classList.add('first-message');
  }
  div.innerHTML = `
    <p class="meta">${data.user} <span>(${_.capitalize(data.role)})</span>:</p>
    <p class="text">${data.message}</p>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (welcomeMessage) {
    welcomeMessage.style.display = 'none';
  }
});

function displaySessionDate(date) {
  const dateDiv = document.createElement('div');
  dateDiv.classList.add('session-date');
  dateDiv.style.opacity = '0.3';
  dateDiv.style.textAlign = 'center';
  dateDiv.style.margin = '10px 0';
  dateDiv.textContent = date;
  chatMessages.appendChild(dateDiv);
}

function joinRoom(roomId, sessionDate) {
  if (currentRoom !== 'global') {
    socket.emit('leaveRoom', { roomId: currentRoom, user: document.querySelector('.user-icon-container p strong').textContent });
  }
  currentRoom = roomId;
  socket.emit('joinRoom', { roomId, user: document.querySelector('.user-icon-container p strong').textContent });
  chatMessages.innerHTML = ''; // Clear chat messages
  if (sessionDate) {
    displaySessionDate(sessionDate); // Display session date
  }
  if (currentRoom === 'global') {
    leaveRoomButton.style.display = 'none'; // Hide leave room button
  } else {
    leaveRoomButton.style.display = 'block'; // Show leave room button
  }
}

function leaveRoom(roomId) {
  socket.emit('leaveRoom', { roomId, user: document.querySelector('.user-icon-container p strong').textContent });
  leaveRoomButton.style.display = 'none'; // Hide leave room button
}