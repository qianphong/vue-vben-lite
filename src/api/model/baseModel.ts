export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  data: T[];
  total: number;
}

export interface PermissionGroup {
  groupName: string;
  details: {
    permissionId: number;
    name: string;
    selected: boolean;
  }[];
}
