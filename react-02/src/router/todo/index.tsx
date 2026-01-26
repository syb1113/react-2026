import type { RouteConfig } from '../index'
import TodoListPage from '@/pages/todo/TodoListPage'

/**
 * 待办事项模块的路由配置
 * 集中管理所有与待办事项相关的路由
 */
export const todoRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <TodoListPage />,
    meta: {
      title: '待办事项列表',
      requiresAuth: false,
    },
  },
  {
    path: '/todo',
    element: <TodoListPage />,
    meta: {
      title: '待办事项列表',
      requiresAuth: false,
    },
  },
]

