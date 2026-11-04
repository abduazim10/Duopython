if (requireAuth()) {
    const lessonId = new URLSearchParams(window.location.search).get("id");
    const container = document.getElementById("questions-container");
    const submitBtn = document.getElementById("submit-btn");

    if (!lessonId) {
        window.location.href = "lessons.html";
    }

    // загрузка теста
    apiFetch(`/api/tests/${encodeURIComponent(lessonId)}/`)
        .then(res => res.ok ? res.json() : Promise.reject(new Error("Тест не найден")))
        .then(renderTest)
        .catch(err => {
            console.error(err);
            if (err.message !== "unauthorized") {
                container.textContent = "Не удалось загрузить тест.";
                submitBtn.style.display = "none";
            }
        });

    function renderTest(data) {
        container.innerHTML = "";
        document.getElementById("test-title").textContent = "Тест: " + data.lesson;

        data.questions.forEach((q, index) => {
            const div = document.createElement("div");
            div.classList.add("question");
            div.dataset.questionId = q.id;

            const h3 = document.createElement("h3");
            h3.textContent = `${index + 1}. ${q.text}`;
            div.appendChild(h3);

            q.answers.forEach(a => {
                const label = document.createElement("label");
                const input = document.createElement("input");
                input.type = "radio";
                input.name = "q" + q.id;
                input.value = a.id;
                label.appendChild(input);
                label.appendChild(document.createTextNode(" " + a.text));
                div.appendChild(label);
                div.appendChild(document.createElement("br"));
            });

            container.appendChild(div);
        });

        if (!data.questions.length) {
            container.textContent = "В этом тесте пока нет вопросов.";
            submitBtn.style.display = "none";
        }
    }

    // отправка теста
    submitBtn.addEventListener("click", async () => {
        const answers = [];
        document.querySelectorAll(".question").forEach(q => {
            const selected = q.querySelector("input:checked");
            if (selected) {
                answers.push({
                    question_id: Number(q.dataset.questionId),
                    answer_id: Number(selected.value)
                });
            }
        });

        if (!answers.length) {
            showResult("Выберите ответы перед завершением теста.", false);
            return;
        }

        submitBtn.disabled = true;
        try {
            const res = await apiFetch("/api/tests/submit/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lesson_id: Number(lessonId), answers: answers })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Ошибка отправки");

            showResult(`Результат: ${data.score} из ${data.total}. Лучший результат: ${data.best_score}.`, true);
        } catch (err) {
            console.error(err);
            if (err.message !== "unauthorized") {
                showResult("Не удалось отправить тест. Попробуйте ещё раз.", false);
                submitBtn.disabled = false;
            }
        }
    });

    function showResult(text, done) {
        let box = document.getElementById("test-result");
        if (!box) {
            box = document.createElement("div");
            box.id = "test-result";
            box.style.cssText = "margin-top:15px;font-weight:700;";
            submitBtn.insertAdjacentElement("afterend", box);
        }
        box.textContent = text;
        if (done) {
            submitBtn.style.display = "none";
            const link = document.createElement("a");
            link.href = "lessons.html";
            link.textContent = " К урокам";
            link.className = "menu_a1";
            link.style.color = "black";
            box.appendChild(document.createElement("br"));
            box.appendChild(link);
        }
    }
}
