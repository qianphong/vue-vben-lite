import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { RoleEnum } from '@/enums/roleEnum';

export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: LAYOUT,
    redirect: '/dashboard/intro',
    meta: {
      icon: 'ant-design:file-text-outlined',
      title: '仪表盘',
      orderNo: 10,
    },
    children: [
      {
        path: 'intro',
        name: 'IntroPage',
        component: () => import('@/views/dashboard/intro/index.vue'),
        meta: {
          title: '介绍',
          // permission: ['enterprise'],
        },
      },
      {
        path: 'workbench',
        name: 'WorkbenchPage',
        component: () => import('@/views/dashboard/workbench/index.vue'),
        meta: {
          roles: [RoleEnum.USER],
          title: '工作台',
        },
      },
    ],
  },
] as AppRouteModule[];
