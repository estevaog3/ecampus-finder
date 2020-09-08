import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as ConcorrenciaBaixaIcon } from "./thermometer-1.svg";
import { ReactComponent as ConcorrenciaMediaIcon } from "./thermometer-2.svg";
import { ReactComponent as ConcorrenciaAltaIcon } from "./thermometer-3.svg";
import { ReactComponent as ConcorrenciaCheiaIcon } from "./thermometer-4.svg";

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

  return (
    <div className="result-wrap">
      <div className="result-header">
        {renderConcorrencia(concorrencia)}
        <h2>{disciplina.nome}</h2>
      </div>
      <div className="result-body">
        <div>
          {
            // TODO: adicionar renderização dos horários
          }
        </div>
        <p>
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
