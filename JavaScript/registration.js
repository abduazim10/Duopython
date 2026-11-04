const form = document.getElementById("registerForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const button = form.querySelector("button[type=submit]");

    showFormMessage(form, "");

    if (password.length < 8) {
        showFormMessage(form, "Пароль должен содержать не менее 8 символов");
        return;
    }

    button.disabled = true;
    try {
        const res = await fetch(`${API_BASE}/api/users/create/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, email: email, password: password })
        });

        let data = {};
        try { data = await res.json(); } catch (e) { /* ответ не JSON */ }

        if (res.ok && !data.error) {
            window.location.href = "login.html";
        } else if (res.status === 429) {
            showFormMessage(form, "Слишком много попыток. Подождите немного и попробуйте снова.");
        } else {
            showFormMessage(form, data.error || data.detail || "Не удалось зарегистрироваться");
        }
    } catch (err) {
        console.error(err);
        showFormMessage(form, "Не удаётся связаться с сервером. Проверьте, что он запущен.");
    } finally {
        button.disabled = false;
    }
});
