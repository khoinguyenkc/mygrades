const BASE_URL = "http://localhost:3000";
const COURSES_URL = `${BASE_URL}/courses`;
const ASSIGNMENTS_URL = `${BASE_URL}/assignments`;

let currentCourseJSON;


let currentCourseObjects = {
    course: null,
    categories: [],
    assignments: []
}


let states = {
    editModeOn: false
};

//we make these DOM nodes "live"
let elements = {
    coursePanel: function() {return document.getElementById('courses-panel')},
    mainPanel: function() { return document.getElementById('main-panel')},
    assignmentsTable: function() { return document.getElementById('assignments-table')},
    assignmentRows: function() {return document.querySelectorAll(".assignment-row")},
    percentageElem: function() {return document.querySelector("#grade-percentage")},
    courseTitleElem: function() {return document.querySelector("#course-title")},
    newAssignmentButtons: function() {return document.querySelectorAll(".new-assignment-button")},
    submitNewAssignmentsButtons: function() {return document.querySelectorAll(".submit-new-assignments-button")},
    editScoreButton: function() {return document.getElementById('edit-score-button')},
    submitEditButton: function() {return document.getElementById('submit-edit-button')},
    names: function() { return document.querySelectorAll("div.category-section .name")},
    scores: function() { return document.querySelectorAll("div.category-section .score")},
    outOfs: function() { return document.querySelectorAll("div.category-section .out-of")},
    courseMenuBar: function() { return document.getElementById("course-menu-bar");},
    createNewCourseButton: function() { return document.getElementById("create-new-course")},
    newCourseFormDiv: function() { return document.getElementById("create-new-course-form")},
    submitNewCourseButton: function() { return document.getElementById("submit-new-course")}

};

class Course {
    constructor(id, name, categories = []){
        this.id = id;
        this.name = name;
        this.categories = categories;
    }

    

};

Course.prototype.grade_percentage =  function() {    
    //we change the argument to no agument. it wil use the THIS to refer to the course.
    let percentages = []
    let cats = this.categories
    // #loop thru cats, and in there, loop thru assignments, 
    cats.forEach( function(cat) {

        let catScoreSum = 0;
        let catOutOfSum = 0;
        cat.assignments.forEach (function(assignment) {
            catScoreSum += parseFloat(assignment.score)

            catOutOfSum += parseFloat(assignment.outOf)
        })
        let percentage = cat.weight * (catScoreSum / catOutOfSum);

        percentages.push(percentage)
    })

    const rawPerc = percentages.reduce( (acc, val) => acc + val, 0);
    return (rawPerc * 100).toFixed(2)

}


class Category {
    constructor(id, name, weight, course = null, assignments = [],){
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.assignments = assignments;
    }
}

class Assignment {
    constructor(id, name, score, outOf, category = null){
        this.id = id;
        this.name = name;
        this.score = score;
        this.outOf = outOf;
        this.category = category;
    }
}


function updateCourseObjects(json) {
    //we're hoping these things are ferences and not moment-in-time copies!!!!

    //clear assignments and categories
    currentCourseObjects.categories = [];
    currentCourseObjects.assignments = [];
    console.log(json)
    //create course, null category
    let newCourse = new Course(json.id, json.name)
    currentCourseObjects.course = newCourse;
    json.categories.forEach( function(cat) {
        //create category, null assignments
        let newCat = new Category(cat.id, cat.name, cat.weight, newCourse)
        currentCourseObjects.categories.push(newCat);

        //create assignment, asso categories to assignments, asso assignment to category
        cat.assignments.forEach( function(assignment) {
            let newAssign = new Assignment(assignment.id, assignment.name, assignment.score, assignment.out_of, newCat)
            currentCourseObjects.assignments.push(newAssign)
            //IMPORTANT!!! still need toasso categories to assignments, asso assignment to category
            newAssign.category = newCat;
            newCat.assignments.push(newAssign);
        })
        //asso categories to course
        newCourse.categories.push(newCat)
    })

}

