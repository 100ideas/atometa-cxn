import React from 'react';
import { StoreProvider, useStore } from "./stores";

import "index.css";
// import 'formik.css';
// import "components/Collection/forms.css";

// cosmos.decorator.js
export default ({ children }) => <StoreProvider>{children}</StoreProvider>;