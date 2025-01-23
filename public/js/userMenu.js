// public/js/userMenu.js
document.addEventListener('DOMContentLoaded', function() {
  const userIcon = document.getElementById('user-icon');
  const userMenu = document.getElementById('user-menu');
  const onlineCount = document.getElementById('online-count');

  const socket = io();

  // Emituj zdarzenie logowania użytkownika po załadowaniu strony
  socket.emit('userLoggedIn', { email: document.querySelector('.user-icon-container p strong').textContent });

  // Aktualizuj licznik użytkowników online
  socket.on('updateOnlineUsers', (count) => {
      onlineCount.textContent = count;
  });

  userIcon.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (userMenu.style.display === 'none' || userMenu.style.display === "") {
      userMenu.style.display = 'block';
    } else {
      userMenu.style.display = 'none';
    }
  });

  document.addEventListener('click', function(event) {
      if (userMenu.style.display === 'block') {
          userMenu.style.display = 'none';
      }
  });

  userMenu.addEventListener('click', function(event) {
      event.stopPropagation();
  });
});