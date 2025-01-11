document.addEventListener('DOMContentLoaded', function() {
    const tracksList = [];
    const addTrackButtons = document.querySelectorAll('.add-track');
    const form = document.querySelector('#albumForm') || document.querySelector('#updateAlbumForm');

    if (!form || addTrackButtons.length === 0) {
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
        const inputs = form.querySelectorAll('input[name="tracklist"]');
        tracksList.length = 0;
        inputs.forEach(input => {
            if(input.value.trim()) {
                tracksList.push(input.value.trim());
            }
        });
        tracksInput.value = JSON.stringify(tracksList);
    };

    // Initial track input listener
    form.querySelectorAll('input[name="tracklist"]').forEach(input => {
        input.addEventListener('input', updateTracks);
    });

    addTrackButtons.forEach(addTrackButton => {
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
            addTrackButton.parentElement.parentElement.insertBefore(newTrackDiv, addTrackButton.parentElement.nextSibling); // Insert new track div after the add button's parent
        });
    });

    // Add remove button functionality to existing tracks
    form.querySelectorAll('.remove-track').forEach(button => {
        button.addEventListener('click', (event) => {
            event.target.parentElement.remove();
            updateTracks();
        });
    });
});