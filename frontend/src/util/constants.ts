export const operations: { [name: string]: string } = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
};

export const operationsInverse: { [name: string]: string } = Object.keys(operations).reduce((all: { [name: string]: string }, cur) => {
  all[operations[cur]] = cur;
  return all;
}, {});
