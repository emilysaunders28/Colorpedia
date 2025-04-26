import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './sidebar.css';
import './mynav.css';
import './media.css';
import './learn.css';
import './login.css';
import './pagenav.css';
import './quiz.css';
import './homepage.css';

import App from './App';
import "bootstrap-icons/font/bootstrap-icons.css";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

