import React from 'react';
import { StoreProvider, useStore } from "./stores";

// import "index.css";
// import "react-hook-form.scss";
import "@/formik.css";


// cosmos.decorator.js
export default ({ children }) => <StoreProvider>{children}</StoreProvider>;