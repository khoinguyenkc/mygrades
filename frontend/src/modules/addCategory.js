
function processCreateACategoryClick() {
    //get id    
    const courseID = elements.startCreateCategory().getAttribute('data-course-id')
    //remove button. done
    removeAddCategoryButton()
    // clear main contents: done
    clearAllContent();
    //unhide frame: done
    const frame = elements.createNewCategoryForm();
    frame.classList.remove('hidden');

    //show form with input fields to form: done
    renderCreateACategoryForm(frame, courseID);
    //add event listener to submit button to process
    elements.submitNewCategoryButton().addEventListener("click", processSubmitNewCategory )


}

function processSubmitNewCategory() {
    console.log(`processSubmitNewCategory called`)
    //extract form data
    const { courseID, name, weight } = extractNewCategoryFormData()
    //fetch and display updated COURSE when done
    fetchCreateOneCategory(courseID, name, weight)
    //remove form from main panel
    removeCreateNewCategoryForm()


};

function removeCreateNewCategoryForm() {
    elements.createNewCategoryForm().innerHTML = ''
}



function fetchCreateOneCategory(courseID, name, weight, rerender = true) {

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
        console.log(json)
        if (rerender) {
            clearAllContent()
            //reload the course with the new category
            fetchAndDisplayCourseContent(courseID)

        }
    })

 };

function extractNewCategoryFormData() {
    const courseID = elements.submitNewCategoryButton().getAttribute('data-course-id');

    const row = elements.createNewCategoryForm().querySelector('.new-category-row');

    const name = row.querySelector('input[name="category-name"]').value
    const weight = row.querySelector('input[name="weight"]').value

    // concise syntax. technically its {coureid: courseid, .....}
    return { courseID, name, weight }

}

function renderCreateACategoryForm(frame, courseID) {
    console.log(`renderCreateACategoryForm called`)
    //render just one category. no multiples!

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
    `;

    frame.appendChild(newRow);

    const submitNewCategory = document.createElement('div')
    submitNewCategory.setAttribute("id", "submit-new-category")
    submitNewCategory.setAttribute("data-course-id", courseID)
    submitNewCategory.innerHTML = `
    <button class="ui labeled icon button">
        <i class="plus square outline icon"></i>
        Add A New Category
    </button>
    `;

    frame.appendChild(submitNewCategory);



}
function removeAddCategoryButton() {
    elements.startCreateCategory().remove()
}
function renderAddCategoryButton(courseID) {
    const newCategoryFrame = elements.courseMenuNewCategoryFrame()
    //clear if anything is existing:
    newCategoryFrame.innerHTML = '';
    //create a dom node
    const startCreateCategory = document.createElement('div')
    startCreateCategory.setAttribute("id", "start-create-category")
    startCreateCategory.setAttribute("data-course-id", courseID)
    startCreateCategory.innerHTML = `
    <button class="ui labeled icon button">
        <i class="plus square outline icon"></i>
        Add A New Category
    </button>
    `;

    //append dom node to newCategoryFrame
    newCategoryFrame.appendChild(startCreateCategory);


}
