// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store'
import { I18nextProvider } from 'react-i18next';
import i18n from "./lib/i18n.config"
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <BrowserRouter>
  <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
  </BrowserRouter>
  </Provider>,
)
