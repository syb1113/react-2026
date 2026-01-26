import type { RouteConfig } from '../index'
import TransferPage from '@/pages/trans/TransferPage'

/**
 * 穿梭框模块的路由配置
 * 集中管理所有与穿梭框相关的路由
 */
export const transferRoutes: RouteConfig[] = [
  {
    path: '/transfer',
    element: <TransferPage />,
    meta: {
      title: '穿梭框示例',
      requiresAuth: false,
    },
  },
]

