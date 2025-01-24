document.addEventListener('DOMContentLoaded', async () => {
    const sessionId = '<%= session._id %>'; // Zakładam, że masz dostęp do ID sesji
    try {
        const response = await fetch(`/api/studio-session/${sessionId}`);
        const session = await response.json();

        if (response.ok) {
            document.querySelector('input[name="title"]').value = session.title;
            document.querySelector('input[name="genre"]').value = session.genre;
            document.querySelector('input[name="releaseDate"]').value = new Date(session.releaseDate).toISOString().split('T')[0];
            const tracklistContainer = document.querySelector('.add-tracks');
            tracklistContainer.innerHTML = ''; // Wyczyść istniejące pola
            session.tracks.forEach((track, index) => {
                const trackDiv = document.createElement('div');
                trackDiv.classList.add('add-tracks');
                trackDiv.innerHTML = `
                    <input type="text" name="tracklist" value="${track}" required>
                    ${index === 0 ? '<button class="add-track" type="button">+</button>' : '<button class="remove-track" type="button">-</button>'}
                `;
                tracklistContainer.appendChild(trackDiv);
            });
        } else {
            alert('Failed to load session data');
        }
    } catch (error) {
        alert('Error loading session data');
    }
});