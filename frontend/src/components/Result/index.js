import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as CalendarioIcon } from "./calendar.svg";
import { ReactComponent as InicioTerminoIcon } from "./clock.svg";

import "./styles.css";

function Result({ curso, disciplina, codigo, horarios }) {
  const renderHorarios = (horarios) => {
    if (!horarios || horarios.length === 0) {
      return (
        <div className="horarios-empty">
          <p>Não há horários no sistema</p>
        </div>
      );
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
        <h2 className="result-header__title">{disciplina.nome}</h2>
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
  horarios: PropTypes.array.isRequired,
};

export default Result;
