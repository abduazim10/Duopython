// Страница со списком уроков (lessons.html)
document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;

    const slider = document.getElementById("lessonSlider");
    document.getElementById("pchead-p").textContent = localStorage.getItem("username") || "";

    try {
        const [lessonsRes, resultsRes] = await Promise.all([
            apiFetch("/api/lessons/"),
            apiFetch("/api/results/")
        ]);
        if (!lessonsRes.ok) throw new Error("lessons " + lessonsRes.status);

        const lessonsData = await lessonsRes.json();
        const resultsData = resultsRes.ok ? await resultsRes.json() : { results: [] };

        // lesson_id → процент правильных ответов
        const resultsMap = {};
        (resultsData.results || []).forEach(r => {
            resultsMap[r.lesson_id] = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
        });

        slider.innerHTML = "";

        if (!lessonsData.lessons.length) {
            slider.textContent = "Уроков пока нет";
        }

        lessonsData.lessons.forEach(lesson => {
            const lessonDiv = document.createElement("div");
            lessonDiv.classList.add("lesson-div");

            const divPs = document.createElement("div");
            divPs.classList.add("lesson-div-ps");

            const numberP = document.createElement("p");
            numberP.textContent = lesson.number;

            const titleP = document.createElement("p");
            titleP.textContent = lesson.title;

            divPs.appendChild(numberP);
            divPs.appendChild(titleP);

            const button = document.createElement("button");
            button.classList.add("lesson-btn");
            button.textContent = (lesson.id in resultsMap) ? resultsMap[lesson.id] + "%" : "Начать";
            button.addEventListener("click", () => {
                window.location.href = `lesson.html?id=${lesson.id}`;
            });

            lessonDiv.appendChild(divPs);
            lessonDiv.appendChild(button);
            slider.appendChild(lessonDiv);
        });

        // Уроки добавлены после загрузки страницы: пересчитываем кнопки слайдера
        if (window.resetSlider) window.resetSlider();
    } catch (error) {
        console.error(error);
        if (error.message !== "unauthorized") {
            slider.textContent = "Не удалось загрузить уроки. Попробуйте обновить страницу.";
        }
    }
});
