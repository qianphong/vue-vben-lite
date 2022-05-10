<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
      <Icon icon="ant-design:caret-down-outlined" color="#333" class="ml-1" />
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem tkey="changePassword" text="修改密码" icon="ant-design:edit-outline" />
        <MenuDivider />
        <MenuItem
          v-if="getUseLockPage"
          tkey="lock"
          text="锁定屏幕"
          icon="ion:lock-closed-outline"
        />
        <MenuItem tkey="logout" text="退出系统" icon="ion:power-outline" />
      </Menu>
    </template>
  </Dropdown>
  <ChangePassword @register="registerChange" />
  <LockAction @register="register" />
</template>
<script lang="ts">
  // components
  import { Dropdown, Menu } from 'ant-design-vue';
  import { defineComponent, ref, computed } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useModal } from '@/components/Modal';
  import { Icon } from '@/components/Icon';

  import defaultAvatar from '@/assets/images/avatar.png';
  import { propTypes } from '@/utils/propTypes';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { RoleEnum } from '@/enums/roleEnum';

  import { ChangePassword } from '@/components/Business';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      MenuDivider: Menu.Divider,
      Icon,
      ChangePassword,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const modalRef = ref<{ openModal: Fn }>();
      const getUserInfo = computed(() => {
        const { realName = '', avatar, roles, enterprise = [] } = userStore.getUserInfo || {};
        return {
          realName,
          avatar: avatar || defaultAvatar,
          isAdmin: roles?.includes(RoleEnum.ADMIN),
          enterprise,
        };
      });
      const showSwitch = computed(() => {
        if (getUserInfo.value.isAdmin) {
          return false;
        } else {
          return getUserInfo.value.enterprise.length > 1;
        }
      });
      const [register, { openModal }] = useModal();
      const [registerChange, { openModal: openChangeModal }] = useModal();

      function handleLock() {
        openModal(true);
      }

      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      function handleChange() {
        openChangeModal(true, {});
      }

      function handleMenuClick(e: any) {
        switch (e.key) {
          case 'logout':
            handleLoginOut();
            break;
          case 'lock':
            handleLock();
            break;
          case 'changePassword':
            handleChange();
            break;
        }
      }

      return {
        prefixCls,
        showSwitch,
        getUserInfo,
        modalRef,
        handleMenuClick,
        registerChange,
        register,
        getUseLockPage,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
