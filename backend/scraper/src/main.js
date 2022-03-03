require("dotenv").config();
const path = require("path");
const fs = require("fs");
const Enrollment = require("./Page/Enrollment.js");
const searchClient = require("../../services/searchClient");

async function indexClasses(classes) {
  await searchClient.init(process.env.INDEX);
  await searchClient.indexAll(classes, process.env.INDEX);
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
  const classesFile = process.argv[2];
  if (classesFile) {
    fs.readFile(path.join(process.cwd(), classesFile), (error, data) => {
      if (error) {
        console.log("Error trying to read file");
        return;
      }
      indexClasses(JSON.parse(data));
    });
  } else {
    const classes = await scrapeClasses();
    indexClasses(classes);
  }
}

main();
