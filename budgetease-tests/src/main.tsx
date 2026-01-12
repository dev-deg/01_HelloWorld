import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.tsx';
import './index.css';

/**
 * Application Entry Point
 *
 * Demonstrates:
 * - Redux Provider setup
 * - React 18 concurrent rendering
 * - Wrapping the app with necessary providers
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Redux Provider makes the store available to all components */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
