const courses = require("./courses.json");

const getMaiorHorario = (courses) => {
  let maiorHorario = [];
  let disciplinaDoMaiorHorario;
  for (let curso of courses.cursos) {
    for (let disciplina of curso.disciplinas) {
      for (let turma of disciplina.turmas) {
        if (turma.horarios.length > maiorHorario.length) {
          maiorHorario = turma.horarios;
          disciplinaDoMaiorHorario = disciplina.nome;
        }
      }
    }
  }
  return { disciplinaDoMaiorHorario, maiorHorario };
};

console.log(getMaiorHorario(courses));

const getDistribuicaoDeTamanhosDeHorarios = (courses) => {
  let countHorarios = {}; // 'countHorarios[i] = N', existem 'N' horários distintos de tamanho 'i'
  for (let curso of courses.cursos) {
    for (let disciplina of curso.disciplinas) {
      for (let turma of disciplina.turmas) {
        let size = turma.horarios.length;
        countHorarios[size] = countHorarios[size] ? countHorarios[size] + 1 : 1;
      }
    }
  }
  return countHorarios;
};

console.log("Distribuição dos horários:");
console.log(getDistribuicaoDeTamanhosDeHorarios(courses));
