
function rendergradePercentage(courseObject) {
    //goal: we want to make this able to display the first time AND to update
    const percentage = courseObject.grade_percentage()
    const percentageElem = elements.percentageElem()
    percentageElem.classList.remove("hidden")
    percentageElem.innerHTML= `<h3 class="header" >Overall Class Percentage: </h3>
    <h1 class="header">${percentage}%</h1>`

}



//think this one is obselete. i modified this to become a method for the Course class. 
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
