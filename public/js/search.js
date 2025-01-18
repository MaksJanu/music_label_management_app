document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[name="search"]');
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.classList.add('search-results');
    searchInput.parentNode.appendChild(searchResultsContainer);

    searchInput.addEventListener('input', async function() {
        const query = searchInput.value;
        if (query.length < 3) {
            searchResultsContainer.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`/api/search?q=${query}`);
            const results = await response.json();

            searchResultsContainer.innerHTML = '';

            if (results.albums.length === 0 && results.artists.length === 0 && results.sessions.length === 0) {
                searchResultsContainer.innerHTML = '<p>No results found</p>';
                return;
            }

            results.albums.forEach(album => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.textContent = `Album: ${album.title}`;
                resultItem.addEventListener('click', () => {
                    window.location.href = `/album/${album._id}`;
                });
                searchResultsContainer.appendChild(resultItem);
            });

            results.artists.forEach(artist => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.textContent = `Artist: ${artist.name}`;
                resultItem.addEventListener('click', () => {
                    window.location.href = `/artist/${artist._id}`;
                });
                searchResultsContainer.appendChild(resultItem);
            });

            results.sessions.forEach(session => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.textContent = `Session: ${session.title}`;
                resultItem.addEventListener('click', () => {
                    window.location.href = `/session/${session._id}`;
                });
                searchResultsContainer.appendChild(resultItem);
            });
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    });
});