import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './i18n/config';
import './index.css';


import outputs from "../amplify_outputs.json";
import { Amplify } from 'aws-amplify';



//Amplify.configure(outputs);

console.log("full outputs", outputs)

Amplify.configure(outputs)
const existingConfig = Amplify.getConfig();

Amplify.configure({
  ...existingConfig,
  API: {
    ...existingConfig.API,
    REST: {
      statisticsApi: {
        endpoint: outputs.custom.API.statisticsApi.endpoint,
        region: outputs.custom.API.statisticsApi.region
      }
    }
  }
});


console.log('Amplify Config after setup:', Amplify.getConfig())


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);