<script lang="ts" setup>
  import { reactive, ref, unref } from 'vue';
  import { Form, FormItem, InputPassword, Input, Switch } from 'ant-design-vue';
  import type { ValidationRule } from 'ant-design-vue/lib/form/Form';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useUserStore } from '@/store/modules/user';
  import { encryptPassword } from '@/utils/cipher';
  import { userLogin } from '@/api/sys/user';

  const isAdmin = ref(false);
  const formRef = ref();
  const loading = ref(false);
  const userStore = useUserStore();
  const { notification, createErrorModal } = useMessage();
  const rules: Recordable<ValidationRule[]> = {
    account: [
      {
        required: true,
        message: '请输入账号',
        trigger: 'change',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
        trigger: 'change',
      },
    ],
  };
  const formData = reactive({
    account: '',
    password: '',
  });

  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data;
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      let { account, password } = data;
      password = encryptPassword(password);
      await login({ account, password });
    } catch (error) {
      createErrorModal({
        title: '错误提示',
        content: (error as unknown as Error).message || '网络异常，请检查您的网络连接是否正常!',
      });
    } finally {
      loading.value = false;
    }
  }

  async function login(data: { account: string; password: string }) {
    const userInfo = await userLogin(
      {
        password: data.password,
        userName: data.account,
      },
      'none',
    );
    const token = btoa(
      JSON.stringify({
        Token: userInfo.token,
        UserId: userInfo.userId,
      }),
    );
    await userStore.login({
      userInfo,
      token,
    });
    notification.success({
      message: '登录成功',
      description: `欢迎回来: ${userInfo.userName}`,
      duration: 3,
    });
  }
</script>

<template>
  <div>
    <Form
      class="enter-x"
      :model="formData"
      :rules="rules"
      ref="formRef"
      @keypress.enter="handleLogin"
    >
      <div class="pt-10"> </div>
      <FormItem name="account" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.account"
          placeholder="请输入账号"
          class="fix-auto-fill"
        />
      </FormItem>
      <div class="py-2"></div>
      <FormItem name="password" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.password"
          placeholder="请输入密码"
        />
      </FormItem>
      <FormItem class="enter-x"> 管理员登录： <Switch v-model:checked="isAdmin" /> </FormItem>
      <div class="py-5"></div>
      <FormItem class="enter-x">
        <AButton type="primary" size="large" block @click="handleLogin" :loading="loading">
          登录
        </AButton>
      </FormItem>
    </Form>
  </div>
</template>
