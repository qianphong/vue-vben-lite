import { useLocalStorage } from '@vueuse/core';

const cacheRef = useLocalStorage<Record<string, number>>('PAGESIZE_CACHE', {});
export function useCachePageSize(cacheKey: string, initialValue = 10) {
  const pageSize = cacheRef.value[cacheKey] ?? initialValue;
  const setPageSize = ({ pageSize }: { pageSize: number }) => {
    cacheRef.value[cacheKey] = pageSize;
  };
  return [pageSize, setPageSize] as const;
}
