const token = localStorage.getItem("access");
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const title = document.getElementById("book-title");
const author = document.getElementById("book-author");
const image = document.getElementById("book-image");
const description = document.getElementById("book-description");
const downloadBtn = document.getElementById("download-btn");

fetch(`http://127.0.0.1:8000/api/books/${bookId}/`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => {
    if (data.error) {
        alert("Книга не найдена");
        return;
    }
    console.log(data);
    title.textContent = data.title;
    author.textContent = "Автор: " + (data.author || "Неизвестен");
    description.textContent = data.description || "";

    if (data.cover_image) {
        image.src = data.cover_image;
    }

    // 👇 делаем кнопку скачивания
    if (data.pdf_file) {
        downloadBtn.href = data.pdf_file;
        downloadBtn.setAttribute("download", ""); // заставляет скачивать
    } else {
        downloadBtn.style.display = "none";
    }
})
.catch(err => {
    console.error(err);
    alert("Ошибка загрузки книги");
});