if (requireAuth()) {
    const container = document.getElementById("musicsContainer");

    apiFetch("/api/musics/")
        .then(res => res.ok ? res.json() : Promise.reject(new Error("musics " + res.status)))
        .then(data => {
            if (!Array.isArray(data)) throw new Error("Неверный формат ответа");
            render(data);
        })
        .catch(err => {
            console.error(err);
            if (err.message !== "unauthorized") container.textContent = "Ошибка загрузки";
        });

    function render(items) {
        container.innerHTML = "";
        if (!items.length) {
            container.textContent = "Пока ничего нет";
            return;
        }
        items.forEach(item => {
            const link = document.createElement("a");
            link.href = safeUrl(item.audio_file) || "#";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.style.textDecoration = "none";

            const card = document.createElement("div");
            card.classList.add("pcmain-a");

            const texts = document.createElement("div");
            texts.className = "pcmaina_divs";
            const title = document.createElement("p");
            title.className = "pcmaina-p1";
            title.style.fontSize = "16px";
            title.textContent = item.title;
            texts.appendChild(title);

            const imgBox = document.createElement("div");
            imgBox.className = "pcmaina-imgdiv";
            const img = document.createElement("img");
            img.className = "pcmaina-img3";
            img.alt = "Обложка";
            img.style.borderRadius = "5px";
            img.src = safeUrl(item.cover_image) || "./images/music.png";
            imgBox.appendChild(img);

            card.append(texts, imgBox);
            link.appendChild(card);
            container.appendChild(link);
        });
    }
}
