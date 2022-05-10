import type { OssData } from '@/utils/ali-oss';

export interface Contract {
  code: string;
  customerName: string;
  amount: number;
  file: OssData[];
  image1: OssData[];
  image2: OssData[];
  other: OssData[];
}
