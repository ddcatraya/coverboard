import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApiProvider,
  SizesProvider,
  CoverProvider,
  ToastProvider,
} from 'contexts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <ToastProvider>
    <ApiProvider>
      <CoverProvider>
        <SizesProvider>
          <App />
        </SizesProvider>
      </CoverProvider>
    </ApiProvider>
  </ToastProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();