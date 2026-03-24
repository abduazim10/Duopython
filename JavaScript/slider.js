// Slider для уроков
let currentSlide = 0

const slider = document.getElementById("lessonSlider")
const leftbtn = document.getElementById("leftBtn")
const rightbtn = document.getElementById("rightBtn")

const visibleLessons = 3


function getLessonWidth(){

    const lesson = slider.children[0]
    const lessonWidth = lesson.offsetWidth

    const sliderStyles = window.getComputedStyle(slider)
    const gap = parseInt(sliderStyles.gap)

    return lessonWidth + gap
}


function updateSliderButtons(){

    const totalLessons = slider.children.length
    const maxSlide = Math.ceil(totalLessons / visibleLessons) - 1

    if(totalLessons <= visibleLessons){
        leftbtn.style.display = "none"
        rightbtn.style.display = "none"
        slider.style.justifyContent = "center"
        return
    }

    leftbtn.style.opacity = currentSlide === 0 ? "0.5" : "1"
    rightbtn.style.opacity = currentSlide === maxSlide ? "0.5" : "1"
}


function slideLessons(direction){

    const lessonWidth = getLessonWidth()

    const totalLessons = slider.children.length
    const maxSlide = Math.ceil(totalLessons / visibleLessons) - 1

    currentSlide += direction

    if(currentSlide < 0){
        currentSlide = 0
    }

    if(currentSlide > maxSlide){
        currentSlide = maxSlide
    }

    slider.style.transform =
        `translateX(-${currentSlide * lessonWidth * visibleLessons}px)`

    updateSliderButtons()
}


updateSliderButtons()
// Slider для уроков


