import Login from "./Login.js";
import formatCourse from "../util/courseFormater.js";

const Enrollment = Object.create(Login);

Enrollment.homeUrl = "https://ecampus.ufam.edu.br/ecampus/home/index";

Enrollment.open = async function () {
  if (!this.isLogged) {
    console.error("User must be loged in to open Enrollment Page");
    return;
  }
  await this.page.goto(this.homeUrl);
  await this.page.waitFor('a[title="Aluno"]');
  await this.page.click('a[title="Aluno"]');
  await this.page.waitFor("#panel-menu > :nth-child(2) > :nth-child(3)");
  await this.page.click("#panel-menu > :nth-child(2) > :nth-child(3)");

  await this.page.waitFor(
    "#panel-menu > :nth-child(2) > :nth-child(4) > :nth-child(1)"
  );
  // await this.page.screenshot();
  // clica no botão de solicitação de matrícula:
  await this.page.click(
    "#panel-menu > :nth-child(2) > :nth-child(4) > :nth-child(1)"
  );
  await this.page.waitFor(
    ".dialog > table:nth-of-type(2) > tbody > tr:nth-child(2)"
  );
  // expande o conteúdo abaixo de "DISCIPLINAS DE OUTROS CURSOS"
  await this.page.click(
    ".dialog > table:nth-of-type(2) > tbody > tr:nth-child(2)"
  );
  await this.page.waitFor(800);

  this.numberOfCourses = await this.page.evaluate(() => {
    let select = document.getElementById("curso");
    return select.options.length;
  });

  this.isAtEnrollmentPage = true;
};

Enrollment.selectCourse = async function (index) {
  await this.page.evaluate((index) => {
    let select = document.getElementById("curso");
    select.selectedIndex = index;
  }, index);
};

Enrollment.scrapeCourse = async function (index) {
  this.selectCourse(index);
  await page.click("#buscar-por-curso");
  await page.waitFor("#grid-turmas-outros");
  return await this.page.evaluate(() => {
    let data = {};
    //get código e nome da disciplina
    let select = document.getElementById("curso");
    let codigoENome = select.options[select.selectedIndex].innerText;
    data.codigo = codigoENome.split(" - ")[0];
    data.nome = codigoENome.split(" - ")[1];

    let table = document.getElementById("grid-turmas-outros");

    function HTMLTableToArray(element, withHeader) {
      element =
        typeof element === "string" ? document.querySelector(element) : element;
      var a = [];
      var rows = element.querySelectorAll("tr");
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var aa = [];
        var cells = row.querySelectorAll(withHeader ? "th,td" : "td");
        for (var j = 0; j < cells.length; j++) {
          var cell = cells[j];
          if (cell.innerText.trim().length > 0) {
            aa.push(cell.innerText);
          }
        }
        if (!withHeader) {
          if (row.querySelectorAll("th").length > 1) continue;
        }
        a.push(aa);
      }
      return a;
    }

    data.disciplinas = HTMLTableToArray(table, true);
    return data;
  });
};

Enrollment.scrapeAllCourses = async function () {
  if (!this.isAtEnrollmentPage) {
    this.open();
  }
  let courses = [];
  for (let i = 1; i < this.numberOfCourses; i++) {
    console.log("begin", i);
    try {
      let course = await this.scrapeCourse(i);
      courses.push(formatCourse(course));
    } catch (e) {
      console.error(e);
    }
  }

  return courses;
};

export default Enrollment;
