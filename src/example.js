import {
  Runtime,
  Library,
  Inspector,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "https://api.observablehq.com/@d3/histogram.js?v=3";

// Instantiate the standard library so we can use Generators.observe (optional).
const library = new Library();

// Instantiate the notebook.
const runtime = (self.runtime = new Runtime(library));
const main = runtime.module(notebook, (name) => {
  if (name === "chart") {
    return new Inspector(document.querySelector("#chart"));
  }
});

// Redefine the cell “data” as a generator that emits new data in response to
// web socket messages. (Note: if you need to terminate this generator in the
// future, call generator.return or runtime.dispose.)
main.redefine(
  "data",
  library.Generators.observe((notify) => {
    const data = [];
    data.x = "Size (KB)";
    data.y = "Count";
    const socket = new WebSocket("wss://ws.blockchain.info/inv");
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ op: "unconfirmed_sub" }));
    });
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.op === "utx") {
        data.push(Math.min(999, message.x.size));
        notify(data);
      }
    });
    return () => socket.close();
  })
);
