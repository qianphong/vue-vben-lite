import mime from 'mime';
import OSS from 'ali-oss';
import type { MultipartUploadOptions, ACLType } from 'ali-oss';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';

export interface OssData {
  name: string;
  ossKey: string;
  sort: number;
}
export type OssFile = UploadFile & Partial<OssData>;
const client = new OSS({
  region: 'oss-cn-hangzhou',
  bucket: 'XXXXX',
  accessKeyId: 'XXXXXXXXXXXXXXXXXXXXX',
  accessKeySecret: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  secure: true,
});

const PATH = 'filePath';
const ORIGIN = 'https://XXXXX.oss-cn-hangzhou.aliyuncs.com/';
const CHUNK_SIZE = 1024 * 1024 * 50;

export function uploadFiles(files: OssFile[], options?: { acl: ACLType }) {
  const { acl } = options || {};
  const promises = files.map(async (file, index) => {
    try {
      file.sort = index;
      if (file.ossKey) {
        return Promise.resolve(file);
      } else {
        file.status = 'uploading';
        const ossKey = generateOssKey(file);
        const uploadOptions: MultipartUploadOptions = {
          progress(p) {
            file.percent = p * 100;
          },
        };
        if (file.size && file.size > CHUNK_SIZE) {
          uploadOptions.parallel = Math.ceil(file.size / CHUNK_SIZE);
          uploadOptions.partSize = CHUNK_SIZE;
        }
        const uploadRes = await client.multipartUpload(ossKey, file.originFileObj, uploadOptions);
        if (uploadRes.res.status === 200) {
          const putAclRes = await putAcl(ossKey, acl);
          file.status = 'done';
          file.ossKey = putAclRes;
          return Promise.resolve(file);
        } else {
          file.status = 'error';
          return Promise.reject(uploadRes);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  });
  return Promise.all(promises);
}

async function putAcl(ossKey: string, acl?: ACLType) {
  try {
    if (acl) {
      const res = await client.putACL(ossKey, acl);
      if (res.status === 200) {
        return Promise.resolve(acl === 'private' ? ossKey : ORIGIN + ossKey);
      } else {
        return Promise.reject(res);
      }
    } else {
      return Promise.resolve(ossKey);
    }
  } catch (err) {
    return Promise.reject(err);
  }
}
export function getUrl(path: string, compressed = false) {
  if (path && path != 'null' && path != 'undefined') {
    if (/http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(path)) {
      return path;
    } else {
      return client.signatureUrl(
        path,
        compressed
          ? {
              process: 'image/resize,w_200,h_200',
            }
          : undefined,
      );
    }
  } else {
    return path;
  }
}

function generateOssKey(file: OssFile) {
  const mimeType = file.type || '';
  return `${PATH}/${/image/i.test(mimeType) ? 'img' : 'file'}/${file.uid}-${file.name}`;
}

export function ossData2File(data: OssData[]): OssFile[] {
  return data.map((item) => ({
    uid: item.ossKey,
    ossKey: item.ossKey,
    name: item.name,
    url: getUrl(item.ossKey),
    status: 'done',
    type: mime.getType(item.ossKey) || undefined,
  }));
}
