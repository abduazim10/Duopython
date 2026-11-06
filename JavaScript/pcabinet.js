document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;

    const nameEl = document.querySelector(".pchead-p");
    const saved = localStorage.getItem("username") || "";
    nameEl.textContent = saved;
    setGreeting(saved);

    try {
        const res = await apiFetch("/api/me/");
        if (res.ok) {
            const user = await res.json();
            nameEl.textContent = user.username;
            localStorage.setItem("username", user.username);
            setGreeting(user.username);
        }
    } catch (error) {
        // Если токен недействителен, apiFetch сам отправит на страницу входа.
        // Если сервер просто недоступен, оставляем сохранённое имя.
        console.error(error);
        if (error.message === "unauthorized") return;
    }

    loadProgress();
});

function setGreeting(name) {
    document.getElementById("welcome-title").textContent = name ? `Привет, ${name}!` : "Привет!";
}

// Прогресс обучения и кнопка «Продолжить»: ведёт на первый урок, тест которого ещё не пройден
async function loadProgress() {
    const sub = document.getElementById("welcome-sub");
    const bar = document.getElementById("welcome-bar");
    const track = bar.parentElement;
    const btn = document.getElementById("continue-btn");

    try {
        const [lessonsRes, resultsRes] = await Promise.all([
            apiFetch("/api/lessons/"),
            apiFetch("/api/results/")
        ]);
        if (!lessonsRes.ok) throw new Error("lessons " + lessonsRes.status);

        const lessons = (await lessonsRes.json()).lessons || [];
        const results = resultsRes.ok ? ((await resultsRes.json()).results || []) : [];

        const doneIds = new Set(results.map(r => r.lesson_id));
        const total = lessons.length;
        const done = lessons.filter(l => doneIds.has(l.id)).length;
        const next = lessons.find(l => !doneIds.has(l.id));

        const percent = total ? Math.round((done / total) * 100) : 0;
        bar.style.width = percent + "%";
        track.setAttribute("aria-valuenow", String(percent));

        if (!total) {
            sub.textContent = "Уроков пока нет. Загляните позже.";
            btn.style.display = "none";
        } else if (!next) {
            sub.textContent = `Вы прошли все уроки (${done} из ${total}). Отличная работа!`;
            btn.textContent = "Повторить уроки";
            btn.href = "lessons.html";
        } else if (done === 0) {
            sub.textContent = `Пройдено тестов: 0 из ${total}. Начните с первого урока.`;
            btn.textContent = "Начать обучение";
            btn.href = `lesson.html?id=${encodeURIComponent(next.id)}`;
        } else {
            sub.textContent = `Пройдено тестов: ${done} из ${total}. Следующий урок: ${next.title}`;
            btn.textContent = "Продолжить обучение";
            btn.href = `lesson.html?id=${encodeURIComponent(next.id)}`;
        }
    } catch (error) {
        console.error(error);
        if (error.message === "unauthorized") return;
        sub.textContent = "Не удалось загрузить прогресс. Попробуйте обновить страницу.";
    }
}
