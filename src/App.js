import React from 'react';
import './App.css';
import Tree from './components/tree';
import { treeData } from './utils/constants';

class App extends React.Component {

  render(){
    return (
      <Tree data={treeData}></Tree>
    );
  }
}

export default App;
