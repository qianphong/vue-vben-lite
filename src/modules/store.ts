import { setupStore } from '@/store';

// Configure store
export const install: UserModule = ({ app }) => {
  setupStore(app);
};
