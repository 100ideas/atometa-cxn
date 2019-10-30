import React from 'react';
import { observer } from "mobx-react-lite";

import { hot, setConfig } from 'react-hot-loader';
setConfig({ logLevel: 'debug' });

import { StoreProvider, useStore } from "./stores";

// document.addEventListener('dragenter', ev => console.log('document.dragenter', ev))

const App = () => (
  <main id="rootmain">
    <h1>
      Hello, mobx
    </h1>

    <StoreProvider>
      <div>

        <div className="main-grid-cell" key={1}>
          add cssgird!
        </div>

        <div className="main-grid-cell" key={2}>
          add cssgird!
        </div>

      </div>
    </StoreProvider>

  </main>
);

// export default App;
export default hot(module)(App);
