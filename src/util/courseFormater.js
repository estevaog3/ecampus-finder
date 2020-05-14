export default function formatCourse(curso) {
  let disciplinas = [];
  let disciplina, turma;
  let lookingFor = "disciplina";

  function assertLength(array, len, msg) {
    if (array.length !== len) {
      console.log(msg, "expected length == ", len, ", got:", array.length);
      console.log("array:", array);
      return false;
    }
    return true;
  }

  for (let i = 1; i < curso.disciplinas.length; i++) {
    if (lookingFor === "disciplina") {
      if (
        assertLength(curso.disciplinas[i], 2, `[looking for ${lookingFor}] `) ==
        false
      ) {
        return {};
      }
      disciplina = {};
      disciplina.codigo = curso.disciplinas[i][0];
      disciplina.nome = curso.disciplinas[i][1];
      lookingFor = "turma";
      disciplina.turmas = [];
      i++;
    } else if (lookingFor === "turma") {
      if (
        assertLength(curso.disciplinas[i], 3, `[looking for ${lookingFor}] `) ==
        false
      ) {
        return {};
      }
      turma = {};
      turma.codigo = curso.disciplinas[i][0];
      turma.numeroDeVagas = curso.disciplinas[i][1];
      turma.numeroDeSolicitacoes = curso.disciplinas[i][2];

      lookingFor = "horarios";
      turma.horarios = [];
      i = i + 2;
    } else if (lookingFor === "horarios") {
      if (
        curso.disciplinas[i].length === 1 &&
        curso.disciplinas[i][0].match("^(N|n)enhum")
      ) {
        // turma corrente está sem horário
        let copy = JSON.parse(JSON.stringify(turma));
        disciplina.turmas.push(copy);
        if (
          i + 1 < curso.disciplinas.length &&
          curso.disciplinas[i + 1].length === 2
        ) {
          lookingFor = "disciplina";
        } else {
          lookingFor = "turma";
        }
      } else if (
        curso.disciplinas[i].length === 3 &&
        curso.disciplinas[i][2].split(":").length === 1
      ) {
        // atual é turma
        let copy = JSON.parse(JSON.stringify(turma));
        disciplina.turmas.push(copy);
        lookingFor = "turma";
        i--;
      } else if (curso.disciplinas[i].length === 2) {
        //atual é disciplina
        disciplina.turmas.push(turma);
        let copy = JSON.parse(JSON.stringify(disciplina));
        disciplinas.push(copy);
        lookingFor = "disciplina";
        i--;
      } else {
        if (
          assertLength(
            curso.disciplinas[i],
            3,
            `[looking for ${lookingFor}] `
          ) == false
        ) {
          return {};
        }
        turma.horarios.push({
          dia: curso.disciplinas[i][0],
          inicio: curso.disciplinas[i][1],
          termino: curso.disciplinas[i][2],
        });
      }
    }
  }
  let cursoCopy = JSON.parse(JSON.stringify(curso));
  cursoCopy.disciplinas = disciplinas;
  return cursoCopy;
}
