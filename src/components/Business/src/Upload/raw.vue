<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { Icon } from '@/components/Icon';

  const emit = defineEmits<{ (e: 'change', payload?: string): void }>();
  const uploadInput = ref<HTMLInputElement>();
  const { createMessage } = useMessage();
  const loading = ref(false);

  function handleDrop(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (loading.value) return;
    const files = e.dataTransfer?.files;
    if (files?.length !== 1) {
      createMessage.error({ content: '仅支持选择单个文件' });
      return;
    }
    const rawFile = files[0];
    if (!isExcel(rawFile.name)) {
      createMessage.error({ content: '仅支持上传 .xlsx, .xls, .csv 类型文件' });
    }
    upload(rawFile);
  }

  function handleDragover(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }
  // 点击触发input的点击事件
  function handleUpload() {
    uploadInput.value?.click();
  }
  // input 文件变化
  function handleChange() {
    if (uploadInput.value) {
      const files = uploadInput.value.files;
      if (files && files.length) {
        upload(files[0]);
      }
    }
  }
  function upload(file: File) {
    if (uploadInput.value) {
      uploadInput.value.files = null;
      uploadInput.value.value = '';
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      loading.value = false;
      if (reader.result) {
        emit('change', reader.result.toString().split(',')[1]);
      }
    });
  }
  function isExcel(name: string) {
    return /\.(xlsx|xls|csv)$/.test(name);
  }
</script>
<template>
  <div>
    <div
      class="upload-dragger"
      @click="handleUpload"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
    >
      <Icon icon="ant-design:cloud-upload-outlined" size="60" />
      <div>
        <div><em>点击</em>或将文件拖到这里上传</div>
        <div class="text-xs"> 只能支持扩展名：.xlsx/.xls文件</div>
      </div>
      <input
        ref="uploadInput"
        class="hidden"
        type="file"
        accept=".xlsx,.xls"
        @change="handleChange"
      />
    </div>
  </div>
</template>
<style lang="less">
  .upload-dragger {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    max-width: 100%;
    width: 360px;
    height: 180px;
    text-align: center;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      border-color: #0960bd;
    }
  }
</style>
