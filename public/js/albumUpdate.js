
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('updateAlbumForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const albumId = document.getElementById('albumId').value;

        try {
            const response = await axios.put(`/api/album/update-album/${albumId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Error updating album:', error);
            console.error('Response data:', error.response.data);
        }
    });
});