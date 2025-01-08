async function handleSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    
    // Get tracks from hidden input and parse JSON
    const tracksJson = formData.get('tracks');
    const tracks = JSON.parse(tracksJson || '[]');
    
    // Remove the JSON tracks and add individual tracks
    formData.delete('tracks');
    tracks.forEach(track => {
        formData.append('tracks', track);
    });

    try {
        const response = await fetch('/api/album', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = '/dashboard'; // Redirect on success
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to upload album');
        }
    } catch (error) {
        alert('Error uploading album');
    }
    
    return false;
}