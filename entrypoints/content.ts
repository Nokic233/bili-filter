import '@/assets/css/filterMode.css';
import { ContentScriptContext, WxtWindowEventMap } from '#imports';
import { formStorage } from '@/utils/storage';
import { waitForSelector } from '@/utils/dom';
import { isArray, isObject } from '@/utils/base';

// 综合热门 https://www.bilibili.com/v/popular/all
// 每周必看 https://www.bilibili.com/v/popular/weekly
// 入站必刷 https://www.bilibili.com/v/popular/history
// 排行榜  https://www.bilibili.com/v/popular/rank/all
// 全站音乐榜 https://www.bilibili.com/v/popular/music

// 定义页面配置对象（新增页面时，只需在这里添加一个对象）
const pageConfigs = [
    {
        name: '综合热门',
        pattern: '*://*.bilibili.com/v/popular/all*',
        selectors: {
            container:
                '#app > div > div.popular-video-container.popular-list > div.flow-loader > ul',
            videoTitle: '.video-card__info .video-name',
            authorName: '.video-card__info .up-name__text',
        },
    },
    {
        name: '每周必看',
        pattern: '*://*.bilibili.com/v/popular/weekly*',
        selectors: {
            container:
                '#app > div > div.popular-video-container.weekly-list > div:nth-child(2) > div',
            videoTitle: '.video-card__info .video-name',
            authorName: '.video-card__info .up-name__text',
        },
    },
    {
        name: '入站必刷',
        pattern: '*://*.bilibili.com/v/popular/history*',
        selectors: {
            container:
                '#app > div > div.popular-video-container.history-list > div > ul > div',
            videoTitle: '.video-card__info .video-name',
            authorName: '.video-card__info .up-name__text',
        },
    },
    ...[
        {
            name: '排行榜-全部',
            pattern: '*://*.bilibili.com/v/popular/rank/all*',
        },
        {
            name: '排行榜-动画',
            pattern: '*://*.bilibili.com/v/popular/rank/douga*',
        },
        {
            name: '排行榜-游戏',
            pattern: '*://*.bilibili.com/v/popular/rank/game*',
        },
        {
            name: '排行榜-鬼畜',
            pattern: '*://*.bilibili.com/v/popular/rank/kichiku*',
        },
        {
            name: '排行榜-音乐',
            pattern: '*://*.bilibili.com/v/popular/rank/music*',
        },
        {
            name: '排行榜-舞蹈',
            pattern: '*://*.bilibili.com/v/popular/rank/dance*',
        },
        {
            name: '排行榜-影视',
            pattern: '*://*.bilibili.com/v/popular/rank/cinephile*',
        },
        {
            name: '排行榜-娱乐',
            pattern: '*://*.bilibili.com/v/popular/rank/ent*',
        },
        {
            name: '排行榜-知识',
            pattern: '*://*.bilibili.com/v/popular/rank/knowledge*',
        },
        {
            name: '排行榜-科技数码',
            pattern: '*://*.bilibili.com/v/popular/rank/tech*',
        },
        {
            name: '排行榜-美食',
            pattern: '*://*.bilibili.com/v/popular/rank/food*',
        },
        {
            name: '排行榜-汽车',
            pattern: '*://*.bilibili.com/v/popular/rank/car*',
        },
        {
            name: '排行榜-时尚美妆',
            pattern: '*://*.bilibili.com/v/popular/rank/fashion*',
        },
        {
            name: '排行榜-体育运动',
            pattern: '*://*.bilibili.com/v/popular/rank/sports*',
        },
        {
            name: '排行榜-动物',
            pattern: '*://*.bilibili.com/v/popular/rank/animal*',
        },
    ].map(config => ({
        ...config,
        selectors: {
            container:
                '#app > div > div.rank-container > div.rank-list-wrap > ul',
            videoTitle: '.content .info > a',
            authorName: '.content .info .up-name',
        },
    })),
    ...[
        {
            name: '排行榜-番剧',
            pattern: '*://*.bilibili.com/v/popular/rank/anime*',
        },
        {
            name: '排行榜-国创',
            pattern: '*://*.bilibili.com/v/popular/rank/guochuang*',
        },
        {
            name: '排行榜-纪录片',
            pattern: '*://*.bilibili.com/v/popular/rank/documentary*',
        },
        {
            name: '排行榜-电影',
            pattern: '*://*.bilibili.com/v/popular/rank/movie*',
        },
        {
            name: '排行榜-电视剧',
            pattern: '*://*.bilibili.com/v/popular/rank/tv*',
        },
        {
            name: '排行榜-综艺',
            pattern: '*://*.bilibili.com/v/popular/rank/variety*',
        },
    ].map(config => ({
        ...config,
        selectors: {
            container:
                '#app > div > div.rank-container > div.rank-list-wrap > ul',
            videoTitle: '.content .info > a',
            authorName: '.content .info .up-name',
        },
    })),
    {
        name: '全站音乐榜',
        pattern: '*://*.bilibili.com/v/popular/music*',
        selectors: {
            container: '#app > div.rank > div:nth-child(1)',
            videoTitle: '.vidoInfo .info .title',
            authorName: '.vidoInfo .info .subtitle .up .upName',
        },
    },
    // !WARN 首页必须放在最后
    {
        name: '首页',
        pattern: '*://*.bilibili.com/*',
        selectors: [
            {
                container:
                    '#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8',
                videoTitle: '.bili-video-card__info--tit',
                authorName: '.bili-video-card__info--author',
            },
        ],
    },
];

// 使用Promise来确保清理操作完成
let cleanupPromise: Promise<void> = Promise.resolve();
let currentCleanupFunctions: Array<() => void> = [];

