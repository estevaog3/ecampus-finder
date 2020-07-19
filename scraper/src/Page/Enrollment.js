const Login = require('./Login.js');
const CourseFormatter = require('../util/courseFormatter.js');

const Enrollment = Object.create(Login);

Enrollment.open = async function () {
  if (!this.isLogged) {
    console.error('User must be logged in to open Enrollment Page');
    return;
  }
  await this.page.waitFor('a[title="Aluno"]');
  await this.page.click('a[title="Aluno"]');
  await this.page.waitFor('#panel-menu > :nth-child(2) > :nth-child(3)');
  await this.page.click('#panel-menu > :nth-child(2) > :nth-child(3)');

  await this.page.waitFor(
    '#panel-menu > :nth-child(2) > :nth-child(4) > :nth-child(1)',
  );

  // clica no botão de solicitação de matrícula:
  await this.page.click(
    '#panel-menu > :nth-child(2) > :nth-child(4) > :nth-child(1)',
  );
  await this.page.waitFor(
    '.dialog > table:nth-of-type(2) > tbody > tr:nth-child(2)',
  );
  // expande o conteúdo abaixo de "DISCIPLINAS DE OUTROS CURSOS"
  await this.page.click(
    '.dialog > table:nth-of-type(2) > tbody > tr:nth-child(2)',
  );
  await this.page.waitFor(800);

  this.numberOfCourses = await this.page.evaluate(() => {
    const select = document.getElementById('curso');
    return select.options.length;
  });

  this.isAtEnrollmentPage = true;
};

Enrollment.selectCourse = async function (index) {
  await this.page.evaluate((index) => {
    const select = document.getElementById('curso');
    select.selectedIndex = index;
  }, index);
};

Enrollment.scrapeCourse = async function (index) {
  await this.selectCourse(index);
  await this.page.click('#buscar-por-curso');
  await this.page.waitFor('#grid-turmas-outros');
  return await this.page.evaluate(() => {
    const data = {};
    // get código e nome da disciplina
    const select = document.getElementById('curso');
    const codigoENome = select.options[select.selectedIndex].innerText;
    data.codigo = codigoENome.split(' - ')[0];
    data.nome = codigoENome.split(' - ')[1];

    const table = document.getElementById('grid-turmas-outros');

    function HTMLTableToArray(_element, withHeader) {
      const element =
        typeof _element === 'string'
          ? document.querySelector(_element)
          : _element;
      const a = [];
      const rows = element.querySelectorAll('tr');
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const aa = [];
        const cells = row.querySelectorAll(withHeader ? 'th,td' : 'td');
        for (let j = 0; j < cells.length; j++) {
          const cell = cells[j];
          if (cell.innerText.trim().length > 0) {
            aa.push(cell.innerText);
          }
        }
        if (!withHeader) {
          if (row.querySelectorAll('th').length > 1) continue;
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
    await this.open();
  }
  const classes = [];
  CourseFormatter.init();
  for (let i = 1; i < this.numberOfCourses; i++) {
    console.log('begin', i);
    try {
      const course = await this.scrapeCourse(i);
      const newClasses = CourseFormatter.parseClasses(course);
      for (newClass of newClasses) {
        classes.push(newClasse);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return classes;
};

module.exports = Enrollment;
