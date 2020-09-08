import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as ConcorrenciaBaixaIcon } from "./thermometer-1.svg";
import { ReactComponent as ConcorrenciaMediaIcon } from "./thermometer-2.svg";
import { ReactComponent as ConcorrenciaAltaIcon } from "./thermometer-3.svg";
import { ReactComponent as ConcorrenciaCheiaIcon } from "./thermometer-4.svg";
import { ReactComponent as CalendarioIcon } from "./calendar.svg";
import { ReactComponent as InicioTerminoIcon } from "./clock.svg";

import "./styles.css";

function Result({ curso, disciplina, codigo, concorrencia, horarios }) {
  const renderConcorrencia = (concorrencia) => {
    if (concorrencia <= 0.3) {
      return (
        <ConcorrenciaBaixaIcon className="concorrencia concorrencia--baixa" />
      );
    } else if (concorrencia <= 0.6) {
      return (
        <ConcorrenciaMediaIcon className="concorrencia concorrencia--media" />
      );
    } else if (concorrencia <= 0.9) {
      return (
        <ConcorrenciaAltaIcon className="concorrencia concorrencia--alta" />
      );
    } else {
      return <ConcorrenciaCheiaIcon className="concorrencia" />;
    }
  };

  const renderHorarios = (horarios) => {
    if (horarios.length === 0) {
      return <p>Não há horários no sistema</p>;
    }
    return (
      <ul className="horarios-wrap">
        {horarios.map((horario, i) => {
          const dias = horario.dias
            .map((dia) => dia.toLowerCase().substring(0, 3))
            .join(", ");
          return (
            <li key={i}>
              <div className="horario-item">
                <CalendarioIcon className="horario-icon" />
                <p>{dias}</p>
              </div>
              <div className="horario-item">
                <InicioTerminoIcon className="horario-icon" />
                <p>
                  {horario.inicio} - {horario.termino}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="result-wrap">
      <div className="result-header">
        {renderConcorrencia(concorrencia)}
        <h2>{disciplina.nome}</h2>
      </div>
      <div className="result-body">
        <div>{renderHorarios(horarios)}</div>
        <p className="turma-curso">
          Turma {codigo} | {curso.nome} - {curso.codigo}
        </p>
      </div>
    </div>
  );
}
Result.propTypes = {
  curso: PropTypes.object.isRequired,
  disciplina: PropTypes.object.isRequired,
  codigo: PropTypes.string.isRequired,
  concorrencia: PropTypes.number.isRequired,
  horarios: PropTypes.array.isRequired,
};

export default Result;
