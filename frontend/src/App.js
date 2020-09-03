import React from "react";
import "./App.css";
import Logo from "./components/Logo/index";
import SearchBar from "./components/SearchBar/index";

function App() {
  return (
    <div>
      <Logo slogan="Encontre facilmente turmas da 2º fila de matrícula da UFAM" />
      <SearchBar placeholder="disciplina, curso, horário..." />
    </div>
  );
}

export default App;
