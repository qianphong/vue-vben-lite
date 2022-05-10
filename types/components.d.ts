declare module 'vue' {
  export interface GlobalComponents {
    AButton: typeof import('../src/components/Button/src/BasicButton.vue')['default'];
  }
}
export {};
