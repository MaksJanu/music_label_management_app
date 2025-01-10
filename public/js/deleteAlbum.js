async function deleteAlbum(albumTitle) {
    if (confirm('Are you sure you want to delete this album?')) {
        try {
            const response = await fetch(`/api/album/${albumTitle}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Album was deleted successfully!');
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to delete album');
            }
        } catch (error) {
            alert('Error deleting album');
        }
    }
}