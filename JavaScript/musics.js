const token = localStorage.getItem("access");
const container = document.getElementById("musicsContainer");

fetch("http://127.0.0.1:8000/api/musics/", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => {
    if (!Array.isArray(data)) {
        console.error("Не массив:", data);
        return;
    }

    renderMusics(data);
})
.catch(err => {
    console.error(err);
    container.innerHTML = "<p>Ошибка загрузки</p>";
});

function renderMusics(musics) {
    container.innerHTML = "";

    musics.forEach(music => {
        const link = document.createElement("a");
        link.href = music.audio_file; // 👈 ссылка на аудио
        link.target = "_blank"; // открывается в новой вкладке
        link.style.textDecoration = "none";

        const card = document.createElement("div");
        card.classList.add("pcmain-a");

        card.innerHTML = `
            <div class="pcmaina_divs">
                <p class="pcmaina-p1" style="font-size: 16px;">
                    ${music.title}
                </p>
            </div>

            <div class="pcmaina-imgdiv">
                <img 
                    src="${music.cover_image || './images/music.png'}"
                    class="pcmaina-img3"
                    alt="Обложка">
            </div>
        `;

        link.appendChild(card);
        container.appendChild(link);
    });
}