// ----------------------------------
// --------UPON LOADING STUFF------- 
// ----------------------------------

function fetchAndDisplayCourseTitles() {
    fetch(COURSES_URL).
    then( function(response) { return response.json() }).
    then( function(json) { displayCourseTitles(json) })
}

function initializeApp() {
    fetchAndDisplayCourseTitles()
    elements.editScoreButton().addEventListener("click", function(event) { editScores(elements.editScoreButton().getAttribute("data-course-id"))})
    // window.onscroll = function() { makeCourseMenuSticky()};
    elements.createNewCourseButton().addEventListener("click", function(event) { showNewCourseForm() })
}
initializeApp()

function hideNewCourseForm() {
        //UNHIDE the new course button
        elements.createNewCourseButton().classList.remove('hidden');
        //remove 

}

function submitNewCourse() {
    console.log('submit new course called')
    //extract info
    //send info
    //hide new course form
    
}
function showNewCourseForm() {
    //HIDE the new course button
    console.log(elements.createNewCourseButton())
    elements.createNewCourseButton().classList.add('hidden');
    //UNHIDE big div and add elements 
    const newCourseFormDiv = elements.newCourseFormDiv()
    newCourseFormDiv.classList.remove("hidden")
    const containerForRows = newCourseFormDiv.querySelector('.forRows');

    //create title input
    let titleInput = document.createElement("div");

    titleInput.innerHTML = `
    <label for="course-name">Course Title</label>
    <input type="text" name="course-name" >`
    //append title input
    containerForRows.appendChild(titleInput)

    function addCategoryRow(container) {
        let newRow = document.createElement("div")
        newRow.className = "new-category-row"
        newRow.innerHTML = `
            <p>
            <label for="category-name">Category Name</label>
            <input type="text" name="category-name" >
            </p>
            <p>
            <label for="weight">Weight (in decimal form)</label>
            <input type="text" name="weight" >
            </p>
        `
        //append newRow... 5 times
        container.appendChild(newRow)
    
    }
    addCategoryRow(containerForRows)
    addCategoryRow(containerForRows)
    addCategoryRow(containerForRows)
    addCategoryRow(containerForRows)
    addCategoryRow(containerForRows)



    //create submit  button
    let submitNewCourseButton = document.createElement("input")
    submitNewCourseButton.setAttribute('id','submit-new-course'); 
    submitNewCourseButton.setAttribute('type','submit'); 
    submitNewCourseButton.setAttribute('value','Add New Course'); 
    submitNewCourseButton.classList = 'ui primary button';

    //append submit button 
    const containerForButtons = newCourseFormDiv.querySelector('.forButtons');
    console.log(containerForButtons)
    containerForButtons.append(submitNewCourseButton)

    //add eventlistener to submit button
    elements.submitNewCourseButton().addEventListener('click', () => { submitNewCourse() })

}

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function makeCourseMenuSticky() {
    var sticky = elements.courseMenuBar().offsetTop;

  if (window.pageYOffset >= sticky) {
    elements.courseMenuBar().classList.add("sticky")
  } else {
    elements.courseMenuBar().classList.remove("sticky");
  }
}



function displayCourseTitles(array) {
    console.log(array)
    // let coursePanel = document.getElementById('courses-panel')
    console.log("hica nha")
    console.log(elements.coursePanel())
    array.forEach( function(course) { 
        // const courseElement = document.createElement('div');
        const courseElement = document.createElement('a');

        // courseElement.innerHTML =
        //  `<a class="course-link huge ui button" href="#" data-course-id="${course.id}">${course.name}</a>`
        courseElement.className = "course-link huge ui button";
        courseElement.setAttribute("data-course-id", course.id);
        courseElement.setAttribute("href", `#`); //for link hover effect
        courseElement.innerHTML = course.name;
        elements.coursePanel().appendChild(courseElement);

        courseElement.addEventListener("click", function(event) { 
            fetchAndDisplayCourseContent(event.target.getAttribute("data-course-id"))
        } );

    })

}


