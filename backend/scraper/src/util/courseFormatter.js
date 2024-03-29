/* eslint-disable security-node/detect-crlf */
function formatCourse(curso) {
  const disciplinas = [];
  let disciplina;
  let turma;
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
        !assertLength(curso.disciplinas[i], 2, `[looking for ${lookingFor}] `)
      ) {
        return {};
      }
      disciplina = {};
      [disciplina.codigo, disciplina.nome] = curso.disciplinas[i];
      lookingFor = "turma";
      disciplina.turmas = [];
      i++;
    } else if (lookingFor === "turma") {
      if (
        !assertLength(curso.disciplinas[i], 3, `[looking for ${lookingFor}] `)
      ) {
        return {};
      }
      turma = {};
      [
        turma.codigo,
        turma.numeroDeVagas,
        turma.numeroDeSolicitacoes,
      ] = curso.disciplinas[i];

      lookingFor = "horarios";
      turma.horarios = [];
      i += 2;
    } else if (lookingFor === "horarios") {
      if (
        curso.disciplinas[i].length === 1 &&
        curso.disciplinas[i][0].match("^(N|n)enhum")
      ) {
        // turma corrente está sem horário
        const copy = JSON.parse(JSON.stringify(turma));
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
        const copy = JSON.parse(JSON.stringify(turma));
        disciplina.turmas.push(copy);
        lookingFor = "turma";
        i--;
      } else if (curso.disciplinas[i].length === 2) {
        // atual é disciplina
        disciplina.turmas.push(turma);
        const copy = JSON.parse(JSON.stringify(disciplina));
        disciplinas.push(copy);
        lookingFor = "disciplina";
        i--;
      } else {
        if (
          !assertLength(curso.disciplinas[i], 3, `[looking for ${lookingFor}] `)
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
  const cursoCopy = JSON.parse(JSON.stringify(curso));
  cursoCopy.disciplinas = disciplinas;
  return cursoCopy;
}

function parseTimeOfDayToMinutesTimestamp(timeOfDay) {
  const hourAndMinute = timeOfDay.split(":");
  return parseInt(hourAndMinute[0], 10) * 60 + parseInt(hourAndMinute[1], 10);
}

function parseHorarios(_horarios) {
  if (_horarios.length === 0) {
    return {};
  }
  let inicioTimestamp = parseTimeOfDayToMinutesTimestamp(_horarios[0].inicio);
  let terminoTimestamp = parseTimeOfDayToMinutesTimestamp(_horarios[0].termino);
  const horarios = [
    {
      dias: [_horarios[0].dia],
      inicio: _horarios[0].inicio,
      termino: _horarios[0].termino,
    },
  ];
  const repeatedInicios = {};
  const repeatedTerminos = {};
  repeatedInicios[_horarios[0].inicio] = true;
  repeatedTerminos[_horarios[0].termino] = true;
  let current = 0;
  for (let i = 1; i < _horarios.length; i++) {
    const horario = _horarios[i];
    if (
      repeatedInicios[horario.inicio] === undefined ||
      repeatedTerminos[horario.termino] === undefined
    ) {
      repeatedInicios[horario.inicio] = true;
      repeatedTerminos[horario.termino] = true;
      inicioTimestamp = Math.min(
        inicioTimestamp,
        parseTimeOfDayToMinutesTimestamp(horario.inicio),
      );
      terminoTimestamp = Math.max(
        terminoTimestamp,
        parseTimeOfDayToMinutesTimestamp(horario.termino),
      );
      horarios.push({
        dias: [horario.dia],
        inicio: horario.inicio,
        termino: horario.termino,
      });
      current++;
    } else {
      horarios[current].dias.push(horario.dia);
    }
  }
  return { horarios, inicioTimestamp, terminoTimestamp };
}

function getClasses(course) {
  const turmas = [];
  for (const disciplina of course.disciplinas) {
    for (const turma of disciplina.turmas) {
      const outputTurma = {
        id: this.classId,
        codigo: turma.codigo,
        curso: { nome: course.nome, codigo: course.codigo },
        disciplina: { nome: disciplina.nome, codigo: disciplina.codigo },
        // this attribute might be null if 'turma.numeroDeVagas' == 0
        concorrencia:
          parseInt(turma.numeroDeSolicitacoes, 10) /
          parseInt(turma.numeroDeVagas, 10),
        ...parseHorarios(turma.horarios),
      };
      turmas.push(outputTurma);
      this.classId++;
    }
  }

  return turmas;
}

const CourseFormatter = {
  init() {
    this.classId = 0;
  },
  parseClasses(course, { isFormatted }) {
    if (isFormatted) {
      return getClasses.call(this, course);
    }
    const courseFormatted = formatCourse(course);
    return getClasses.call(this, courseFormatted);
  },
};

module.exports = CourseFormatter;
