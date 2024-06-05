const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const user = {
        email: loginForm.email.value,
        password: loginForm.password.value
    }
    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.status === 'error') {
            alert(data.message);
        } else {
            alert('Sesión iniciada exitosamente');
            const user = data.payload;
            if (user.role === 'admin') {
                window.location.href = '/admin/products';
                return;
            }
            window.location.href = '/products';
        }
    } catch (error) {
        alert(error);
    }
});