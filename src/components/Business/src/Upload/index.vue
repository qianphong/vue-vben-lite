<script lang="ts" setup>
  import { computed, nextTick } from 'vue';
  import { Upload } from 'ant-design-vue';
  import { type OssFile } from '@/utils/ali-oss';
  import { Icon } from '@/components/Icon';
  import { useUploadType } from '@/components/Upload/src/useUpload';
  import { createImgPreview } from '@/components/Preview/index';

  const props = defineProps({
    value: { type: Array as PropType<OssFile[]>, required: true },
    accept: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });
  const emit = defineEmits(['update:value']);

  const { getStringAccept, getHelpText } = useUploadType({
    acceptRef: props.accept,
  });

  const listType = computed(() => {
    return props.accept.includes('image/*') ? 'picture-card' : 'picture';
  });
  const fileList = computed<OssFile[]>({
    get() {
      return props.value;
    },
    set(val) {
      emit('update:value', val);
    },
  });
  // 关闭自动上传
  function beforeUpload() {
    return false;
  }

  function handlePreview(file: OssFile) {
    if (!file.type) {
      return;
    }
    if (file.type.startsWith('image')) {
      const url = file.url ? file.url : URL.createObjectURL(file.originFileObj) || '';
      createImgPreview({
        imageList: [url],
        onClose() {
          // 调用revokeObjectURL() 使这个潜在的对象回到原来的地方，允许平台在合适的时机进行垃圾收集。
          nextTick(() => {
            URL.revokeObjectURL(url);
          });
        },
      });
      return;
    }
    if (file.type === 'application/pdf') {
      window.open(file.url);
    }
  }
</script>
<template>
  <Upload
    v-model:file-list="fileList"
    :list-type="listType"
    :beforeUpload="beforeUpload"
    :accept="getStringAccept"
    :multiple="true"
    @preview="handlePreview"
  >
    <AButton v-if="listType === 'picture'" type="primary">
      <Icon icon="ant-design:upload-outlined" />
      选择文件
    </AButton>
    <div v-else>
      <Icon icon="ant-design:plus-outlined" />
      <div>上传</div>
    </div>
  </Upload>
  <span>{{ getHelpText }}</span>
</template>
