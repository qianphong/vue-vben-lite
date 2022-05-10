import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
// Configure routing
export const install: UserModule = ({ app }) => {
  setupRouter(app);
  // router-guard
  setupRouterGuard(router);
};
