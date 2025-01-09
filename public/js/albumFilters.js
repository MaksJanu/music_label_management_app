document.addEventListener('DOMContentLoaded', function() {
    const genreFilter = document.getElementById('genreFilter');
    const artistFilter = document.getElementById('artistFilter');
    const albums = document.querySelectorAll('.album');

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const filterAlbums = debounce(() => {
        const selectedGenre = genreFilter.value;
        const selectedArtist = artistFilter.value;

        albums.forEach(album => {
            const albumGenre = album.querySelector('h4').textContent;
            const albumArtist = album.querySelector('p').textContent;
            
            const genreMatch = !selectedGenre || albumGenre === selectedGenre;
            const artistMatch = !selectedArtist || albumArtist === selectedArtist;

            album.style.display = genreMatch && artistMatch ? 'block' : 'none';
        });
    }, 250);

    genreFilter.addEventListener('change', filterAlbums);
    artistFilter.addEventListener('change', filterAlbums);
});