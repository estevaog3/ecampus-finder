const courses = require('../../courses.json');
const fs = require('fs');
const CourseFormatter = require('./courseFormatter');

let classes = [];
CourseFormatter.init();
for(const course of courses.cursos){
    let newClasses = CourseFormatter.parseClasses(course, {isFormatted: true});
    for (const newClass of newClasses) {
        classes.push(newClass);
    }
}

fs.writeFile('./classes.json', JSON.stringify(classes), (error) => {if(error) console.log(error)});