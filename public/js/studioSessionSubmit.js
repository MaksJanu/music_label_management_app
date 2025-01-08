window.onload = function() {
    document.getElementById('albumForm').reset();
}


async function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);

    const data = {
        date: formData.get('date'),
        duration: parseInt(formData.get('duration')),
        details: formData.get('details')
    };

    try {
        const response = await fetch('/api/studio-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            if (responseData.message === "Session with the same details already exists!") {
                alert("A session with these details already exists!");
            } else {
                alert(responseData.message || 'Failed to create studio session');
            }
        }
    } catch (error) {
        alert('Error creating studio session');
    }
    
    return false;
}