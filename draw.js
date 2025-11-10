export function createDrawingState() {
  const history = [];
  const redoStack = [];

  return {
    addOperation(op) {
      history.push(op);
      redoStack.length = 0;
    },
    undo() {
      if (history.length === 0) return null;
      const op = history.pop();
      redoStack.push(op);
      return { type: "undo", op };
    },
    redo() {
      if (redoStack.length === 0) return null;
      const op = redoStack.pop();
      history.push(op);
      return { type: "redo", op };
    },
  };
}
