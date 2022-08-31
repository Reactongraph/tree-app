import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../App.css";

const Tree = (props) => {
  const [state, setState] = useState({ treeData: [] });

  useEffect(() => {
    const { data } = props;
    if (data) {
      setState({ ...state, treeData: treeInitialization(data) });
    }
  }, []);

  const handleNodeIconClick = (node) => {
    node.isExpanded = !node.isExpanded;
    setState({ ...state, treeData: state.treeData });
    const { onIconClick } = props;
    onIconClick(node);
  };

  const handleNodeTitleClick = (node) => {
    const { onTitleClick } = props;
    onTitleClick(node);
  };

  // tree data initialization
  const treeInitialization = (treeData, path = []) => {
    if (treeData && treeData.length > 0) {
      return treeData.map((item, index) => {
        let nodePath = [...path, index];
        item.path = nodePath;
        item.isExpanded = false;
        item.children =
          item.children &&
          item.children.length &&
          treeInitialization(item.children, nodePath);
        return item;
      });
    }
  };

  // remove node from tree
  const removeNodeAtPath = (treeData, node) => {
    const { path } = node;
    let tree = treeData;
    if (
      path &&
      path.length &&
      node &&
      node.title &&
      treeData &&
      treeData.length
    ) {
      path.map((nodePath, index) => {
        if (index !== path.length - 1) {
          if (!index) {
            tree = tree[nodePath];
          } else {
            tree = tree.children[nodePath];
          }
        }
        return true;
      });
      let updatedTree = tree.children.filter(
        (child, index) => index !== path[path.length - 1] && child
      );
      tree.children = updateChildNodePath(updatedTree, tree.path);
      return treeData;
    }
  };

  // Update child node path
  const updateChildNodePath = (children, parentPath) => {
    let count = 0;
    return children.map((child) => {
      let node = { ...child, path: [...parentPath, count] };
      count += 1;
      return node;
    });
  };

  // add node in tree at specific path
  const addNodeAtPath = (treeData, node, path) => {
    let tree = treeData;
    if (
      path &&
      path.length &&
      node &&
      node.title &&
      treeData &&
      treeData.length
    ) {
      path.map((nodePath, index) => {
        tree = !index ? tree[nodePath] : tree.children[nodePath];
        return true;
      });
      if (tree.children) {
        let newNode = { ...node, path: [...tree.path, tree.children.length] };
        tree.isExpanded = true;
        if (tree.children && tree.children.length) {
          tree.children = this.updateChildNodePath(tree.children, tree.path);
          tree.children.push(newNode);
        } else tree.children = [newNode];
        return treeData;
      }
    }
  };

  // handle node drag
  const onDragEnd = async (e, node) => {
    // to copy node in localstorage
    localStorage.setItem("draggedNode", JSON.stringify(node));
    // to paste node at another place
    await setState({ ...state, draggedNode: node });
    const { onDrag } = props;
    onDrag(node);
  };

  // allow drop
  const allowDrop = (e) => e.preventDefault();

  // add and remove node on drag end
  const onDropEnd = (e, node) => {
    const { draggedNode, treeData } = state;
    let draggedNodeFromLocalStorage = JSON.parse(
      localStorage.getItem("draggedNode")
    );

    let updatedTree;
    // If dragged and dropped in same window
    if (draggedNode && Object.keys(draggedNode).length && node.children) {
      updatedTree = removeNodeAtPath(treeData, draggedNode);
      setState({
        ...state,
        treeData: addNodeAtPath(updatedTree, draggedNode, node.path),
        draggedNode: {},
      });
    }

    // If dragged and dropped in different window
    else if (
      draggedNodeFromLocalStorage &&
      Object.keys(draggedNodeFromLocalStorage).length &&
      node.children
    ) {
      localStorage.removeItem("draggedNode");
      setState({
        ...state,
        treeData: addNodeAtPath(
          treeData,
          draggedNodeFromLocalStorage,
          node.path
        ),
      });
    }
    const { onDrop } = props;
    onDrop(node);
  };

  const renderTree = (treeData) => {
    return (
      <ul>
        {treeData &&
          treeData.length > 0 &&
          treeData.map((node) => {
            const { isExpanded, title, children, path } = node;
            return (
              <li key={path}>
                <div>
                  <span
                    className="node-title"
                    draggable
                    onDragStart={(e) => onDragEnd(e, node)}
                    onDrop={(e) => onDropEnd(e, node)}
                    onDragOver={(e) => allowDrop(e)}
                  >
                    {children && (
                      <img
                        alt={"icon"}
                        onClick={() => handleNodeIconClick(node)}
                        className={isExpanded ? "rotate-on-90" : ""}
                        src={"./right-arrow.svg"}
                      />
                    )}
                    <span onClick={() => handleNodeTitleClick(node)}>
                      {title}
                    </span>
                  </span>
                  {isExpanded &&
                    children &&
                    children.length > 0 &&
                    renderTree(children)}
                </div>
              </li>
            );
          })}
      </ul>
    );
  };

  return (
    <div>
      <h2>Tree View</h2>
      {renderTree(state?.treeData)}
    </div>
  );
};

// default props
Tree.defaultProps = {
  onDrag: () => {},
  onDrop: () => {},
  onTitleClick: () => {},
  onIconClick: () => {},
};

// props decleration
Tree.propTypes = {
  data: PropTypes.array.isRequired,
  onDrag: PropTypes.func,
  onDrop: PropTypes.func,
  onTitleClick: PropTypes.func,
  onIconClick: PropTypes.func,
};

export default Tree;
