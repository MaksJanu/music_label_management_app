document.getElementById('role').addEventListener('change', function() {
    let role = this.value;
    const artistNameField = document.getElementById('artistName');
    const profilePic = document.getElementById('profilePic');

    if (role === 'artist') {
        artistNameField.style.display = 'block';
        profilePic.style.display = 'block';
        artistNameField.required = true;
    } else {
        artistNameField.style.display = 'none';
        profilePic.style.display = 'none';
        artistNameField.required = false;
    }
});