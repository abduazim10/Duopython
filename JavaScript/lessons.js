document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        // 1. получаем уроки
        const lessonsRes = await fetch("http://127.0.0.1:8000/api/lessons/", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const lessonsData = await lessonsRes.json();

        // 2. получаем результаты
        const resultsRes = await fetch("http://127.0.0.1:8000/api/results/", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const resultsData = await resultsRes.json();

        const resultsMap = {};
        // делаем удобную мапу: lesson_id → %
        resultsData.results.forEach(r => {
            const percent = Math.round((r.score / r.total) * 100);
            resultsMap[r.lesson_id] = percent;
        });

        document.getElementById("pchead-p").textContent = localStorage.getItem("username");

        // 3. рендерим уроки
        const slider = document.getElementById("lessonSlider");
        slider.innerHTML = "";

        lessonsData.lessons.forEach(lesson => {
            const percent = resultsMap[lesson.id] ?? 0;

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

            if (percent > 0) {
                button.textContent = percent + "%";
            } else {
                button.textContent = "Начать";
            }

            button.addEventListener("click", () => {
                window.location.href = `lesson.html?id=${lesson.id}`;
            });

            lessonDiv.appendChild(divPs);
            lessonDiv.appendChild(button);

            slider.appendChild(lessonDiv);
        });

    } catch (error) {
        console.error(error);
        // alert("Ошибка загрузки");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get("id");

    if (!lessonId) {
        // alert("Урок не выбран");
        return;
    }

    try {
        const res = await fetch(`http://127.0.0.1:8000/api/lessons/${lessonId}/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Урок не найден");

        const lesson = await res.json();

        document.getElementById("lesson-number").textContent = lesson.number+"-Урок";
        document.getElementById("lesson-title").textContent = lesson.title;
        document.getElementById("lesson-theory").innerHTML = lesson.theory;
        document.getElementById("title").textContent = lesson.number+"-Урок";
        document.getElementById("startbtn").onclick = () => starttest(lesson.id);
        const videoDiv = document.getElementById("lesson-video");
        videoDiv.innerHTML = ""; // очищаем

        if (lesson.video_url) {
            // Преобразуем ссылку YouTube в embed
            // пример: https://www.youtube.com/watch?v=abcd123 → https://www.youtube.com/embed/abcd123
            const videoIdMatch = lesson.video_url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
            if (videoIdMatch && videoIdMatch[1]) {
                const videoId = videoIdMatch[1];
                const iframe = document.createElement("iframe");
                iframe.width = "600";
                iframe.height = "340";
                iframe.style.borderRadius = "15px";
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                console.log("Видео URL:", iframe.src);
                console.log("Видео URL:", videoId);
                iframe.frameBorder = "0";
                iframe.allow =
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                videoDiv.appendChild(iframe);
            } else {
                videoDiv.textContent = "Невозможно воспроизвести видео";
            }
        } else {
            videoDiv.textContent = "Видео отсутствует";
        }
        function starttest(id){
            window.location.href = `test.html?id=${id}`;
        }

    } catch (error) {
        console.error(error);
        // alert("Не удалось загрузить урок");
    }
});
