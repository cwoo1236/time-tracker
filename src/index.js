import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import "../src/style.scss";
import { ActivityContextProvider } from './context/ActivityContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ActivityContextProvider>
      <App />
    </ActivityContextProvider>
  </React.StrictMode>
);