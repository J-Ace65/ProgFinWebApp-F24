const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const formData = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
    };

    try {
        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'User registered successfully.';
        } else if (response.status === 409) {
            // Handle duplicate user
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'User already exists. Please try a different email or username.';
        } else {
            const errorMessage = await response.text();
            messageDiv.style.color = 'red';
            messageDiv.textContent = errorMessage;
        }
    } catch (err) {
        console.error('Error:', err);
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Something went wrong. Please try again.';
    }
});
