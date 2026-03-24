const form = document.querySelector(".login-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            localStorage.setItem("username", username);
            // alert("Успешный вход!");

            window.location.href = "pcabinet.html";
        } else {
            alert("Ошибка: Неверные данные");
        }

    } catch (error) {
        console.error(error);
        alert("Ошибка сервера");
    }
});

