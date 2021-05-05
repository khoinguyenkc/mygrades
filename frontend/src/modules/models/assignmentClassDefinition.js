class Assignment {
    constructor(id, name, score, outOf, category = null){
        this.id = id;
        this.name = name;
        this.score = score;
        this.outOf = outOf;
        this.category = category;
    }
}



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
