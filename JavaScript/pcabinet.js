document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;

    const nameEl = document.querySelector(".pchead-p");
    nameEl.textContent = localStorage.getItem("username") || "";

    try {
        const res = await apiFetch("/api/me/");
        if (!res.ok) return;
        const user = await res.json();
        nameEl.textContent = user.username;
        localStorage.setItem("username", user.username);
    } catch (error) {
        // Если токен недействителен, apiFetch сам отправит на страницу входа.
        // Если сервер просто недоступен, оставляем сохранённое имя.
        console.error(error);
    }
});
