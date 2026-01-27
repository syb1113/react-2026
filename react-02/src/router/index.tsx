import type { RouteObject } from 'react-router-dom'
import { todoRoutes } from './todo'
import { transferRoutes } from './transfer'
import { calendarRoutes } from "@/router/calendat";

/**
 * 路由元信息类型定义
 */
export interface RouteMeta {
  title?: string                // 页面标题
  requiresAuth?: boolean        // 是否需要认证
  icon?: string                 // 图标（用于导航菜单）
}

/**
 * 路由配置类型定义
 * 使用交叉类型（intersection type）扩展 RouteObject，添加自定义的 meta 字段
 * 这种方式可以避免接口扩展时的类型限制问题
 */
export type RouteConfig = RouteObject & {
  path: string                    // 路由路径
  element?: React.ReactElement    // 路由对应的组件（可选，因为可能使用 children）
  meta?: RouteMeta                // 路由元信息（可选）
}

/**
 * 路由配置数组
 * 集中管理所有路由配置，便于维护和扩展
 * 通过导入各个模块的路由配置，实现模块化管理
 */
export const routes: RouteConfig[] = [
  // 待办事项模块路由
  ...todoRoutes,
  // 穿梭框模块路由
  ...transferRoutes,
  ...calendarRoutes,
  // 404 页面路由（必须放在最后）
  {
    path: '*',
    element: (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>404 - 页面未找到</h2>
        <p>抱歉，您访问的页面不存在</p>
      </div>
    ),
    meta: {
      title: '404 - 页面未找到',
    },
  },
]

/**
 * 根据路径获取路由配置
 * @param path - 路由路径
 * @returns 匹配的路由配置，如果未找到则返回 undefined
 */
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return routes.find(route => route.path === path)
}

/**
 * 获取所有需要认证的路由
 * @returns 需要认证的路由配置数组
 */
export const getAuthRoutes = (): RouteConfig[] => {
  return routes.filter(route => route.meta?.requiresAuth === true)
}

