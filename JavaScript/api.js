// Общие функции для всех страниц сайта: работа с API, токенами и безопасный вывод.
(function () {
    const API = String(window.API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
    window.API_BASE = API;

    function store(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }

    function clearSession() {
        ["access", "refresh", "username"].forEach(function (k) {
            try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
        });
    }

    function goLogin() {
        clearSession();
        window.location.href = "login.html";
    }

    // Страницы личного кабинета доступны только после входа
    function requireAuth() {
        if (!store("access")) {
            goLogin();
            return false;
        }
        return true;
    }

    // Обновление access-токена по refresh-токену (один запрос, даже если страница делает несколько)
    let refreshing = null;
    function refreshAccess() {
        const refresh = store("refresh");
        if (!refresh) return Promise.resolve(false);
        if (!refreshing) {
            refreshing = fetch(API + "/api/token/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refresh })
            })
                .then(function (res) {
                    if (!res.ok) return false;
                    return res.json().then(function (d) {
                        localStorage.setItem("access", d.access);
                        if (d.refresh) localStorage.setItem("refresh", d.refresh);
                        return true;
                    });
                })
                .catch(function () { return false; })
                .then(function (ok) { refreshing = null; return ok; });
        }
        return refreshing;
    }

    // fetch к API с токеном. Если токен истёк, обновляет его сам; если не вышло, отправляет на страницу входа.
    async function apiFetch(path, options) {
        options = options || {};
        function send() {
            const headers = Object.assign({}, options.headers || {}, {
                Authorization: "Bearer " + store("access")
            });
            return fetch(API + path, Object.assign({}, options, { headers: headers }));
        }
        let res = await send();
        if (res.status === 401) {
            if (await refreshAccess()) res = await send();
            if (res.status === 401) {
                goLogin();
                throw new Error("unauthorized");
            }
        }
        return res;
    }

    // Сообщение об ошибке под формой (вместо alert)
    function showFormMessage(form, text) {
        let p = form.parentNode.querySelector(".form-message");
        if (!p) {
            p = document.createElement("p");
            p.className = "form-message";
            p.setAttribute("role", "alert");
            p.style.cssText = "color:#c0392b;text-align:center;margin-top:12px;font-weight:700;";
            form.insertAdjacentElement("afterend", p);
        }
        p.textContent = text || "";
    }

    // Разрешаем только обычные ссылки http и https (защита от javascript: и т.п.)
    function safeUrl(url) {
        try {
            const u = new URL(url, window.location.href);
            return (u.protocol === "http:" || u.protocol === "https:") ? u.href : "";
        } catch (e) {
            return "";
        }
    }

    // Очистка HTML урока: убираем скрипты, iframe, обработчики событий и опасные ссылки.
    // Для боевого сервера лучше дополнительно чистить HTML на стороне API.
    function safeHtml(html) {
        const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
        doc.querySelectorAll("script, style, iframe, object, embed, link, meta, base, form").forEach(function (el) {
            el.remove();
        });
        doc.body.querySelectorAll("*").forEach(function (el) {
            Array.from(el.attributes).forEach(function (attr) {
                const name = attr.name.toLowerCase();
                const value = attr.value.trim().toLowerCase();
                if (name.indexOf("on") === 0 ||
                    ((name === "href" || name === "src" || name === "xlink:href" || name === "action") &&
                        /^(javascript|data|vbscript):/.test(value.replace(/\s+/g, "")))) {
                    el.removeAttribute(attr.name);
                }
            });
        });
        return doc.body.innerHTML;
    }

    // Кнопка «Выйти»: при переходе очищаем токены
    document.addEventListener("click", function (e) {
        if (e.target.closest && e.target.closest("[data-logout]")) clearSession();
    });

    window.clearSession = clearSession;
    window.goLogin = goLogin;
    window.requireAuth = requireAuth;
    window.apiFetch = apiFetch;
    window.showFormMessage = showFormMessage;
    window.safeUrl = safeUrl;
    window.safeHtml = safeHtml;
})();
