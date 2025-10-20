import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-vue'],
    manifest: {
        // These permissions are required for "webext-dynamic-content-scripts" and
        // "webext-permission-toggle" to work.
        permissions: ['storage', 'scripting', 'activeTab'],
    },
});
