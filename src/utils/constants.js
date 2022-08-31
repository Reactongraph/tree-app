export const treeData = [
  {
    title: "node root",
    isExpanded: true,
    children: [
      {
        title: "node 1.1",
        isExpanded: true,
        children: [
          {
            title: "child 1.1.1",
            children: [
              { title: "child 1.1.1.1" },
              { title: "child 1.1.1.2" },
              { title: "child 1.1.1.3" },
            ],
          },
          { title: "child 1.1.2" },
          { title: "child 1.1.3" },
        ],
      },
      {
        title: "node 1.2",
        children: [
          { title: "child 1.2.1" },
          { title: "child 1.2.2" },
          { title: "child 1.2.3" },
        ],
      },
      {
        title: "node 1.3",
        children: [
          { title: "child 1.3.1" },
          { title: "child 1.3.2" },
          { title: "child 1.3.3" },
        ],
      },
    ],
  },
];
