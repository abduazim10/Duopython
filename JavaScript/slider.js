// Слайдер уроков: листает «страницами» по числу карточек, которые помещаются на экране
let currentSlide = 0;

const slider = document.getElementById("lessonSlider");
const leftbtn = document.getElementById("leftBtn");
const rightbtn = document.getElementById("rightBtn");

// Сколько карточек помещается в ширину блока (на широком экране 3, на узком меньше)
function getVisible() {
    const step = getLessonWidth();
    if (!step) return 3;
    const gap = parseInt(window.getComputedStyle(slider).gap) || 0;
    return Math.max(1, Math.floor((slider.parentElement.clientWidth + gap) / step));
}

function getLessonWidth() {
    const lesson = slider.children[0];
    if (!lesson) return 0;
    const gap = parseInt(window.getComputedStyle(slider).gap) || 0;
    return lesson.offsetWidth + gap;
}

function getMaxSlide() {
    return Math.max(0, Math.ceil(slider.children.length / getVisible()) - 1);
}

function updateSliderButtons() {
    const total = slider.children.length;

    if (total <= getVisible()) {
        leftbtn.style.display = "none";
        rightbtn.style.display = "none";
        slider.style.justifyContent = "center";
        return;
    }

    // уроков больше трёх: кнопки должны быть видны (раньше они навсегда оставались скрытыми)
    leftbtn.style.display = "";
    rightbtn.style.display = "";
    slider.style.justifyContent = "";
    leftbtn.style.opacity = currentSlide === 0 ? "0.5" : "1";
    rightbtn.style.opacity = currentSlide === getMaxSlide() ? "0.5" : "1";
}

function slideLessons(direction) {
    currentSlide = Math.min(Math.max(currentSlide + direction, 0), getMaxSlide());
    slider.style.transform = `translateX(-${currentSlide * getLessonWidth() * getVisible()}px)`;
    updateSliderButtons();
}

// Вызывается после того, как уроки загружены с сервера
function resetSlider() {
    currentSlide = 0;
    slider.style.transform = "";
    updateSliderButtons();
}
window.resetSlider = resetSlider;

updateSliderButtons();
window.addEventListener("resize", resetSlider);
