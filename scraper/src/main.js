require("dotenv").config();
const fs = require("fs");
const Enrollment = require("./Page/Enrollment.js");

(async () => {
  let username = process.env.USUARIO;
  let password = process.env.SENHA;
  let outputFile = process.env.OUTPUT_FILE;
  let courses;
  try {
    await Enrollment.signIn(username, password);
    courses = await Enrollment.scrapeAllCourses();
  } catch (e) {
    console.error("ERROR!\n", e);
  }
  fs.writeJson(outputFile, courses);
  await Enrollment.close();
})();
