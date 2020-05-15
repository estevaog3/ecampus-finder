const CourseFormater = require("../util/courseFormater.js");
const formatedCourses = require("../../dev-courses.json");
const fs = require("fs-extra");

let classes = [];
CourseFormater.init();
for (let course of formatedCourses) {
  let newClasses = CourseFormater.parseClasses(course);
  for (newClass of newClasses) {
    classes.push(newClass);
  }
}
fs.writeJSON("./dev-courses-classes.json", classes);
