function myFunction(x) {
    var x = document.getElementById(x);
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData))
    }).then(response => response.json()).then(data => alert(data.message));
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData))
    }).then(response => response.json()).then(data => {
        if (data.success) {
            console.log(data.roleId);
            if (data.roleId === 1){ // 1 is Moderator
                window.location.href = '/Moderator.html'; // Moderator
            } else if (data.roleId === 2) { // 2 is Customer
                window.location.href = '/customerPage.html';
            }else if (data.roleId === 3) { // 3 is Employee
                window.location.href = '/parcel.html';
            }
        } else {
            alert(data.message);
        }
    });
});
