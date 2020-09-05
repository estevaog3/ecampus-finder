import React from "react";
import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/index";
import Logo from "../Logo/index";
import api from "../../services/api";

function ResultsPage({ history, match }) {
  const [results, setResults] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadResults = async (query) => {
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
              // TODO: codificar 'query' para resolver este erro:
              // Response status 400: Parameter 'query' must be url encoded. It's value may not contain reserved characters
              query: query,
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

    loadResults(match.params.query);
  }, [match.params.query]);

  return (
    <div>
      <header>
        <Logo />
        <SearchBar
          placeholder="disciplina, curso, horário..."
          history={history}
          initialQuery={match.params.query}
        />
      </header>
      {results.length > 0 ? (
        <ul>
          {results.map((result, i) => (
            <li key={i}>{JSON.stringify(result)}</li>
          ))}
        </ul>
      ) : hasError ? (
        <p>Infelizmente ocorreu um erro na busca :(</p>
      ) : (
        <p>Nenhum resultado encontrado :(</p>
      )}
    </div>
  );
}

export default ResultsPage;
