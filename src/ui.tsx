import React, { useState } from "react";
import * as ReactDOM from "react-dom";

import parserBabel from "prettier/parser-babel";
import prettier from "prettier/standalone";

import "./ui.css";


declare function require(path: string): any;

function App() {
  const [code, setCode] = useState('');

  onmessage = (event) => {
    const formatedCode = prettier.format(event.data.pluginMessage, {
      parser: 'babel',
      plugins: [parserBabel],
    });
    setCode(formatedCode);
  }

  return (
    <main>
      {!code ? <h3>Select something</h3> : null}
      <pre>{code}</pre>
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById("react-page"));
