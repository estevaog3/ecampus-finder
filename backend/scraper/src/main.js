require("dotenv").config();
const Enrollment = require("./Page/Enrollment.js");
const searchClient = require("../../services/searchClient");
const { PROD_INDEX } = require("../../constants");

async function scrapeAndSave() {
  const username = process.env.USUARIO;
  const password = process.env.SENHA;

  if (!username || !password) {
    throw Error("username or password is undefined");
  }
  let courses;
  try {
    await Enrollment.signIn(username, password);
    console.log("signIn passed");
    courses = await Enrollment.scrapeAllCourses();
  } catch (e) {
    console.error("ERROR!\n", e);
  }
  searchClient.init(PROD_INDEX);
  searchClient.indexAll(courses, PROD_INDEX);
  await Enrollment.close();
}

scrapeAndSave();
