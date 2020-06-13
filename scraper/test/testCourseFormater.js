const CourseFormater = require("../src/util/courseFormater.js");
const formatedCourses = require("../dev-courses.json");
const fs = require("fs");

let classes = [];
CourseFormater.init();
for (let course of formatedCourses) {
  let newClasses = CourseFormater.parseClasses(course, { isFormated: true });
  for (newClass of newClasses) {
    classes.push(newClass);
  }
}
fs.writeJSON("./dev-courses-classes2.json", classes);
