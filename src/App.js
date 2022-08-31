import React from "react";
import Tree from "./components/tree";
import { treeData } from "./utils/constants";
import "./App.css";

const App = () => {
  return <Tree data={treeData}></Tree>;
};

export default App;
