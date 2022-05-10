<template>
  <ConfigProvider :locale="Locale">
    <AppProvider>
      <router-view />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  // 加载语言包
  import Locale from 'ant-design-vue/es/locale/zh_CN';
  import 'dayjs/locale/zh-cn';
  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>
