const restorePasswordForm = document.querySelector('#restorePasswordForm');

restorePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = restorePasswordForm.email.value;
    try {
        const response = await fetch('/api/sessions/restore-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.status === 'error') {
            alert(data.message);
        } else {
            alert(data.message);
            window.location.href = '/';
        }
    } catch (error) {
        alert(error);
    }
});