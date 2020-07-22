require('dotenv').config();
const fs = require('fs');
const Enrollment = require('./Page/Enrollment.js');
const searchClient = require('../../services/searchClient');

async function scrapeAndSave() {
  const username = process.env.USUARIO;
  const password = process.env.SENHA;
  const outputFile = process.env.PROD_OUTPUT_FILE;
  const index = process.env.PROD_INDEX;
  if (!username || !password || !outputFile || !index) {
    throw Error('username, password, outputFile or index is undefined');
  }
  let courses;
  try {
    await Enrollment.signIn(username, password);
    console.log('signIn passed');
    courses = await Enrollment.scrapeAllCourses();
  } catch (e) {
    console.error('ERROR!\n', e);
  }
  fs.writeJson(outputFile, courses);
  searchClient.init(index);
  searchClient.indexAll(courses, index);
  await Enrollment.close();
}

function loadAndSave() {
  const index = process.env.DEV_INDEX;
  const inputFile = process.env.DEV_INPUT_FILE;
  const courses = require(inputFile.toString());
  if (!index || !inputFile || !courses) {
    throw Error('index, inputFile or courses is undefined');
  }
  searchClient.init(index);
  searchClient.indexAll(courses, index);
}

(() => {
  if (process.env.NODE_ENV === 'production') {
    scrapeAndSave();
  } else {
    loadAndSave();
  }
})();
