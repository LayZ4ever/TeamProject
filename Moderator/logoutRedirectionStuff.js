window.onload = function () {
    fetch('/api/checkSession')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = '/login.html'; // Redirect to login page if not logged in
            }
        })
        .catch(error => console.error('Error:', error));
};

document.getElementById('logoutButton').addEventListener('click', function () {
    fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/login.html'; // Redirect to login page after logout
            } else {
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
});

// It is used, please don't touch it <3