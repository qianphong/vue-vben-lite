import { setupPermissionDirective } from '@/directives/permission';
import { setupLoadingDirective } from '@/directives/loading';

// Register global directive
export const install: UserModule = ({ app }) => {
  setupPermissionDirective(app);
  setupLoadingDirective(app);
};
