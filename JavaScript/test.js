const token = localStorage.getItem("access");
const params = new URLSearchParams(window.location.search);
const lessonId = params.get("id");

const container = document.getElementById("questions-container");

// загрузка теста
fetch(`http://127.0.0.1:8000/api/tests/${lessonId}/`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => {
    renderTest(data);
});

function renderTest(data) {
    container.innerHTML = "";

    data.questions.forEach((q, index) => {
        const div = document.createElement("div");
        div.classList.add("question");

        let answersHTML = "";

        q.answers.forEach(a => {
            answersHTML += `
                <label>
                    <input type="radio" name="q${q.id}" value="${a.id}">
                    ${a.text}
                </label><br>    
            `;
        });

        div.innerHTML = `
            <h3>${index + 1}. ${q.text}</h3>
            ${answersHTML}
        `;

        container.appendChild(div);
    });
}

// отправка теста
document.getElementById("submit-btn").addEventListener("click", () => {
    const answers = [];

    document.querySelectorAll(".question").forEach(q => {
        const selected = q.querySelector("input:checked");
        if (selected) {
            answers.push({
                question_id: selected.name.replace("q", ""),
                answer_id: selected.value
            });
        }
    });

    fetch("http://127.0.0.1:8000/api/tests/submit/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            lesson_id: lessonId,
            answers: answers
        })
    })
    .then(res => res.json())
    .then(data => {
        // alert(`Результат: ${data.score}/${data.total}`);
        window.location.href = "./lessons.html";
    });
});