import React from "react";
import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/index";
import Logo from "../Logo/index";
import Button from "../Button/index";
import api from "../../services/api";
import queryString from "query-string";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "react-multi-select-component";
import { fixedEncodeURIComponent } from "../../util/index";
import "./styles.css";
import Result from "../Result/index";
import { ReactComponent as LoadingAnimation } from "./loading.svg";

let searchParams = {
  // Importante:
  // este objeto não pode ser declarado dentro do componente abaixo.
  // Caso contrário, não será possível escrever os seus atributos em uma função arrow.
  // TODO: investigar o motivo de isso acontecer
  offset: 0,
  limit: 10,
};

const SEARCH_DAYS = [
  { label: "Seg", value: "segunda" },
  { label: "Ter", value: "terça" },
  { label: "Qua", value: "quarta" },
  { label: "Qui", value: "quinta" },
  { label: "Sex", value: "sexta" },
  { label: "Sáb", value: "sábado" },
];

function ResultsPage({ history, location }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreResults, setHasMoreResults] = useState(undefined);
  const [searchDays, setSearchDays] = useState(SEARCH_DAYS);

  const encodeQuery = (query) => {
    return fixedEncodeURIComponent(queryString.parse(query).query);
  };

  const getResults = (queryEncoded, offset, limit) => {
    const res = api.post(
      "/search",
      {
        filter: {
          startTimestampMin: 1,
          endTimestampMin: 1440,
          days: ["segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
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
    return res;
  };

  const handleSearchError = (e) => {
    notifyError("Houve um erro na operação :(");
    console.log(e.message);
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    searchParams.offset = 0;
    getResults(
      encodeQuery(location.search),
      searchParams.offset,
      searchParams.limit
    )
      .then((res) => {
        const searchResults = res.data;
        setResults(searchResults);
        setHasMoreResults(
          searchResults.length === searchParams.limit ? true : false
        );
        setIsLoading(false);
      })
      .catch((e) => {
        handleSearchError(e);
        setIsLoading(false);
      });
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

  const onLoadMoreClick = () => {
    setIsLoading(true);
    getResults(
      encodeQuery(location.search),
      searchParams.offset + searchParams.limit,
      searchParams.limit
    )
      .then((res) => {
        const searchResults = res.data;
        setResults(results.concat(searchResults));
        setHasMoreResults(
          searchResults.length === searchParams.limit ? true : false
        );
        setIsLoading(false);
        searchParams.offset = searchParams.offset + searchParams.limit;
      })
      .catch((e) => {
        handleSearchError(e);
        setIsLoading(false);
      });
  };

  const onLogoClick = () => {
    history.push("/");
  };

  return (
    <div className="results-page-wrap">
      <header className="header">
        <Logo className="title--small" onClick={onLogoClick} />
        <SearchBar
          placeholder="disciplina, curso, horário..."
          history={history}
          initialQuery={queryString.parse(location.search).query}
        />
      </header>
      <div className="filter">
        <div className="filter__days">
          <div>Dias da semana:</div>
          <MultiSelect
            options={SEARCH_DAYS}
            value={searchDays}
            onChange={setSearchDays}
            labelledBy="Selecione"
            disableSearch
            overrideStrings={{
              allItemsAreSelected: "Qualquer dia",
              clearSelected: "Clear Selected",
              selectAll: "Selecionar todos",
              selectSomeItems: "Selecione...",
            }}
          />
        </div>
        <div className="filter__time">
          <div>
            <label htmlFor="startTime">De</label>
            <input
              type="time"
              name="startTime"
              id="startTime"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endTime">até</label>
            <input
              type="time"
              name="endTime"
              id="endTime"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="body">
        {renderResults(results)}
        {results.length === 0 ? (
          isLoading ? (
            <LoadingAnimation className="loading-animation" />
          ) : (
            <p className="message">Nenhum resultado encontrado :(</p>
          )
        ) : hasMoreResults ? (
          <Button text="Carregar Mais" onClick={onLoadMoreClick}>
            {isLoading ? (
              <LoadingAnimation className="loading-animation" />
            ) : null}
          </Button>
        ) : null}
        <ToastContainer />
      </div>
    </div>
  );
}

export default ResultsPage;
