document.addEventListener('DOMContentLoaded', function() {
    const albums = document.querySelectorAll('.album-inner');
    
    albums.forEach(album => {
        album.addEventListener('click', function() {
            this.classList.toggle('is-flipped');
        });
    });
});