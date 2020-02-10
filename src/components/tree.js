import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

class Tree extends Component {

  constructor(props){
    super(props);
    this.state = {
      treeData: []
    }
  }

  componentDidMount() {
      const { data } = this.props;
      if(data)
        this.setState({ treeData: this.treeInitialization(data) })
  }
  

  // on tree node icon click, handle expand and collapse of tree
  handleNodeIconClick = node => {
    node.isExpanded = !node.isExpanded;
    this.setState({treeData: this.state.treeData}); 
    const { onIconClick } = this.props;
    onIconClick(node)
  }
  
  // on tree node title clcik
  handleNodeTitleClick = node => {
    const { onTitleClick } = this.props;
    onTitleClick(node)
  }

  // tree data initialization
  treeInitialization = (treeData, path = []) => {
    if(treeData && treeData.length>0 ){
      return treeData.map((item,index)=>{
        let nodePath = [...path,index];
        item.path = nodePath;
        item.isExpanded = false;
        item.children = item.children && item.children.length && this.treeInitialization(item.children, nodePath);
        return item;
      });
    }
  }

  // remove node from tree
  removeNodeAtPath = (treeData, node) => {
    const { path } = node;
    let tree = treeData;
    if(path && path.length && node && node.title && treeData && treeData.length){
      path.map((nodePath, index)=> {
        if(index !== path.length -1){
          if(!index){
            tree = tree[nodePath];
          }else{
            tree = tree.children[nodePath];
          }
        }
        return true
      });
      let updatedTree = tree.children.filter((child, index) => index !== path[path.length-1] && child)
      tree.children = this.updateChildNodePath(updatedTree, tree.path)
      return treeData;
    }
  }

  // Update child node path
  updateChildNodePath = (children, parentPath) => {
    let count = 0;
     return children.map(child => {
      let node = {...child, path:[...parentPath,count]};
      count += 1;
      return node;
    });

  }

  // add node in tree at specific path
  addNodeAtPath = (treeData, node, path) => {
    let tree = treeData;
    if(path && path.length && node && node.title && treeData && treeData.length){
      path.map((nodePath, index)=> {
          tree = !index ? tree[nodePath] : tree.children[nodePath];
          return true;
       });
      if(tree.children){
        let newNode = { ...node, path: [ ...tree.path, tree.children.length] }
        tree.isExpanded = true;
        if(tree.children && tree.children.length){
          tree.children = this.updateChildNodePath(tree.children, tree.path);
          tree.children.push(newNode);
        }
        else
          tree.children = [newNode];
        return treeData;
      }
    }
  }

  // handle node drag
  onDragEnd = async (e, node) => {
    // to copy node in localstorage
    localStorage.setItem('draggedNode', JSON.stringify(node));
    // to paste node at another place
    await this.setState({ draggedNode: node});
    const { onDrag } = this.props;
    onDrag(node);
  }

  // allow drop
  allowDrop = e => e.preventDefault();
  
  // add and remove node on drag end
  onDropEnd = (e, node) => {
    const { draggedNode, treeData } = this.state;
    let draggedNodeFromLocalStorage = JSON.parse(localStorage.getItem('draggedNode'))
    
    let updatedTree;
    // If dragged and dropped in same window
    if(draggedNode && Object.keys(draggedNode).length && node.children){
      updatedTree = this.removeNodeAtPath(treeData, draggedNode);
      this.setState({treeData: this.addNodeAtPath(updatedTree, draggedNode, node.path), draggedNode: {} }) ;
    }

    // If dragged and dropped in different window
    else if(draggedNodeFromLocalStorage && Object.keys(draggedNodeFromLocalStorage).length && node.children){
        localStorage.removeItem('draggedNode')
        this.setState({treeData: this.addNodeAtPath(treeData, draggedNodeFromLocalStorage, node.path) }) ;
    }
    const { onDrop } = this.props;
    onDrop(node)
  }

  renderTree = (treeData) => {
    return <ul>{
      treeData 
      && treeData.length>0 
      && treeData.map((node)=>{
      const { isExpanded, title, children, path} = node;
      return <li key={path}>
        <div>
          <span className="node-title" draggable onDragStart={(e)=> this.onDragEnd(e, node)} onDrop={ e=> this.onDropEnd(e, node)} onDragOver={e => this.allowDrop(e)}>
          {children && <img alt={"icon"} onClick={() => this.handleNodeIconClick(node)} className={isExpanded ? 'rotate-on-90' : ''} src={'./right-arrow.svg'}/>}
          <span onClick={() =>this.handleNodeTitleClick(node)}>{title}</span>
          </span>
          {
            isExpanded 
            && children 
            && children.length>0 
            && this.renderTree(children)
          }
        </div></li>})
    }</ul>
  }

  render(){
    return (
      <div>
        <h2>Tree View</h2>
          {this.renderTree(this.state.treeData)}
      </div>
    );
  }
}

// default props
Tree.defaultProps = {
    onDrag: () => {},
    onDrop: () => {},
    onTitleClick: () => {},
    onIconClick: () => {},
}

// props decleration
Tree.propTypes = {
    data: PropTypes.array.isRequired,
    onDrag: PropTypes.func,
    onDrop: PropTypes.func,
    onTitleClick: PropTypes.func,
    onIconClick: PropTypes.func,
};

export default Tree;
