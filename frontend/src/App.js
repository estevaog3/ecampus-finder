import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import HomePage from "./components/HomePage/index";
import ResultsPage from "./components/ResultsPage/index";

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={HomePage} />
      <Route path="/search" exact component={ResultsPage} />
    </BrowserRouter>
  );
}

export default App;
