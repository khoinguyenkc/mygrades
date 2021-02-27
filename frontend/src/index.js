const BASE_URL = "http://localhost:3000";
const COURSES_URL = `${BASE_URL}/courses`;

let elements = {
    coursePanel: function() {return document.getElementById('courses-panel') },
    mainPanel: function() { return document.getElementById('main-panel') }
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
    renderEditButton(json.id)

    json.categories.forEach( function(category) { 

        const catElement = document.createElement('div');
        catElement.className = "category-section";
        catElement.setAttribute("data-category-id", category.id);
        catElement.innerHTML = `${category.name}`
        elements.mainPanel().appendChild(catElement)

           
        category.assignments.forEach( function(assignment) { displayAssignment(assignment, catElement) }
        )
    })




}

function renderEditButton(courseID) {
    const editButton = document.createElement('a');
    editButton.className = "edit-button";
    editButton.setAttribute("data-course-id", courseID)
    editButton.innerText = `Edit Scores`
    elements.mainPanel().appendChild(editButton)
    editButton.addEventListener("click", function(event) { editScores(event.target.getAttribute("data-course-id"))})

}

function editScores(courseID) {
    // console.log(courseID)
    //turn elements into input fields
    let names = document.querySelectorAll("div.category-section .name")
    let scores = document.querySelectorAll("div.category-section .score")
    let outofs = document.querySelectorAll("div.category-section .out-of")
    function replaceWithInputField(elem) {
        let oldText = elem.innerText
        elem.innerHTML = `<input type="text" value="${oldText}" >`
    }
    names.forEach( function(elem) { replaceWithInputField(elem) })

    scores.forEach( function(elem) { replaceWithInputField(elem) })
    outofs.forEach( function(elem) { replaceWithInputField(elem) })

    //toggle off edit button,
    let editButton = document.getElementsByClassName("edit-button")[0]
    editButton.classList.add('hidden')
    // add finish edit button
    renderSubmitEditButton(courseID)
}

function renderSubmitEditButton(courseID) {
    const finishEditButton = document.createElement('a');
    finishEditButton.className = "submit-edit-button";
    finishEditButton.setAttribute("data-course-id", courseID)
    finishEditButton.innerText = `Save Changes`
    elements.mainPanel().appendChild(finishEditButton)
    finishEditButton.addEventListener("click", function(event) { console.log("triggered event listner to submit changes")})

}
function displayAssignment(assignment, catElement) {
    const divElem = document.createElement('div');
    divElem.setAttribute("data-assignment-id", assignment.id)
    divElem.innerHTML = `
    <div class="name">${assignment.name}</div>
    <div class="score">${assignment.score}</div>
    <div class="out-of">${assignment.out_of}</div>

    `
    //we need to tag them so we can respond to clicks and find out exactly what was clicked...
    catElement.appendChild(divElem)
}

