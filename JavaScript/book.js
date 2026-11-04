if (requireAuth()) {
    const bookId = new URLSearchParams(window.location.search).get("id");
    if (!bookId) window.location.href = "books.html";

    const title = document.getElementById("book-title");
    const author = document.getElementById("book-author");
    const image = document.getElementById("book-image");
    const description = document.getElementById("book-description");
    const downloadBtn = document.getElementById("download-btn");

    apiFetch(`/api/books/${encodeURIComponent(bookId)}/`)
        .then(res => res.ok ? res.json() : Promise.reject(new Error("Книга не найдена")))
        .then(data => {
            title.textContent = data.title;
            author.textContent = "Автор: " + (data.author || "Неизвестен");
            description.textContent = data.description || "";

            image.alt = data.title;
            if (data.cover_image && safeUrl(data.cover_image)) {
                image.src = safeUrl(data.cover_image);
            }

            if (data.pdf_file && safeUrl(data.pdf_file)) {
                downloadBtn.href = safeUrl(data.pdf_file);
                downloadBtn.setAttribute("download", "");
            } else {
                downloadBtn.style.display = "none";
            }
        })
        .catch(err => {
            console.error(err);
            if (err.message !== "unauthorized") {
                title.textContent = "Книга не найдена";
                downloadBtn.style.display = "none";
                image.style.display = "none";
            }
        });
}
