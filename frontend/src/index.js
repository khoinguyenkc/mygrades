






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

function clearAllContent() {
    //HIDE id main-panel
    elements.mainPanel().classList.add('hidden')
    //hide course form
    hideNewCourseForm()
    //remove content inside New Category Form (haven't built this form)

}

function initializeApp() {
    //should add a function that clear all panels that might be showing. aka like a resetter
    clearAllContent()
    fetchAndDisplayCourseTitles()
    elements.editScoreButton().addEventListener("click", function(event) { editScores(elements.editScoreButton().getAttribute("data-course-id"))})
    // window.onscroll = function() { makeCourseMenuSticky()};
    elements.createNewCourseButton().addEventListener("click", function(event) { showNewCourseForm() })
}
initializeApp()

function hideNewCourseForm() {
        //UNHIDE the new course button
        elements.createNewCourseButton().classList.remove('hidden');
        //remove the new course form div:
        elements.newCourseFormDiv().classList.add('hidden');

}

function submitNewCourse() {
    console.log('submit new course called')
    //extract info
    const newCourseTitle = elements.newCourseFormDiv().querySelector(`input[name='course-name'`).value;
    console.log(newCourseTitle);
    //fetch POST course, receive couse ID, use courseid to create categories
    fetchCreateCourse(newCourseTitle)
    
    //categories creation, hiding course form, is handled in fetchCreateCourse because its async, we gotta wait for it whenever its ready
    //we're cancelling those features

    hideNewCourseForm()
    
}

function fetchCreateCourse(name) {
    let data = {
        name: name
    };

    let configurationObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch(`${COURSES_URL}`, configurationObject).
    then( function(resource) { return resource.json() }).
    then( function(json) { 
        initializeApp()

            // createCategories(json.id) 
    }
 
    )
};


function createCategories(courseID) {
    const rows = elements.newCourseFormDiv().querySelectorAll('.new-category-row');

    //send info
    rows.forEach( function(row, index, array) {
        const name = row.querySelector('input[name="category-name"]').value
        const weight = row.querySelector('input[name="weight"]').value
        // make fetch requeset
        const rerender = ( index === array.length - 1) ? true : false;
        fetchCreateCategories(courseID, name , weight, rerender)

    })

}

function fetchCreateCategories(courseID, name , weight, rerender) {

    let data = {
        name: name,
        weight: weight,
        course_id: courseID
    };

    let configurationObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch(`${CATEGORIES_URL}`, configurationObject).
    then( function(resource) { return resource.json() }).
    then( function(json) { 
        //WHAT DO I DO HERE
        if (rerender) {
            //hide div
            hideNewCourseForm()
            //rerender page as if from beginning
            fetchAndDisplayCourseTitles()
            console.log('last category created')
        }
        return 
    

    }
 
    )

};
   

function showNewCourseForm() {
    //clear other content from tohoer "pages"
    clearAllContent()
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

    // function addCategoryRow(container) {
    //     let newRow = document.createElement("div")
    //     newRow.className = "new-category-row"
    //     newRow.innerHTML = `
    //         <p>
    //         <label for="category-name">Category Name</label>
    //         <input type="text" name="category-name" >
    //         </p>
    //         <p>
    //         <label for="weight">Weight (in decimal form)</label>
    //         <input type="text" name="weight" >
    //         </p>
    //     `
    //     //append newRow... 5 times
    //     container.appendChild(newRow)
    
    // }
    // addCategoryRow(containerForRows)
    // addCategoryRow(containerForRows)
    // addCategoryRow(containerForRows)
    // addCategoryRow(containerForRows)
    // addCategoryRow(containerForRows)



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
    //clear coourse panel
    elements.coursePanel().innerHTML = '';
    //add courses
    array.forEach( function(course) { 
        // const courseElement = document.createElement('div');
        const courseElement = document.createElement('a');

        // courseElement.innerHTML =
        //  `<a class="course-link huge ui button" href="#" data-course-id="${course.id}">${course.name}</a>`
        courseElement.className = "course-link large ui button";
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
    //clear other content from tohoer "pages"
    clearAllContent()
    //unhide main panel
    elements.mainPanel().classList.remove('hidden')

    console.log(courseObject)
    //SUPER IMPORTANT:
    //this can be called several times. so we have to clear it first:
    elements.assignmentsTable().innerHTML = '';
    //should later change the html structure in index.thml so we dont celar innerHTML like this...
    elements.courseMenuBar().classList.remove('hidden')
    renderCourseTitle(courseObject)
    rendergradePercentage(courseObject)
    renderEditButton(courseObject.id)
    renderAddCategoryButton(courseObject.id)
    elements.startCreateCategory().addEventListener("click", processCreateACategoryClick );
    courseObject.categories.forEach( function(category) { createACategorySection(category) } )

    elements.newAssignmentButtons().forEach( function(button) { button.addEventListener("click", addNewAssignment)})
    elements.submitNewAssignmentsButtons().forEach( function(button) { button.addEventListener("click", submitNewAssignments )})
}



//for the form with multiple inputs!!!!!!!
function createACategorySection(category) { 
    //goal: create a category section
    const catElement = document.createElement('div');
    catElement.className = "category-section";
    catElement.setAttribute("data-category-id", category.id);
    catElement.innerHTML = `
            <h3 class="category-name header">${category.name.toUpperCase()}</h3>
            <h4 class="category-weight">Weight: ${category.weight * 100}%</h4>
            <div class="new-assignment-button" data-category-id="${category.id}">
                <div class=" ui primary button" >
                    Add New Assignments
                </div>
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
        //temporarily disabling this for testing
        fetchCreateAssignment(catID,name,score,outOf, rerender)

    })
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

// ==========================================
// ========EDIT SCORES CONTROLLER ===========
// ==========================================
function editScores(courseID) {
    console.log(`edit scores function was called`)
    states.editModeOn = true;
    //toggle off edit button
    hideEditScoreButton()
    // add finish edit button
    renderSubmitEditButton(courseID)

        
    //turn elements into input fields
    transformToEditScoresForm()

    //add event listeners for all these input fields to 
    //it will auto pass the EVENT as argument into the callback

    // elements.names().forEach( function(node) { node.addEventListener("input", locallyUpdateAssignment)} )
    // elements.scores().forEach( function(node) { node.addEventListener("input", locallyUpdateAssignment)} )
    // elements.outOfs().forEach( function(node) { node.addEventListener("input", locallyUpdateAssignment)} )

}


//--------------------------------------------------
//is this even used?! like it seems not used. 
// what is used in place of it??
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

