document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:8000/api/me/", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error();

        const user = await res.json();

        document.querySelector(".pchead-p").textContent = user.username;
        
    } catch (error) {
        console.error(error);
        localStorage.removeItem("access");
        window.location.href = "/login.html";
    }
});