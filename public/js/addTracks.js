document.addEventListener('DOMContentLoaded', function() {
    const tracksList = [];
    const addTrackButton = document.querySelector('.add-track');
    const tracksContainer = document.querySelector('.add-tracks-container');
    const form = document.querySelector('#albumForm, #updateAlbumForm');

    if (!form || !addTrackButton || !tracksContainer) {
        console.error('Required elements not found');
        return;
    }

    // Add hidden input for tracks
    const tracksInput = document.createElement('input');
    tracksInput.type = 'hidden';
    tracksInput.name = 'tracks';
    form.appendChild(tracksInput);

    // Update tracks list function
    const updateTracks = () => {
        const inputs = document.querySelectorAll('input[name="tracklist"]');
        tracksList.length = 0;
        inputs.forEach(input => {
            if(input.value.trim()) {
                tracksList.push(input.value.trim());
            }
        });
        tracksInput.value = JSON.stringify(tracksList);
    };

    // Initial track input listener
    tracksContainer.querySelector('input').addEventListener('input', updateTracks);

    addTrackButton.addEventListener('click', () => {
        const newTrackDiv = document.createElement('div');
        newTrackDiv.className = 'add-tracks';

        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.name = 'tracklist';
        newInput.placeholder = 'Track';
        newInput.required = true;
        newInput.addEventListener('input', updateTracks);

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-track';
        removeButton.type = 'button';
        removeButton.textContent = '-';
        removeButton.onclick = () => {
            newTrackDiv.remove();
            updateTracks();
        };

        newTrackDiv.appendChild(newInput);
        newTrackDiv.appendChild(removeButton);
        tracksContainer.appendChild(newTrackDiv);
    });

    // Add remove button functionality to existing tracks
    document.querySelectorAll('.remove-track').forEach(button => {
        button.addEventListener('click', (event) => {
            event.target.parentElement.remove();
            updateTracks();
        });
    });
});