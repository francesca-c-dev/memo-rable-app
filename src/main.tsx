import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './i18n/config';
import './index.css';


import outputs from "../amplify_outputs.json";
import { Amplify } from 'aws-amplify';



Amplify.configure(outputs);

const existingConfig = Amplify.getConfig();
Amplify.configure({
  ...existingConfig,
  API: {
    REST: outputs.custom.API,
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);