function fetchAndDisplayCourseContent(courseID) {
    console.log(`fetchAndDisplayCourseContent was called`)
    //courseID will be a String!
    fetch(`${COURSES_URL}/${courseID}`).
    then( function(response) { return response.json() }).
    then( function(json) { 
        currentCourseJSON = json;
        updateCourseObjects(json)
        // displayCourseContent(json) 
        //test:
        displayCourseContent(currentCourseObjects.course) 

    })

}
function displayCourseContent(courseObject) {
    console.log(courseObject)
    //this can be called several times. so we have to clear it first:
    elements.assignmentsTable().innerHTML = '';
    //should later change the html structure in index.thml so we dont celar innerHTML like this...
    elements.courseMenuBar().classList.remove('hidden')
    renderCourseTitle(courseObject)
    rendergradePercentage(courseObject)
    renderEditButton(courseObject.id)
    courseObject.categories.forEach( function(category) { createACategorySection(category) } )

    elements.newAssignmentButtons().forEach( function(button) { button.addEventListener("click", addNewAssignment)})
    elements.submitNewAssignmentsButtons().forEach( function(button) { button.addEventListener("click", submitNewAssignments )})
}

function createACategorySection(category) { 
    //goal: create a category section
    const catElement = document.createElement('div');
    catElement.className = "category-section";
    catElement.setAttribute("data-category-id", category.id);
    catElement.innerHTML = `
            <h3 class="category-name header">${category.name.toUpperCase()}</h3>
            <h4 class="category-weight">Weight: ${category.weight * 100}%</h4>
            <div class="new-assignment-button" data-category-id="${category.id}">
                <div class=" ui primary button" >Add New Assignments</div>
            </div>
        <div class="ui middle aligned divided list category-main-content">
        </div>
    `
    elements.assignmentsTable().appendChild(catElement)

    //goal: add assignment rows to the category section
    category.assignments.forEach( function(assignment) { displayAssignment(assignment, catElement) })

    //goal: add a hidden div to deal with user adding new assignments 
    const newAssignmentsDiv = document.createElement('div');
    newAssignmentsDiv.className = "new-assignments-section hidden";
    newAssignmentsDiv.setAttribute("data-category-id", category.id);
    newAssignmentsDiv.innerHTML = `
    <div class="forRows">
    </div>
    <div class="submit-new-assignments-button" data-category-id="${category.id}">
        <button class="ui primary button" >Submit New Assignments</button>
    </div>
    <div class="new-assignment-button" data-category-id="${category.id}">
        <button class="ui button">Add One More Assignment</button>
    </div>

    `
    elements.assignmentsTable().appendChild(newAssignmentsDiv)

    
}


function submitNewAssignments(event) {
    //find the new-assignment-section div with that category id (dont use parent node, as that might change so easily)
    const catID = event.target.parentNode.getAttribute('data-category-id');
    const newAssDiv = document.querySelector(`.new-assignments-section[data-category-id="${catID}"]`)
    
    //collect all new-assignment-rows
    const rows = newAssDiv.querySelectorAll('.new-assignment-row')
    //process each row: extract all relevant info and send!
    rows.forEach( function(row, index, array) {
        const name = row.querySelector('input[name="name"]').value
        const score = row.querySelector('input[name="score"]').value
        const outOf = row.querySelector('input[name="out-of"]').value
    // make fetch requeset
        const rerender = ( index === array.length - 1) ? true : false;
        fetchCreateAssignment(catID,name,score,outOf, rerender)

    })
}

function fetchCreateAssignment(catID,name,score,outOf, rerender = false) {
    let data = {
        category_id: catID,
        name,
        score,
        out_of: outOf
    };

    let configurationObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch(`${ASSIGNMENTS_URL}`, configurationObject).
    then( function(resource) { return resource.json() }).
    then( function(json) { 
        if (rerender === true) { 
            fetchAndDisplayCourseContent(currentCourseObjects.course.id) }
 })

}

