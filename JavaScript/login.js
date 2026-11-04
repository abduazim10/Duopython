const form = document.querySelector(".login-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const button = form.querySelector("button[type=submit]");

    showFormMessage(form, "");
    button.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        });

        let data = {};
        try { data = await res.json(); } catch (e) { /* ответ не JSON */ }

        if (res.ok) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            localStorage.setItem("username", username);
            window.location.href = "pcabinet.html";
        } else if (res.status === 429) {
            showFormMessage(form, "Слишком много попыток. Подождите немного и попробуйте снова.");
        } else if (res.status === 400 || res.status === 401) {
            showFormMessage(form, "Неверное имя пользователя или пароль");
        } else {
            showFormMessage(form, "Ошибка сервера. Попробуйте позже.");
        }
    } catch (error) {
        console.error(error);
        showFormMessage(form, "Не удаётся связаться с сервером. Проверьте, что он запущен.");
    } finally {
        button.disabled = false;
    }
});
