
function renderCourseTitle(courseObject) {
    const courseTitle = courseObject.name;
    const courseTitleElem = elements.courseTitleElem()
    courseTitleElem.classList.remove("hidden")
    courseTitleElem.innerHTML = `<h1 class="header">${courseTitle}</h1>`

}