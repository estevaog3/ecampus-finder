import React from "react";
import Logo from "../Logo/index";
import SearchBar from "../SearchBar/index";
import "./styles.css";

const Home = ({ history }) => {
  return (
    <div className="wrap-app">
      <Logo className="margin-bottom-lg" />
      <SearchBar
        history={history}
        placeholder="disciplina, curso, horário..."
      />
    </div>
  );
};

export default Home;
