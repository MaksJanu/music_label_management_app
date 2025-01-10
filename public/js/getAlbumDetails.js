document.addEventListener('DOMContentLoaded', async () => {
    const albumId = window.location.pathname.split('/').pop();
    try {
        const response = await fetch(`/api/album/${albumId}`);
        const album = await response.json();
        
        document.getElementById('albumId').value = album._id;
        document.getElementById('title').value = album.title;
        document.getElementById('genre').value = album.genre;
        document.getElementById('releaseDate').value = album.releaseDate;
        document.getElementById('artist').value = album.artist;
    } catch (error) {
        console.error('Error fetching album data:', error);
    }
});