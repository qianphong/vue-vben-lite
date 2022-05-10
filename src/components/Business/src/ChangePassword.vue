/** 修改密码 */
<script lang="ts" setup>
  import { toRaw } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { encryptPassword } from '@/utils/cipher';
  import { changeAdminPassword, changeUserPassword } from '@/api/sys/user';
  import { RoleEnum } from '@/enums/roleEnum';
  import { useMessage } from '@/hooks/web/useMessage';

  defineEmits(['register']);
  const { createMessage } = useMessage();
  const userStore = useUserStore();
  const changeRequest = userStore.getUserInfo.roles?.includes(RoleEnum.ADMIN)
    ? changeAdminPassword
    : changeUserPassword;

  const [registerForm, { validate, resetFields }] = useForm({
    schemas: [
      {
        field: 'oldPassword',
        label: '原密码',
        component: 'InputPassword',
        componentProps: {
          maxlenght: 25,
        },
        required: true,
      },
      {
        field: 'newPassword',
        label: '新密码',
        component: 'InputPassword',
        componentProps: {
          maxlenght: 25,
        },
        required: true,
      },
      {
        field: 'confirmPassword',
        label: '确认密码',
        component: 'InputPassword',
        componentProps: {
          maxlenght: 25,
        },
        required: true,
        dynamicRules(renderCallbackParams) {
          const password = toRaw(renderCallbackParams.model).newPassword;
          return [
            {
              required: true,
              message: '请再次输入密码',
            },
            {
              validator: (rule, value) => {
                if (value !== password) {
                  return Promise.reject(rule.message);
                } else {
                  return Promise.resolve();
                }
              },
              trigger: 'blur',
              message: '两次输入密码不一样',
            },
          ];
        },
      },
    ],
    colon: true,
    labelCol: { span: 4 },
    showActionButtonGroup: false,
  });
  const [registerModal, { changeLoading, changeOkLoading, closeModal }] = useModalInner(
    async () => {
      await resetFields();
    },
  );
  function setLoading(loading = true) {
    changeLoading(loading);
    changeOkLoading(loading);
  }
  function submit() {
    validate().then((ret) => {
      setLoading();
      changeRequest({
        newPassword: encryptPassword(ret.confirmPassword),
        oldPassword: encryptPassword(ret.oldPassword),
      })
        .then(() => {
          closeModal();
          createMessage.success('密码修改成功，请重新登录');
          userStore.logout(true);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }
</script>
<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="重置密码"
    @ok="submit"
    :min-height="50"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
