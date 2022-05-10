<script lang="ts" setup>
  import { AppLogo } from '@/components/Application';
  // import { AppDarkModeToggle } from '@/components/Application';
  import { useDesign } from '@/hooks/web/useDesign';
  import LoginForm from './LoginForm.vue';
  const { prefixCls } = useDesign('login');
</script>

<template>
  <div class="flex h-full w-full overflow-hidden" :class="prefixCls">
    <img src="@/assets/images/login.jpg" class="w-0 md:w-3/5 h-full" alt="" />
    <div class="w-full md:w-2/5">
      <div class="logo-bg">
        <AppLogo class="enter-x" />
      </div>
      <div class="pt-10 px-5 sm:px-20 md:px-10 xl:px-20 2xl:px-40 enter-x">
        <h1 class="text-2xl text-center text-primary font-bold enter-x">登录</h1>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;
  .@{prefix-cls} {
    .@{logo-prefix-cls} {
      padding:0;
      justify-content: center;
      .@{logo-prefix-cls}__title{
        font-size: 30px;
        color: @primary-color;
      }
      img {
        display: none;
      }
    }

    .logo-bg{
      padding:100px 0;
      margin-bottom: 40px;
      background:url(@/assets/images/login-header.png)
    }
  }
</style>
