import React from 'react';
import { StoreProvider, useStore } from "./stores";

// import "index.css";
// import "react-hook-form.scss";
// import "@/formik.css";
import "./formik.css";

if (module.hot) { 
  console.log('module.hot?', module.hot) 
}

// cosmos.decorator.js
export default ({ children }) => <StoreProvider>{children}</StoreProvider>;