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
    newAssignmentButtons: function() {return document.querySelectorAll(".new-assignment-button")},
    submitNewAssignmentsButtons: function() {return document.querySelectorAll(".submit-new-assignments-button")}
    
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

    return percentages.reduce( (acc, val) => acc + val, 0);

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


    rendergradePercentage(courseObject)
    renderEditButton(courseObject.id)
    courseObject.categories.forEach( function(category) { 
        //goal: create a category section
        const catElement = document.createElement('div');
        catElement.className = "category-section";
        catElement.setAttribute("data-category-id", category.id);
        catElement.innerHTML = `
        <div class="category-name">${category.name}</div>
        <div class="new-assignment-button" data-category-id="${category.id}">Add New Assignments</div>
        `
        elements.assignmentsTable().appendChild(catElement)

        //goal: add assignment rows to the category section
        category.assignments.forEach( function(assignment) { displayAssignment(assignment, catElement) })

        //goal: add a hidden div to deal with user adding new assignments 
        const newAssignmentsDiv = document.createElement('div');
        newAssignmentsDiv.className = "new-assignments-section hidden";
        newAssignmentsDiv.setAttribute("data-category-id", category.id);
        newAssignmentsDiv.innerHTML = `
        <div class="new-assignment-button" data-category-id="${category.id}">Add More</div>
        <div class="submit-new-assignments-button" data-category-id="${category.id}">Submit New Assignments</div>
        `
        elements.assignmentsTable().appendChild(newAssignmentsDiv)

        
    })
    elements.newAssignmentButtons().forEach( function(button) { button.addEventListener("click", addNewAssignment)})
    elements.submitNewAssignmentsButtons().forEach( function(button) { button.addEventListener("click", submitNewAssignments )})
}

function submitNewAssignments(event) {
    //find the new-assignment-section div with that category id (dont use parent node, as that might change so easily)
    const catID = event.target.getAttribute('data-category-id');
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
        if (rerender === true) { fetchAndDisplayCourseContent(currentCourseObjects.course.id) }
 })

}

function addNewAssignment(event) {
    console.log(event.target)
    //un-hide new-assignments-section with the id
    const catID = event.target.getAttribute('data-category-id');
    const newAssDiv = document.querySelector(`.new-assignments-section[data-category-id="${catID}"]`)
    newAssDiv.classList.remove("hidden")
    //add inputs into newAssDiv
    let newRow = document.createElement("div")
    newRow.className = "new-assignment-row"
    newRow.setAttribute("data-category-id", catID)
    newRow.innerHTML = `
        <input type="text" name="name" data-category-id="${catID}">
        <input type="text" name="score" data-category-id="${catID}">
        <input type="text" name="out-of" data-category-id="${catID}">
    `
    //append newRow...
    newAssDiv.appendChild(newRow)

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
    const editButton = document.createElement('a');
    editButton.className = "edit-button";
    editButton.setAttribute("data-course-id", courseID)
    editButton.innerText = `Edit Scores`
    elements.mainPanel().appendChild(editButton)
    editButton.addEventListener("click", function(event) { editScores(event.target.getAttribute("data-course-id"))})

}

function rendergradePercentage(courseObject) {
    //goal: we want to make this able to display the first time AND to update
    const percentage = gradePercentage(courseObject)
    const percentageElem = elements.percentageElem()
    percentageElem.classList.remove("hidden")
    percentageElem.innerText = `Class Percentage: ${percentage}%`

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
    states.editModeOn = true;
    //toggle off edit button,
    let editButton = document.getElementsByClassName("edit-button")[0]
    editButton.classList.add('hidden')
    // add finish edit button
    renderSubmitEditButton(courseID)

        
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


    //add event listeners for all these input fields to 
    //it will auto pass the EVENT as argument into the callback

    names.forEach( function(node) { node.addEventListener("input", locallyUpdateAssignment)} )
    scores.forEach( function(node) { node.addEventListener("input", locallyUpdateAssignment)} )
    outofs.forEach( function(node) { node.addEventListener("input", locallyUpdateAssignment)} )

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
    const finishEditButton = document.createElement('a');
    finishEditButton.className = "submit-edit-button";
    finishEditButton.setAttribute("data-course-id", courseID)
    finishEditButton.innerText = `Save Changes`
    elements.mainPanel().appendChild(finishEditButton)
    finishEditButton.addEventListener("click", function(event) { submitEditChanges(courseID) })

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
        fetchAndDisplayCourseContent(courseID)
    }
 })

}

function displayAssignment(assignment, catElement) {
    const divElem = document.createElement('div');
    divElem.className = "assignment-row"
    divElem.setAttribute("data-assignment-id", assignment.id)
    divElem.innerHTML = `
    <div class="assignment-content" data-assignment-id="${assignment.id}">
    <div class="name" data-label="name" data-assignment-id="${assignment.id}">${assignment.name}</div>
    <div class="score" data-label="score" data-assignment-id="${assignment.id}">${assignment.score}</div>
    <div class="out-of" data-label="outOf" data-assignment-id="${assignment.id}">${assignment.outOf}</div>
    </div>
    <div class="assignment-delete-button" data-assignment-id="${assignment.id}">
        <a href="#">Delete</a>
    </div>
    `;
    catElement.appendChild(divElem)

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

