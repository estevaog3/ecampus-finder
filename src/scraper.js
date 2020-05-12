require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
 
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1080, height: 720});
  await page.goto('https://ecampus.ufam.edu.br/ecampus/home/login');
  await page.type('input#usuario', process.env.USUARIO);
  await page.type('input#senha', process.env.SENHA);
  await page.click('input#enviar');
  await page.waitFor('a[title="Aluno"]');
  await page.click('a[title="Aluno"]');
  await page.waitFor(2000);
  await page.click('#panel-menu > :nth-child(2) > :nth-child(3)');
  await page.waitFor(800);
  // clica no botão de solicitação de matrícula:
  await page.click('#panel-menu > :nth-child(2) > :nth-child(4) > :nth-child(1)');
  await page.waitFor(3000);
  console.log(' @ página de solicitação de matricula');
  // expande o conteúdo abaixo de "DISCIPLINAS DE OUTROS CURSOS"
  await page.click('.dialog > table:nth-of-type(2) > tbody > tr:nth-child(2)');
  await page.waitFor(800);

  let numberOfOptions = await page.evaluate(() => {
    let select = document.getElementById('curso');
    return select.options.length;
  });

  async function selectOption(index){
    await page.evaluate((index) => {
      let select = document.getElementById('curso');
      select.selectedIndex = index;
    }, index);
  }

  async function scrapper(){
    return await page.evaluate(() =>{
      let data = {};
      //get código e nome da disciplina
      let select = document.getElementById('curso');
      let codigoENome = select.options[select.selectedIndex].innerText;
      data.codigo = codigoENome.split(' - ')[0];
      data.nome = codigoENome.split(' - ')[1];

      let table = document.getElementById('grid-turmas-outros');

      function HTMLTableToArray (element, withHeader) {
        element = typeof element === 'string' ? document.querySelector(element) : element
        var a = []
        var rows = element.querySelectorAll('tr')
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i]
          var aa = []
          var cells = row.querySelectorAll(withHeader ? 'th,td' : 'td')
          for (var j = 0; j < cells.length; j++) {
            var cell = cells[j]
            if(cell.innerText.trim().length > 0){
              aa.push(cell.innerText)
            }
          }
          if (!withHeader) {
            if (row.querySelectorAll('th').length > 1) continue
          }
          a.push(aa)
        }
        return a
      }
      
      data.disciplinas = HTMLTableToArray(table, true);
      return data;
    });
  }

  function formater(curso){
    let disciplinas = [];
    let disciplina, turma;
    let lookingFor = 'disciplina';
    
    function assertLength(array, len, msg){
      if(array.length !== len){
        console.log(msg, 'expected length == ',len,', got:',array.length);
        console.log('array:', array);
        return false;
      }
      return true;
    }

    for(let i = 1; i < curso.disciplinas.length; i++){

      if(lookingFor === 'disciplina'){
        if(assertLength(curso.disciplinas[i], 2, `[looking for ${lookingFor}] `) == false){
          return {};
        }
        disciplina = {};
        disciplina.codigo = curso.disciplinas[i][0];
        disciplina.nome = curso.disciplinas[i][1];
        lookingFor = 'turma';
        disciplina.turmas = [];
        i++;
      }else if(lookingFor === 'turma'){
        if(assertLength(curso.disciplinas[i], 3, `[looking for ${lookingFor}] `) == false){
          return {};
        }
        turma = {};
        turma.codigo = curso.disciplinas[i][0];
        turma.numeroDeVagas = curso.disciplinas[i][1];
        turma.numeroDeSolicitacoes = curso.disciplinas[i][2];
        
        lookingFor = 'horarios';
        turma.horarios = [];
        i = i + 2;
      }else if(lookingFor === 'horarios'){
        if(curso.disciplinas[i].length === 1 && curso.disciplinas[i][0].match("^(N|n)enhum")){
          // turma corrente está sem horário
          let copy = JSON.parse(JSON.stringify(turma));
          disciplina.turmas.push(copy);
          if(i + 1 < curso.disciplinas.length && curso.disciplinas[i+1].length === 2){
            lookingFor = 'disciplina';
          }else{
            lookingFor = 'turma';
          }
        }else if(curso.disciplinas[i].length === 3 && curso.disciplinas[i][2].split(":").length === 1){
          // atual é turma
          let copy = JSON.parse(JSON.stringify(turma));
          disciplina.turmas.push(copy);
          lookingFor = 'turma';
          i--;
        }else if(curso.disciplinas[i].length === 2){
          //atual é disciplina
          disciplina.turmas.push(turma);
          let copy = JSON.parse(JSON.stringify(disciplina));
          disciplinas.push(copy);
          lookingFor = 'disciplina';
          i--;
        }else{
          if(assertLength(curso.disciplinas[i], 3, `[looking for ${lookingFor}] `) == false){
            return {};
          }
          turma.horarios.push({
            'dia' : curso.disciplinas[i][0],
            'inicio': curso.disciplinas[i][1],
            'termino': curso.disciplinas[i][2],
          });
        }
      }
    }
    let cursoCopy = JSON.parse(JSON.stringify(curso));
    cursoCopy.disciplinas = disciplinas;
    return cursoCopy;
  }

  let courses = {'cursos': []};
  for(let i = 1; i < numberOfOptions; i++){
    console.log('begin', i);
    try{
      await selectOption(i);
      await page.click('#buscar-por-curso');
      await page.waitFor('#grid-turmas-outros');
      let curso = await scrapper();
      courses['cursos'].push(formater(curso));
    }catch(e){
      console.log(e);
    }
  }

  fs.writeJson('./courses.json', courses);
  await browser.close();
})();