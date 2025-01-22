document.addEventListener('DOMContentLoaded', () => {
    const updateUserForm = document.getElementById('updateUserForm');
    if (updateUserForm) {
        updateUserForm.addEventListener('submit', handleUpdate);
    }
});

async function handleUpdate(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const userId = form.dataset.userId;

    try {
        const response = await fetch(`/api/auth/update-user/${userId}`, {
            method: 'PUT',
            body: formData
        });

        const responseData = await response.json();

        if (response.ok) {
            alert('Credentials updated successfully');
            window.location.reload();
        } else {
            alert(responseData.message || 'Failed to update credentials');
        }
    } catch (error) {
        alert('Error updating credentials');
    }
}