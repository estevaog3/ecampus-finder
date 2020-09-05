const fs = require("fs");
const CourseFormatter = require("../src/util/courseFormatter.js");
const formattedCourses = require("../dev-courses.json");

const classes = [];
CourseFormatter.init();
for (const course of formattedCourses) {
  const newClasses = CourseFormatter.parseClasses(course, { isFormatted: true });
  for (const newClass of newClasses) {
    classes.push(newClass);
  }
}
fs.writeJSON("./dev-courses-classes2.json", classes);