function hideAddNewAssignmentButton(categoryID) {
    console.log(categoryID)
    const NewAssignmentButton = document.querySelector(`.category-section[data-category-id="${categoryID}"]
    `).querySelector('.new-assignment-button')
    console.log(NewAssignmentButton)
    NewAssignmentButton.classList.add("hidden")

    // new-assignment-button
}

function addNewAssignment(event) {
    console.log(event.target.parentNode)

    //un-hide new-assignments-section with the id
    const catID = event.target.parentNode.getAttribute('data-category-id');
    hideAddNewAssignmentButton(catID)
    const newAssDiv = document.querySelector(`.new-assignments-section[data-category-id="${catID}"]`)
    newAssDiv.classList.remove("hidden")
    const containerForRows = newAssDiv.querySelector('.forRows');

    //add inputs into containerForRows
    let newRow = document.createElement("div")
    newRow.className = "new-assignment-row"
    newRow.setAttribute("data-category-id", catID)
    newRow.innerHTML = `
        <input type="text" name="name" value="Assignment Name" data-category-id="${catID}">
        <input type="text" name="score" value="Score" data-category-id="${catID}">
        <input type="text" name="out-of" value="Out Of"data-category-id="${catID}">
    `
    //append newRow...
    containerForRows.appendChild(newRow)

}
//OLD COPY KEEP as BACKUP
// function displayCourseContent(json) {
//     console.log(json)
//     //this can be called several times. so we have to clear it first:
//     elements.mainPanel().innerHTML = '';
    
//     rendergradePercentage(json)
//     renderEditButton(json.id)
//         json.categories.forEach( function(category) { 

//         const catElement = document.createElement('div');
//         catElement.className = "category-section";
//         catElement.setAttribute("data-category-id", category.id);
//         catElement.innerHTML = `${category.name}`
//         elements.mainPanel().appendChild(catElement)

           
//         category.assignments.forEach( function(assignment) { displayAssignment(assignment, catElement) }
//         )
//     })
// }

function renderEditButton(courseID) {
    //for when u load the course, not to unhide after a hide... for that, use unhideEditButton
    // console.log(document.getElementById('edit-score-button'))
    const editScoreButton = elements.editScoreButton();
    editScoreButton.classList.remove('hidden')
    editScoreButton.setAttribute("data-course-id", courseID)


    // editScoreButton.addEventListener("click", function(event) { editScores(event.target.getAttribute("data-course-id"))})

    // const editButton = document.createElement('a');
    // editButton.className = "edit-button";
    // editButton.setAttribute("data-course-id", courseID)
    // editButton.innerText = `Edit Scores`
    // elements.mainPanel().appendChild(editButton)
    // editButton.addEventListener("click", function(event) { editScores(event.target.getAttribute("data-course-id"))})

}

function unhideEditButton() {
    const editScoreButton = elements.editScoreButton();
    editScoreButton.classList.remove('hidden')

}


function renderCourseTitle(courseObject) {
    const courseTitle = courseObject.name;
    const courseTitleElem = elements.courseTitleElem()
    courseTitleElem.classList.remove("hidden")
    courseTitleElem.innerHTML = `<h1 class="header">${courseTitle}</h1>`

}

