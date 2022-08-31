import React from "react";
import "./App.css";
import Tree from "./components/tree";
import { treeData } from "./utils/constants";

const App = () => {
  return <Tree data={treeData}></Tree>;
};

export default App;
