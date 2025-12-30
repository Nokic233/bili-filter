import { defineConfig } from 'wxt';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
    autoIcons: {
        developmentIndicator: false,
        sizes: [24, 64],
    },
    manifest: {
        // These permissions are required for "webext-dynamic-content-scripts" and
        // "webext-permission-toggle" to work.
        name: 'BiliFilter-通过关键词过滤B站视频',
        description: 'bili-filter: B站过滤插件，隐藏标题和作者，简洁清爽',
        permissions: ['storage', 'scripting', 'activeTab'],
        action: {
            default_title: 'bili-filter: B站过滤插件，隐藏标题和作者，简洁清爽',
        },
    },
    vite: () => ({
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    }),
});
