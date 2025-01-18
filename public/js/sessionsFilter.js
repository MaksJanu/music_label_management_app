document.addEventListener('DOMContentLoaded', function() {
    const artistFilter = document.getElementById('artistFilter');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const sessionsContainer = document.getElementById('sessions');
    const originalSessions = Array.from(sessionsContainer.getElementsByClassName('session'));

    artistFilter.addEventListener('change', filterSessions);
    startDateInput.addEventListener('change', filterSessions);
    endDateInput.addEventListener('change', filterSessions);

    function filterSessions() {
        console.log('Filtering sessions');
        const artist = artistFilter.value;
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
        if (endDate) endDate.setHours(23, 59, 59, 999); // Set end date to the end of the day

        let sessions = originalSessions;

        if (artist) {
            console.log('Filtering by artist:', artist);
            sessions = sessions.filter(session => session.querySelector('.session-header p').textContent.includes(artist));
        }

        if (startDate) {
            console.log('Filtering by start date:', startDate);
            sessions = sessions.filter(session => {
                const sessionDate = new Date(session.querySelector('.session-body p:nth-child(3)').textContent.split(': ')[1]);
                return sessionDate >= startDate;
            });
        }

        if (endDate) {
            console.log('Filtering by end date:', endDate);
            sessions = sessions.filter(session => {
                const sessionDate = new Date(session.querySelector('.session-body p:nth-child(3)').textContent.split(': ')[1]);
                return sessionDate <= endDate;
            });
        }

        // If no filters are applied, show all sessions
        if (!artist && !startDate && !endDate) {
            console.log('No filters applied, showing all sessions');
            sessions = originalSessions;
        }

        sessionsContainer.innerHTML = '';
        sessions.forEach(session => sessionsContainer.appendChild(session));
    }
});