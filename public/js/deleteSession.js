async function deleteSession(sessionId) {
    if (confirm('Are you sure you want to delete this session?')) {
        try {
            const response = await fetch(`/api/studio-session/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Session was deleted successfully!');
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to delete session');
            }
        } catch (error) {
            alert('Error deleting session');
        }
    }
}