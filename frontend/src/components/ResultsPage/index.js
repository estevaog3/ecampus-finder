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
  const [daysFilter, setDaysFilter] = useState(SEARCH_DAYS);
  const [startTimeFilter, setStartTimeFilter] = useState("00:00");
  const [endTimeFilter, setEndTimeFilter] = useState("23:59");
  const [hasFilterChanged, setHasFilterChanged] = useState(false);

  const encodeQuery = (query) => {
    return fixedEncodeURIComponent(queryString.parse(query).query);
  };

  const getResults = (queryEncoded, offset, limit, filter) => {
    const res = api.post(
      "/search",
      {
        filter: parseFilter(filter),
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

  const parseFilter = ({ daysFilter, startTimeFilter, endTimeFilter }) => {
    const startTimestampMin =
      parseInt(startTimeFilter.split(":")[0]) * 60 +
      parseInt(startTimeFilter.split(":")[1]);
    const endTimestampMin =
      parseInt(endTimeFilter.split(":")[0]) * 60 +
      parseInt(endTimeFilter.split(":")[1]);
    return {
      days: daysFilter.map(({ value }) => value),
      startTimestampMin,
      endTimestampMin,
    };
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

  const doSearch = () => {
    setIsLoading(true);
    searchParams.offset = 0;
    getResults(
      encodeQuery(location.search),
      searchParams.offset,
      searchParams.limit,
      { daysFilter, startTimeFilter, endTimeFilter }
    )
      .then((res) => {
        const searchResults = res.data;
        setResults(searchResults);
        setHasMoreResults(
          searchResults.length === searchParams.limit ? true : false
        );
        setIsLoading(false);
        setHasFilterChanged(false);
      })
      .catch((e) => {
        handleSearchError(e);
        setIsLoading(false);
        setHasFilterChanged(false);
      });
  };

  useEffect(() => {
    doSearch();
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
      searchParams.limit,
      { daysFilter, startTimeFilter, endTimeFilter }
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
            value={daysFilter}
            onChange={(newValues) => {
              setHasFilterChanged(true);
              setDaysFilter(newValues);
            }}
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
              value={startTimeFilter}
              onChange={(e) => {
                setHasFilterChanged(true);
                setStartTimeFilter(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="endTime">até</label>
            <input
              type="time"
              name="endTime"
              id="endTime"
              value={endTimeFilter}
              onChange={(e) => {
                setHasFilterChanged(true);
                setEndTimeFilter(e.target.value);
              }}
            />
          </div>
        </div>
        <Button
          text="Aplicar"
          isSmall
          disabled={!hasFilterChanged}
          onClick={doSearch}
        ></Button>
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
          <Button
            text="Carregar Mais"
            onClick={onLoadMoreClick}
            disabled={hasFilterChanged}
          >
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
