if (requireAuth()) {
    const container = document.getElementById("booksContainer");

    apiFetch("/api/books/")
        .then(res => res.ok ? res.json() : Promise.reject(new Error("books " + res.status)))
        .then(data => renderBooks(data.books || []))
        .catch(err => {
            console.error(err);
            if (err.message !== "unauthorized") container.textContent = "Ошибка загрузки книг";
        });

    function renderBooks(books) {
        container.innerHTML = "";
        if (!books.length) {
            container.textContent = "Книг пока нет";
            return;
        }
        books.forEach(book => {
            const link = document.createElement("a");
            link.href = `book.html?id=${encodeURIComponent(book.id)}`;
            link.style.textDecoration = "none";

            const card = document.createElement("div");
            card.classList.add("pcmain-a");

            const texts = document.createElement("div");
            texts.className = "pcmaina_divs";
            const title = document.createElement("p");
            title.className = "pcmaina-p1";
            title.style.fontSize = "13px";
            title.textContent = book.title;
            const author = document.createElement("p");
            author.className = "pcmaina-p2";
            author.style.fontSize = "11px";
            author.textContent = book.author || "Неизвестный автор";
            texts.append(title, author);

            const imgBox = document.createElement("div");
            imgBox.className = "pcmaina-imgdiv";
            const img = document.createElement("img");
            img.className = "pcmaina-img3";
            img.alt = "Обложка";
            img.src = safeUrl(book.cover_image) || "./images/Pythonbook.png";
            imgBox.appendChild(img);

            card.append(texts, imgBox);
            link.appendChild(card);
            container.appendChild(link);
        });
    }
}
