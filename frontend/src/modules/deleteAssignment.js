//refactor this to two parts: views and model 
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


function addListenerToDeleteButton(assignment) {
    
    let assignmentDeleteButton = function() { return document.querySelector(`.assignment-delete-button[data-assignment-id="${assignment.id}"]`) }

    assignmentDeleteButton().addEventListener("click", function() {
        const assignmentID = assignmentDeleteButton().getAttribute('data-assignment-id')
        deleteAssignment(assignmentID)
    } )    

}