function rendergradePercentage(courseObject) {
    //goal: we want to make this able to display the first time AND to update
    const percentage = courseObject.grade_percentage()
    const percentageElem = elements.percentageElem()
    percentageElem.classList.remove("hidden")
    percentageElem.innerHTML= `<h3 class="header" >Overall Class Percentage: </h3>
    <h1 class="header">${percentage}%</h1>`

}
function gradePercentage(courseObject) {    
    let percentages = []
    let cats = courseObject.categories
    // #loop thru cats, and in there, loop thru assignments, 
    cats.forEach( function(cat) {

        let catScoreSum = 0;
        let catOutOfSum = 0;
        cat.assignments.forEach (function(assignment) {
            catScoreSum += parseFloat(assignment.score)

            catOutOfSum += parseFloat(assignment.outOf)
        })
        let percentage = cat.weight * (catScoreSum / catOutOfSum);

        percentages.push(percentage)
    })

    return percentages.reduce( (acc, val) => acc + val, 0);

}

//OLD COPY KEEP AS BACKUP
// function gradePercentage(json) {    
//     let percentages = []
//     let cats = json.categories
//     // #loop thru cats, and in there, loop thru assignments, 
//     cats.forEach( function(cat) {

//         let cat_score_sum = 0;
//         let cat_out_of_sum = 0;
//         cat.assignments.forEach (function(assignment) {
//             cat_score_sum += parseFloat(assignment.score)

//             cat_out_of_sum += parseFloat(assignment.out_of)
//         })
//         let percentage = cat.weight * (cat_score_sum / cat_out_of_sum);

//         percentages.push(percentage)
//     })

//     return percentages.reduce( (acc, val) => acc + val, 0);

// }

function editScores(courseID) {
    console.log(`edit scores function was called`)
    states.editModeOn = true;
    //toggle off edit button,
    let editButton = document.getElementById("edit-score-button")
    editButton.classList.add('hidden')
    // add finish edit button
    renderSubmitEditButton(courseID)

        
    //turn elements into input fields
    let names = elements.names();
    let scores = elements.scores();
    let outOfs = elements.outOfs();
    function replaceWithInputField(elem) {
        let oldText = elem.innerText;
        elem.innerHTML = `<input type="text" value="${oldText}" >`

    }
    elements.names().forEach( function(elem) { replaceWithInputField(elem) })
    elements.scores().forEach( function(elem) { replaceWithInputField(elem) })
    elements.outOfs().forEach( function(elem) { replaceWithInputField(elem) })

    //add event listeners for all these input fields to 
    //it will auto pass the EVENT as argument into the callback

    // elements.names().forEach( function(node) { node.addEventListener("input", locallyUpdateAssignment)} )
    // elements.scores().forEach( function(node) { node.addEventListener("input", locallyUpdateAssignment)} )
    // elements.outOfs().forEach( function(node) { node.addEventListener("input", locallyUpdateAssignment)} )

}

function locallyUpdateAssignment(event) {
    //event.target would give u the dom node, 
    //console log prinites old value but target.event.value gives u new value

    //goal: read the node: what is the name and the id of the assignment
    const ID = event.target.parentNode.getAttribute("data-assignment-id")
    const attr = event.target.parentNode.getAttribute("data-label")
    const newValue = event.target.value
    //goal: locally update the course assignments:
    const assignment = currentCourseObjects.assignments.find( function(element) { return element.id === parseInt(ID)})
    assignment[attr] = newValue;
    const newPercentage = currentCourseObjects.course.grade_percentage()
    //goal: ask JS to rerender the grade percentage's value display
    rendergradePercentage(currentCourseObjects.course) 


}

function renderSubmitEditButton(courseID) {
    //find button, un-hide, add id,
    const finishEditButton = elements.submitEditButton();
    finishEditButton.classList.remove('hidden')
    finishEditButton.setAttribute("data-course-id", courseID)
    finishEditButton.addEventListener("click", function(event) { 
    submitEditChanges(courseID) })

};

