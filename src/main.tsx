import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './i18n/config';
import './index.css';

import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { Amplify } from 'aws-amplify';
import { Schema } from '../amplify/data/resource';


Amplify.configure(outputs);
generateClient<Schema>({
  authMode: "userPool",
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);