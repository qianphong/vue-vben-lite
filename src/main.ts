import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '@/design/index.less';
import 'virtual:windi-utilities.css';
import 'virtual:svg-icons-register';

import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '@/logics/initAppConfig';
import { registerGlobComp } from '@/components/registerGlobComp';

const app = createApp(App);

registerGlobComp(app);

Object.values(import.meta.globEager('./modules/*.ts')).forEach((i) => {
  i.install?.({ app });
});

initAppConfigStore();

app.mount('#app');
