import React from 'react';
import { StoreProvider, useStore } from "./stores";

import "index.css";

// cosmos.decorator.js
export default ({ children }) => <StoreProvider>{children}</StoreProvider>;