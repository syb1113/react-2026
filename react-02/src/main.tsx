import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // 引入 BrowserRouter 用于路由
import './index.css'
import App from './App.tsx'

/**
 * 应用入口文件
 * 使用 BrowserRouter 包裹整个应用，启用路由功能
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter 提供路由上下文，使整个应用可以使用路由功能 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