function submitEditChanges(courseID) {
    // console.log(elements.assignmentRows()[0].getElementsByTagName('input')[0].value)
    // console.log(elements.assignmentRows()[0])
    // let row = elements.assignmentRows()[0]
    elements.assignmentRows().forEach( function(row, index, array) { 
        const id = row.getAttribute("data-assignment-id");
        const name = row.querySelector('.name').querySelector('input').value;
        const score = row.querySelector('.score').querySelector('input').value;
        const outOf = row.querySelector('.out-of').querySelector('input').value;
        const rerender = ( index === array.length - 1) ? true : false;
            updateAssignment(id, name, score, outOf, rerender, courseID) 

    })

    //last assignment will call for rerender of course contetn
    //then we update our state
    states.editModeOn = false;
    //turn off 'save changes' button
    const finishEditButton = elements.submitEditButton();
    finishEditButton.classList.add('hidden')
    //add back "edit" button
    unhideEditButton()
};



function updateAssignment(id, name, score, outOf, rerender = false, courseID = null) {
    console.log(id)
    console.log(name)
    console.log(score)
    console.log(outOf)
    // fetch request to api to update:
    let data = {
        id,
        name,
        score,
        out_of: outOf
    };

    let configurationObject = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch(`${ASSIGNMENTS_URL}/${id}`, configurationObject).
    then( function(resource) { return resource.json() }).
    then(function(json) { 
        console.log(json)
    if (rerender === true ) {
        console.log(` course id is: ${courseID} `);
        //make sure course id is passed in!!!
        fetchAndDisplayCourseContent(courseID)
    }
 })

}

function displayAssignment(assignment, catElement) {
    const divElem = document.createElement('div');
    divElem.className = "assignment-row item"
    divElem.setAttribute("data-assignment-id", assignment.id)
    divElem.innerHTML = `
    <img class="ui avatar image" src="https://semantic-ui.com/images/avatar2/small/lena.png">

    <div class="content">
        <div class="assignment-content" data-assignment-id="${assignment.id}">
            <a class="header name" data-label="name" data-assignment-id="${assignment.id}">${assignment.name}</a>
            <span class="score" data-label="score" data-assignment-id="${assignment.id}">${assignment.score}</span>
            / 
            <span class="out-of" data-label="outOf" data-assignment-id="${assignment.id}">${assignment.outOf}</span>
        </div>
        
  </div>

  <div class="right floated content">
    <a href="#" class="assignment-delete-button ui button" data-assignment-id="${assignment.id}">Delete</a>

</div>



    `;
    const categoryMainContent = catElement.querySelector('.category-main-content')
    categoryMainContent.appendChild(divElem)

    let assignmentDeleteButton = function() { return document.querySelector(`.assignment-delete-button[data-assignment-id="${assignment.id}"]`) }

    assignmentDeleteButton().addEventListener("click", function() {
        const assignmentID = assignmentDeleteButton().getAttribute('data-assignment-id')
        deleteAssignment(assignmentID)
    } )    

}

function deleteAssignment(assignmentID) {
    //find the section and change it to a "deleting..." message
    const assignmentRow = document.querySelector(`.assignment-row[data-assignment-id="${assignmentID}"]`)
    assignmentRow.innerHTML = "Deleting assignment..."
    let data = {
        id: assignmentID
    };
        
    let configurationObject = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
        };
        
        fetch(`${ASSIGNMENTS_URL}/${assignmentID}`, configurationObject).
            then( function(resource) { return resource.json() }).
            then( function(json) { 
                fetchAndDisplayCourseContent(currentCourseObjects.course.id) }
         )
        
}
//OLD COPY KEEP AS BACKUP
// function displayAssignment(assignment, catElement) {
//     const divElem = document.createElement('div');
//     divElem.className = "assignment-row"
//     divElem.setAttribute("data-assignment-id", assignment.id)
//     divElem.innerHTML = `
//     <div class="name" data-assignment-id="${assignment.id}">${assignment.name}</div>
//     <div class="score" data-assignment-id="${assignment.id}">${assignment.score}</div>
//     <div class="out-of" data-assignment-id="${assignment.id}">${assignment.out_of}</div>

//     `
//     //we need to tag them so we can respond to clicks and find out exactly what was clicked...
//     catElement.appendChild(divElem)
// }

