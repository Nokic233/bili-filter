import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-vue'],
    manifest: {
        // These permissions are required for "webext-dynamic-content-scripts" and
        // "webext-permission-toggle" to work.
        name: 'BiliFilter-通过关键词过滤B站视频',
        permissions: ['storage', 'scripting', 'activeTab'],
    },
});
