import React from "react";
import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/index";
import Logo from "../Logo/index";
import api from "../../services/api";
import queryString from "query-string";

import { fixedEncodeURIComponent } from "../../util/index";
import "./styles.css";
import Result from "../Result/index";

function ResultsPage({ history, location }) {
  const [results, setResults] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadResults = async (queryEncoded) => {
      try {
        const searchResults = await api.post(
          "/search",
          {
            filter: {
              startTimestampsMin: [1],
              endTimestampsMin: [1440],
              days: ["seg", "ter", "qua", "qui", "sex", "sab"],
            },
          },
          {
            params: {
              query: queryEncoded,
              limit: 10,
            },
          }
        );
        setResults(searchResults.data);
        setHasError(false);
      } catch (e) {
        setResults([]);
        setHasError(true);
        console.log(e.message);
      }
    };

    const parsed = queryString.parse(location.search);
    const queryEncoded = fixedEncodeURIComponent(parsed.query);
    loadResults(queryEncoded);
  }, [location.search]);

  const renderResults = (results) => {
    return (
      <ul className="results">
        {results.map((result, i) => (
          <li key={i}>
            <Result {...result} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="results-page-wrap">
      <header className="header">
        <Logo className="title--small" />
        <SearchBar
          placeholder="disciplina, curso, horário..."
          history={history}
          initialQuery={queryString.parse(location.search).query}
        />
      </header>
      {results.length > 0 ? (
        renderResults(results)
      ) : hasError ? (
        <p className="message message--danger">
          Infelizmente ocorreu um erro na busca :(
        </p>
      ) : (
        <div>
          <p className="message">Nenhum resultado encontrado :(</p>
        </div>
      )}
    </div>
  );
}

export default ResultsPage;
