import { defHttp } from '@/utils/http/axios';
import {
  LoginParams,
  AdminLoginResultModel,
  UserLoginResultModel,
  ChangePasswordParams,
} from './model/userModel';
export * from './model/userModel';
import { ErrorMessageMode } from '#/axios';

/**
 * @description: 管理员登录 api
 */
export function adminLogin(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<AdminLoginResultModel>(
    {
      url: '/admin/login',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 管理员修改密码
 */
export function changeAdminPassword(params: ChangePasswordParams) {
  return defHttp.put({
    url: '/admin/password',
    params,
  });
}
/**
 * @description: 用户登录 api
 */
export function userLogin(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<UserLoginResultModel>(
    {
      url: '/user/login',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 用户修改密码
 */
export function changeUserPassword(params: ChangePasswordParams) {
  return defHttp.put({
    url: '/user/password',
    params,
  });
}
