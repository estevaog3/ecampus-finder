const fs = require("fs");
const courses = require("../../courses.json");
const CourseFormatter = require("./courseFormatter");

const classes = [];
CourseFormatter.init();
for (const course of courses.cursos) {
  const newClasses = CourseFormatter.parseClasses(course, { isFormatted: true });
  for (const newClass of newClasses) {
    classes.push(newClass);
  }
}

fs.writeFile("./classes.json", JSON.stringify(classes), (error) => {
  if (error) console.log(error);
});
