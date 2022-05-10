import { UserInfo } from '#/store';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  userName: string;
  password: string;
}
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}
/**
 * @description: 管理员登录 return value
 */
export interface AdminLoginResultModel {
  adminId: number;
  userName: string;
  passwordNeedModify: boolean;
  token: string;
  permission: Permission;
}

export interface Permission {
  enterprise: boolean;
  account: boolean;
  accountDetail: {
    admin: boolean;
    enterprise: boolean;
  };
  data: boolean;
  dataDetail: {
    contract: boolean;
  };
}

/**
 * @description: 用户登录 return value
 */
export type UserLoginResultModel = UserInfo;
