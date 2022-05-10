import { defHttp } from '@/utils/http/axios';
import { Contract } from './model';
import { BasicFetchResult } from '../model/baseModel';
export * from './model';

/**
 * @description: 合同列表
 */
export function getContractList(params: Recordable) {
  return defHttp.get<BasicFetchResult<Contract>>({
    url: '/contract/${page}/${num}',
    params,
  });
}

/**
 * @description: 合同导出
 */
export function getExportContractList(params: Recordable) {
  return defHttp.get<Pick<Contract, 'code' | 'customerName' | 'amount'>[]>({
    url: '/contract/export',
    params,
  });
}
