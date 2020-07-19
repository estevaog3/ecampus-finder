require('dotenv').config();
const fs = require('fs');
const Enrollment = require('./Page/Enrollment.js');
const searchClient = require('../../services/searchClient');

(async () => {
  const username = process.env.USUARIO;
  const password = process.env.SENHA;
  const outputFile = process.env.OUTPUT_FILE;
  let courses;
  try {
    await Enrollment.signIn(username, password);
    console.log('signIn passed');
    courses = await Enrollment.scrapeAllCourses();
  } catch (e) {
    console.error('ERROR!\n', e);
  }
  fs.writeJson(outputFile, courses);
  searchClient.indexAll(courses);
  await Enrollment.close();
})();
