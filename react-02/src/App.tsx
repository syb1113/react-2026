import { AppRouter } from './router/createRouter'
import './App.css'

/**
 * App组件 - 应用的主入口组件
 * 使用模块化路由配置，路由配置在 router/index.tsx 中统一管理
 */
function App() {
  return (
    <div className="app">
      {/* 使用模块化路由配置 */}
      <AppRouter />
    </div>
  )
}

export default App
