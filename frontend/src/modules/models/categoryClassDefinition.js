class Category {
    constructor(id, name, weight, course = null, assignments = [],){
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.assignments = assignments;
    }
}