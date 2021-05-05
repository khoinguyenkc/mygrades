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
