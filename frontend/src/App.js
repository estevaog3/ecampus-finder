import React from "react";
import "./App.css";
import Logo from "./components/Logo/index";
import SearchBar from "./components/SearchBar/index";

function App() {
  return (
    <div className="wrap-app">
      <Logo className="margin-bottom-lg" />
      <SearchBar placeholder="disciplina, curso, horário..." />
    </div>
  );
}

export default App;
