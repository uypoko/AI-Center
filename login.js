document.getElementById('login-register-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevents the default form submission

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const message = document.getElementById('message');

    // Clear previous messages
    message.textContent = '';

    // Validation for email
    if (!email) {
        message.textContent = 'Please enter your email';
        return;
    }

    if (!validateEmail(email)) {
        message.textContent = 'Please enter a valid email address';
        return;
    }

    // Proceed with the logic based on the button's state
    if (password && confirmPassword) {
        // Handle registration
        if (password === confirmPassword) {
            registerUser(email, password);
        } else {
            message.textContent = 'Passwords do not match';
        }
    } else if (password) {
        // Handle login
        loginUser(email, password);
    } else {
        // Handle email check (whether the user exists or not)
        checkEmail(email);
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function checkEmail(email) {
    fetch('http://localhost:3000/check-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.registered) {
            document.getElementById('password').style.display = 'block';
            document.getElementById('login-register-button').textContent = 'Login';
        } else {
            document.getElementById('password').style.display = 'block';
            document.getElementById('confirm-password-container').style.display = 'block';
            document.getElementById('login-register-button').textContent = 'Register';
        }
    })
    .catch(error => {
        document.getElementById('message').textContent = 'Error checking email';
        console.error('Error:', error);
    });
}

function registerUser(email, password) {
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registered successfully') {
            document.getElementById('message').textContent = 'Registration successful! You can now login.';
            resetForm();
        } else {
            document.getElementById('message').textContent = 'Error registering user';
        }
    })
    .catch(error => {
        document.getElementById('message').textContent = 'Error registering user';
        console.error('Error:', error);
    });
}

function loginUser(email, password) {
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            document.getElementById('message').textContent = 'Invalid email or password';
        }
    })
    .catch(error => {
        document.getElementById('message').textContent = 'Error logging in';
        console.error('Error:', error);
    });
}

function resetForm() {
    document.getElementById('password').style.display = 'none';
    document.getElementById('confirm-password-container').style.display = 'none';
    document.getElementById('login-register-button').textContent = 'Next';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';
}

window.onload = function() {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'index.html'; // Redirect to main chat page if token is found
    }
};
