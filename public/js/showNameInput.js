document.getElementById('role').addEventListener('change', function() {
    let role = this.value;
    const artistNameField = document.getElementById('artistName');
    const profilePic = document.getElementById('profilePic');

    if (role === 'artist') {
        artistNameField.style.visibility = 'visible';
        artistNameField.style.position = 'relative';
        profilePic.style.visibility = 'visible';
        profilePic.style.position = 'relative';
        artistNameField.required = true;
        profilePic.required = true;
    } else {
        artistNameField.style.visibility = 'hidden';
        artistNameField.style.position = 'absolute';
        profilePic.style.visibility = 'hidden';
        profilePic.style.position = 'absolute';
        artistNameField.required = false;
        profilePic.required = false;
    }
});