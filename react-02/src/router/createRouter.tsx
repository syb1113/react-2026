import { useRoutes } from 'react-router-dom'
import { routes } from './index'

/**
 * 创建路由组件
 * 使用 useRoutes Hook 将路由配置转换为路由组件
 * @returns 路由组件
 */
export function AppRouter() {
  // 使用 useRoutes Hook 根据路由配置生成路由组件
  // 这是 React Router v6+ 推荐的方式，比直接使用 <Routes> 和 <Route> 更灵活
  const element = useRoutes(routes)
  
  return element
}

