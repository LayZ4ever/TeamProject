document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData))
    }).then(response => response.json()).then(data => {

        alert(data.message)
        window.location.href = "login.html";
    });
});

function myFunction(x) {
    var x = document.getElementById(x);
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}