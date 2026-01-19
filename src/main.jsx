import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import routes from './router/index.jsx'
import { RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './assets/iconfont/iconfont.css'
import './common/base.scss'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import store from './store/index.jsx'
import zhCN from 'antd/lib/locale/zh_CN'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <App />
      <RouterProvider router={routes} />
      </Provider>
    </ConfigProvider>
  </StrictMode>,
)