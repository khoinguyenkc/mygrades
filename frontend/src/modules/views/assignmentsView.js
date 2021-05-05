function displayAssignment(assignment, catElement) {
    //will display one single assignment

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

    addListenerToDeleteButton(assignment)
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
