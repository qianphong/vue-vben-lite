import type { UserInfo } from '#/store';
import { RoleEnum } from '@/enums/roleEnum';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_utils';

export function createFakeUserList(): UserInfo[] {
  return [
    {
      userId: '1',
      userName: 'vben',
      realName: 'Vben Admin',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
      password: '123456',
      homePath: '/dashboard/intro',
      roles: [RoleEnum.ADMIN],
      token: 'fakeToken1',
    },
    {
      userId: '2',
      userName: 'test',
      password: '123456',
      realName: 'test user',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640',
      homePath: '/dashboard/workbench',
      roles: [RoleEnum.USER],
      token: 'fakeToken2',
    },
  ];
}

export default [
  {
    url: '/mock-api/user/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { userName, password } = body;
      const checkUser = createFakeUserList().find(
        (item) => item.userName === userName && password === item.password,
      );
      if (!checkUser) {
        return resultError('Incorrect account or password！');
      }
      return resultSuccess({ ...checkUser, password: undefined });
    },
  },
  {
    url: '/mock-api/getUserInfo',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    },
  },
];
