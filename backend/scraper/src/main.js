require("dotenv").config();
const Enrollment = require("./Page/Enrollment.js");
const searchClient = require("../../services/searchClient");
const fs = require('fs');
const { PROD_INDEX } = require("../../constants");

async function indexClasses(classes) {
  await searchClient.init(PROD_INDEX);
  await searchClient.indexAll(classes, PROD_INDEX);
}

async function scrapeClasses() {
  const username = process.env.USUARIO;
  const password = process.env.SENHA;

  if (!username || !password) {
    throw Error("username or password is undefined");
  }
  let classes;
  try {
    await Enrollment.signIn(username, password);
    console.log("signIn passed");
    classes = await Enrollment.scrapeAllCourses();
  } catch (e) {
    console.error("ERROR!\n", e);
  }
  await Enrollment.close();
  return classes;
}

async function main() {
  let classesFile = process.argv[2]
  if(classesFile){
    fs.readFile(classesFile, (error, data) => {
      if(error){
        console.log(error);
        return;
      }
      indexClasses(JSON.parse(data));
    })
  }else {
    const classes = await scrapeClasses();
    indexClasses(classes);
  }
}

main();
