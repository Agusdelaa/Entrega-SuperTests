async function changeUserRole(userId) {
    try {
        const response = await fetch(`/api/sessions/premium/${userId}`, { method: 'PUT' });
        const data = await response.json();
        if (data.status === 'success') {
            alert(data.message);
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert(error);
    }
}