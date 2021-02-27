const BASE_URL = "http://localhost:3000";
const COURSES_URL = `${BASE_URL}/courses`;

let elements = {
    coursePanel: function() {return document.getElementById('courses-panel') }
};

// ----------------------------------
// --------UPON LOADING STUFF------- 
// ----------------------------------

function fetchAndDisplayCourseTitles() {
    fetch(COURSES_URL).
    then( function(response) { return response.json() }).
    then( function(json) { displayCourseTitles(json) })
}

fetchAndDisplayCourseTitles()

function displayCourseTitles(array) {
    console.log(array)
    // let coursePanel = document.getElementById('courses-panel')
    console.log("hica nha")
    console.log(elements.coursePanel())
    array.forEach( function(course) { 
        const courseElement = document.createElement('div');
        courseElement.innerHTML =
         `<a class="course-link" href="#" data-course-id="${course.id}">${course.name}</a>`
        // courseElement.className = "course-link";
        // courseElement.setAttribute("data-id", course.id);
        // courseElement.setAttribute("href", `#`); //for link hover effect
        // courseElement.innerHTML = course.name;
        elements.coursePanel().appendChild(courseElement);

        courseElement.addEventListener("click", function(event) { 
            fetchAndDisplayCourseContent(event.target.getAttribute("data-course-id"))
        } );

    })

}


function fetchAndDisplayCourseContent(courseID) {
    //courseID will be a String!
    fetch(`${COURSES_URL}/${courseID}`).
    then( function(response) { return response.json() }).
    then( function(json) { displayCourseContent(json) })

}

function displayCourseContent(json) {
    console.log(json)
}
