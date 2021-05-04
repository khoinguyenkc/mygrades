//we make these DOM nodes "live"
let elements = {
    coursePanel: function() {return document.getElementById('courses-panel')},
    mainPanel: function() { return document.getElementById('main-panel')},
    assignmentsTable: function() { return document.getElementById('assignments-table')},
    assignmentRows: function() {return document.querySelectorAll(".assignment-row")},
    percentageElem: function() {return document.querySelector("#grade-percentage")},
    courseTitleElem: function() {return document.querySelector("#course-title")},
    newAssignmentButtons: function() {return document.querySelectorAll(".new-assignment-button")},
    submitNewAssignmentsButtons: function() {return document.querySelectorAll(".submit-new-assignments-button")},
    editScoreButton: function() {return document.getElementById('edit-score-button')},
    submitEditButton: function() {return document.getElementById('submit-edit-button')},
    names: function() { return document.querySelectorAll("div.category-section .name")},
    scores: function() { return document.querySelectorAll("div.category-section .score")},
    outOfs: function() { return document.querySelectorAll("div.category-section .out-of")},
    courseMenuBar: function() { return document.getElementById("course-menu-bar");},
    createNewCourseButton: function() { return document.getElementById("create-new-course")},
    newCourseFormDiv: function() { return document.getElementById("create-new-course-form")},
    submitNewCourseButton: function() { return document.getElementById("submit-new-course")},
    courseMenuNewCategoryFrame: function() { return document.getElementById("course-menu-new-category-frame")},
    startCreateCategory: function() { return document.getElementById("start-create-category")},
    createNewCategoryForm: function() { return document.getElementById("create-new-category-form")},
    submitNewCategoryButton: function() { return document.getElementById("submit-new-category")}
};

