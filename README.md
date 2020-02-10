# tree-app
tree ui component for react

## install

[![rc-tree](https://nodei.co/npm/rc-tree.png)](https://npmjs.org/package/rc-tree)

## API

### Tree props

| name | description | type | default |
| --- | --- | --- | --- |
| data | treeNodes data Array, if set it then you need not to construct children TreeNode. (value should be unique across the whole array) | array<{title,children,isExpanded}> | false |
| onDrag | on drag start of  a node | function(node) | - |
| onDrop | on drop of  a node | function(node) | - |
| onTitleClick | on click of node title | function(node) | - |
| onIconClick | on click of node icon(expand and collapse) | function(node) | - |


## Development

```bash
npm install
npm start
```
