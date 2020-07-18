const fs = require('fs');
const CourseFormater = require('../src/util/courseFormater.js');
const formatedCourses = require('../dev-courses.json');

const classes = [];
CourseFormater.init();
for (const course of formatedCourses) {
  const newClasses = CourseFormater.parseClasses(course, { isFormated: true });
  for (newClass of newClasses) {
    classes.push(newClass);
  }
}
fs.writeJSON('./dev-courses-classes2.json', classes);
