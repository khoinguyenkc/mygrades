
const BASE_URL = "http://localhost:3000";
const COURSES_URL = `${BASE_URL}/courses`;
const ASSIGNMENTS_URL = `${BASE_URL}/assignments`;
const CATEGORIES_URL = `${BASE_URL}/categories`;
let currentCourseJSON;

let currentCourseObjects = {
    course: null,
    categories: [],
    assignments: []
}


let states = {
    editModeOn: false
};
