import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { AuthProvider } from './contexts/AuthContext'; // Import your AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider> {/* Wrap your App with AuthProvider */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
