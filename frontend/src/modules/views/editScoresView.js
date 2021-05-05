function renderSubmitEditButton(courseID) {
    //find button, un-hide, add id,
    const finishEditButton = elements.submitEditButton();
    finishEditButton.classList.remove('hidden')
    finishEditButton.setAttribute("data-course-id", courseID)
    finishEditButton.addEventListener("click", function(event) { 
    submitEditChanges(courseID) })

};

function hideEditScoreButton() {
    let editButton = document.getElementById("edit-score-button")
    editButton.classList.add('hidden')

}

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


function transformToEditScoresForm() {
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

}


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




function unhideEditButton() {
    const editScoreButton = elements.editScoreButton();
    editScoreButton.classList.remove('hidden')

}