export default defineContentScript({
    matches: ['*://*.bilibili.com/*'],
    main(ctx) {
        // 初次加载执行
        mainScript({ newUrl: document.location.href });

        // 监听 URL 变化（例如单页应用的路由跳转）
        ctx.addEventListener(window, 'wxt:locationchange', mainScript);

        function mainScript({
            newUrl,
        }: WxtWindowEventMap['wxt:locationchange']) {
            // 确保前一个清理操作完成后再进行新的初始化
            cleanupPromise = cleanupPromise.then(() => {
                // 执行当前的清理函数
                if (currentCleanupFunctions.length > 0) {
                    currentCleanupFunctions.forEach(fn => fn && fn());
                    currentCleanupFunctions = [];
                }

                // 匹配当前 URL
                for (const config of pageConfigs) {
                    if (new MatchPattern(config.pattern).includes(newUrl)) {
                        if (isObject(config.selectors)) {
                            const cleanupFn = init(
                                ctx,
                                config.selectors.container,
                                config.selectors.videoTitle,
                                config.selectors.authorName
                            );
                            if (cleanupFn) {
                                currentCleanupFunctions.push(cleanupFn);
                            }
                        } else if (isArray(config.selectors)) {
                            config.selectors.forEach(selector => {
                                const cleanupFn = init(
                                    ctx,
                                    selector.container,
                                    selector.videoTitle,
                                    selector.authorName
                                );
                                if (cleanupFn) {
                                    currentCleanupFunctions.push(cleanupFn);
                                }
                            });
                        }
                        break;
                    }
                }
            });
        }
    },
});

/**
 * 初始化页面内容处理
 * @param ctx - 内容脚本上下文
 * @param selectorForList - 列表容器选择器
 * @param selectorForVideoTitle - 视频标题选择器
 * @param selectorForAuthorName - 作者名称选择器
 * @returns 清理函数
 */
function init(
    ctx: ContentScriptContext,
    selectorForList: string,
    selectorForVideoTitle: string,
    selectorForAuthorName: string
) {
    // 存储所有需要清理的函数
    const cleanupFunctions: Array<() => void> = [];
    let observer: MutationObserver | null = null;

    // 获取存储的过滤条件并应用遮罩
    const storagePromise = formStorage.getValue().then(async value => {
        const cleanupFn = await addMask(
            value,
            selectorForList,
            selectorForVideoTitle,
            selectorForAuthorName
        );
        if (cleanupFn) cleanupFunctions.push(cleanupFn);
    });

    // 监听存储变化
    const unWatch = formStorage.watch(async newValue => {
        // 如果有旧的观察器，先断开连接
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        const cleanupFn = await addMask(
            newValue,
            selectorForList,
            selectorForVideoTitle,
            selectorForAuthorName
        );
        if (cleanupFn) cleanupFunctions.push(cleanupFn);
    });

    /**
     * 为匹配的内容添加模糊遮罩
     * @param storage - 存储的过滤条件
     * @param selectorForList - 列表容器选择器
     * @param selectorForVideoTitle - 视频标题选择器
     * @param selectorForAuthorName - 作者名称选择器
     * @returns 清理函数
     */
    async function addMask(
        storage: {
            videoTitle: string[];
            authorName: string[];
            filterMode: 'blur' | 'hide';
        },
        selectorForList: string,
        selectorForVideoTitle: string,
        selectorForAuthorName: string
    ) {
        try {
            // 等待目标元素出现
            await waitForSelector(selectorForList);
            const target = document.querySelector(selectorForList);

            if (!target) return;
            target.classList.add('bili-filter-container');

            /**
             * 处理单个卡片元素
             * @param card - 卡片元素
             */
            function handleCard(card: HTMLElement) {
                if (!card || !card.querySelector) {
                    return;
                }

                card.classList.add('bili-filter-card__init');

                // 获取视频标题
                const videoTitle = (
                    card
                        .querySelector(selectorForVideoTitle)
                        ?.getAttribute('title') ||
                    card.querySelector(selectorForVideoTitle)?.textContent ||
                    ''
                ).trim();

                // 获取作者名称
                const authorName = (
                    card
                        .querySelector(selectorForAuthorName)
                        ?.getAttribute('title') ||
                    card.querySelector(selectorForAuthorName)?.textContent ||
                    ''
                ).trim();

                const filterClass = `bili-filter-mode-${storage.filterMode}`;

                card.classList.remove(
                    'bili-filter-mode-blur',
                    'bili-filter-mode-hide'
                );

                if (
                    storage.videoTitle.some(title =>
                        videoTitle.includes(title)
                    ) ||
                    storage.authorName.some(name => authorName === name)
                ) {
                    card.classList.add(filterClass);
                }
            }

            // 处理已有的子节点
            if (target.childNodes.length) {
                Array.from(target.childNodes).forEach(node => {
                    handleCard(node as HTMLElement);
                });
            }

            // 设置观察器监听新增节点
            observer = new MutationObserver(mutationsList => {
                for (const mutation of mutationsList) {
                    if (
                        mutation.type === 'childList' &&
                        mutation.addedNodes.length
                    ) {
                        Array.from(mutation.addedNodes).forEach(node => {
                            handleCard(node as HTMLElement);
                        });
                    }
                }
            });

            observer.observe(target, {
                childList: true, // 监听子节点增删
            });

            // 返回清理函数
            return () => {
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
            };
        } catch (error) {
            console.error('添加遮罩时出错:', error);
        }
    }

    // 返回主清理函数
    return () => {
        // 确保存储操作完成
        storagePromise.then(() => {
            // 执行所有清理函数
            cleanupFunctions.forEach(fn => fn && fn());
            cleanupFunctions.length = 0;

            // 断开存储监听
            unWatch();

            // 确保观察器被断开连接
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        });
    };
}
