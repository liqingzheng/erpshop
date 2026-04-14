import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppRoutes from './routes'

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1677ff' } }}>
      <AntApp>
        <BrowserRouter basename="/erpshop">
          <AppRoutes />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
