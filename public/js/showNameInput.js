document.getElementById('role').addEventListener('change', function() {
    let role = this.value;
    const artistNameField = document.getElementById('artistName');
    const profilePic = document.getElementById('profilePic');

    if (role === 'artist') {
        artistNameField.required = true;
        profilePic.required = true;
    } else {
        artistNameField.required = false;
        profilePic.required = false;
    }
});