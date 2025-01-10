document.getElementById('role').addEventListener('change', function() {
    var role = this.value;
    var artistNameField = document.getElementById('artistName');
    if (role === 'artist') {
        artistNameField.style.display = 'block';
        artistNameField.required = true;
    } else {
        artistNameField.style.display = 'none';
        artistNameField.required = false;
    }
});