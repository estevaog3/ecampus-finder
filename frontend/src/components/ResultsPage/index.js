import React from "react";
import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/index";
import Logo from "../Logo/index";
import api from "../../services/api";
import queryString from "query-string";

import { fixedEncodeURIComponent } from "../../util/index";
import "./styles.css";
import Result from "../Result/index";
import { ReactComponent as LoadingAnimation } from "./loading.svg";

function ResultsPage({ history, location }) {
  const [results, setResults] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreResults, setHasMoreResults] = useState(undefined);
  const [offset, setOffset] = useState(0);

  const limit = 10;

  const encodeQuery = (query) => {
    return fixedEncodeURIComponent(queryString.parse(query).query);
  };

  useEffect(() => {
    const getResults = async (queryEncoded, offset, limit) => {
      const res = await api.post(
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
            limit: limit,
            offset: offset,
          },
        }
      );
      return res.data;
    };
    setIsLoading(true);
    getResults(encodeQuery(location.search), offset, limit)
      .then((searchResults) => {
        if (offset === 0) {
          setResults(searchResults);
        } else {
          setResults(results.concat(searchResults));
        }
        setHasError(false);
        setHasMoreResults(searchResults.length === 10 ? true : true);
        setIsLoading(false);
      })
      .catch((e) => {
        setResults([]);
        setHasError(true);
        setHasMoreResults(false);
        setIsLoading(false);
        console.log(e.message);
      });
  }, [location.search, offset]);

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

  const onLoadMoreClick = () => {
    setOffset(offset + limit);
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
      {isLoading ? (
      <div className="body">
          <LoadingAnimation className="loading-animation" />
        </div>
      ) : hasError ? (
        <p className="message message--danger">
          Infelizmente ocorreu um erro na busca :(
        </p>
      ) : results.length > 0 ? (
        <div>
          {renderResults(results)}
          {hasMoreResults ? (
            <button onClick={onLoadMoreClick}>Carregar Mais</button>
          ) : null}
        </div>
      ) : (
        <div>
          <p className="message">Nenhum resultado encontrado :(</p>
        </div>
      )}
    </div>
  );
}

export default ResultsPage;
