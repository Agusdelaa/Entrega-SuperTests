async function logout() {
    try {
        const response = await fetch('/api/sessions/logout', { method: 'POST' });
        const data = await response.json();
        alert(data.message);
        if (data.status === 'success') {
            window.location.href = '/login';
        }
    } catch (error) {
        alert(error);
    }
}