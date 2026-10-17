const form = document.getElementById("registerForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:8000/api/users/create/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            // alert(data.error);
        } else {
            // alert("Аккаунт Создан! Теперь войдите в систему через Login");
            window.location.href = "login.html";
        }
    })  
    .catch(err => {
        console.error(err);
        alert("Ошибка");
    });
});