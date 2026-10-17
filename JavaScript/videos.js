const token = localStorage.getItem("access");
const container = document.getElementById("videosContainer");

fetch("http://127.0.0.1:8000/api/videos/", {
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

    renderVideos(data);
})
.catch(err => {
    console.error(err);
    container.innerHTML = "<p>Ошибка загрузки</p>";
});

function renderVideos(videos) {
    container.innerHTML = "";

    videos.forEach(video => {
        const link = document.createElement("a");
        link.href = video.video_url; // 👈 ссылка на видео
        link.target = "_blank";
        link.style.textDecoration = "none";

        const card = document.createElement("div");
        card.classList.add("pcmain-a");

        card.innerHTML = `
            <div class="pcmaina_divs">
                <p class="pcmaina-p1" style="font-size: 13px;">
                    ${video.title}
                </p>
            </div>

            <div class="pcmaina-imgdiv">
                <img 
                    src="${video.thumbnail || './images/video.png'}"
                    class="pcmaina-img3"
                    alt="Превью" style="border-radius: 5px;">
            </div>
        `;

        link.appendChild(card);
        container.appendChild(link);
    });
}