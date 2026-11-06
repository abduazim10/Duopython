// Страница одного урока (lesson.html)
document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;

    const lessonId = new URLSearchParams(window.location.search).get("id");
    if (!lessonId) {
        window.location.href = "lessons.html";
        return;
    }

    const theoryEl = document.getElementById("lesson-theory");

    try {
        const res = await apiFetch(`/api/lessons/${encodeURIComponent(lessonId)}/`);
        if (!res.ok) throw new Error("Урок не найден");
        const lesson = await res.json();

        const label = lesson.number + "-Урок";
        document.getElementById("lesson-number").textContent = label;
        document.getElementById("lesson-title").textContent = lesson.title;
        document.getElementById("title").textContent = label;
        theoryEl.innerHTML = safeHtml(lesson.theory);
        document.getElementById("startbtn").onclick = () => {
            window.location.href = `test.html?id=${lesson.id}`;
        };

        renderVideo(document.getElementById("lesson-video"), lesson.video_url);
    } catch (error) {
        console.error(error);
        if (error.message !== "unauthorized") {
            theoryEl.textContent = "Не удалось загрузить урок.";
        }
    }
});

// Достаём id ролика из ссылки YouTube: watch?v=, youtu.be/, embed/
function youtubeId(url) {
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, "");
        let id = "";
        if (host === "youtu.be") id = u.pathname.slice(1);
        else if (host.endsWith("youtube.com")) {
            id = u.searchParams.get("v") || (u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/) || [])[1] || "";
        }
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
    } catch (e) {
        return "";
    }
}

function renderVideo(box, url) {
    box.innerHTML = "";
    if (!url) {
        box.textContent = "Видео отсутствует";
        return;
    }
    const id = youtubeId(url);
    if (!id) {
        box.textContent = "Невозможно воспроизвести видео";
        return;
    }
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.maxWidth = "600px";
    iframe.style.aspectRatio = "16 / 9";
    iframe.style.borderRadius = "15px";
    iframe.src = `https://www.youtube.com/embed/${id}`;
    iframe.title = "Видео урока";
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    box.appendChild(iframe);
}
