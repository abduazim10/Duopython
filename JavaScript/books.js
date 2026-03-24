const token = localStorage.getItem("access");
const container = document.getElementById("booksContainer");

fetch("http://127.0.0.1:8000/api/books/", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => {
    renderBooks(data.books);
})
.catch(err => {
    console.error(err);
    container.innerHTML = "<p>Ошибка загрузки книг</p>";
});

function renderBooks(books) {
    container.innerHTML = "";
  books.forEach(book => {
        const link = document.createElement("a");
        link.href = `book.html?id=${book.id}`;
        
        link.style.textDecoration = "none";

        const card = document.createElement("div");
        card.classList.add("pcmain-a");

        card.innerHTML = `
            <div class="pcmaina_divs">
                <p class="pcmaina-p1" style="font-size: 13px;">
                    ${book.title}
                </p>
                <p class="pcmaina-p2" style="font-size: 11px;">
                    ${book.author || "Неизвестный автор"}
                </p>
            </div>

            <div class="pcmaina-imgdiv">
                <img 
                    src="${book.cover_image || './images/Pythonbook.png'}"
                    class="pcmaina-img3"
                    alt="Обложка">
            </div>
        `;

        // 👇 вот главное
        link.appendChild(card);
        container.appendChild(link);
    });
}
// fetch("http://127.0.0.1:8000/api/books/", {
//     headers: {
//         "Authorization": `Bearer ${token}`
//     }
// })
// .then(res => {
//     if (!res.ok) {
//         throw new Error("Ошибка авторизации или сервера");
//     }
//     return res.json();
// })
// .then(data => {
//     if (!data.books) {
//         console.error("Нет books:", data);
//         return;
//     }

//     renderBooks(data.books);
// })
// .catch(err => {
//     console.error(err);
//     container.innerHTML = "<p>Ошибка загрузки</p>";
// });