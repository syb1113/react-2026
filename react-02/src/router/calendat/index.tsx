import type { RouteConfig } from '../index'
import Calendar from '@/pages/calendar/index.tsx'

/**
 * 穿梭框模块的路由配置
 * 集中管理所有与穿梭框相关的路由
 */
export const calendarRoutes: RouteConfig[] = [
  {
    path: '/calendar',
    element: <Calendar />,
    meta: {
      title: '日历',
      requiresAuth: false,
    },
  },
]

