import '@/assets/css/filterMode.css';
import { ContentScriptContext, WxtWindowEventMap } from '#imports';
import { formStorage } from '@/utils/storage';
import { waitForElementMutation, waitForSelector } from '@/utils/dom';
import { isArray, isObject, isOnlyQueryDifferent } from '@/utils/base';
import { getMatchRules } from '@/utils/matcher';

// ... (imports)

// 综合热门 https://www.bilibili.com/v/popular/all
// 每周必看 https://www.bilibili.com/v/popular/weekly
// 入站必刷 https://www.bilibili.com/v/popular/history
// 排行榜  https://www.bilibili.com/v/popular/rank/all
// 全站音乐榜 https://www.bilibili.com/v/popular/music

// 定义页面配置对象（新增页面时，只需在这里添加一个对象）
const pageConfigs = [
    // #region 热门
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
    // #endregion 热门

    // #region 搜索
    {
        name: '搜索-综合',
        pattern: '*://search.bilibili.com/all*',
        selectors: [
            {
                container:
                    '#i_cecream div.search-content--gray.search-content div.user-list.search-all-list div.video-list',
                videoTitle: '.bili-video-card__info--tit',
                authorName: '.bili-video-card__info--author',
            },
            {
                container:
                    '#i_cecream div.search-content--gray.search-content div.search-page-wrapper div.i_wrapper.search-all-list div.video-list',
                videoTitle: '.bili-video-card__info--tit',
                authorName: '.bili-video-card__info--author',
            },
            {
                container:
                    '#i_cecream div.search-content--gray.search-content div.search-page-wrapper div.search-page-video.i_wrapper div.video-list',
                videoTitle: '.bili-video-card__info--tit',
                authorName: '.bili-video-card__info--author',
            },
        ],
    },
    {
        name: '搜索-视频',
        pattern: '*://search.bilibili.com/video*',
        selectors: [
            {
                container:
                    '#i_cecream div.search-content div.search-page-wrapper div.search-page-video.i_wrapper div.video-list',
                videoTitle: '.bili-video-card__info--tit',
                authorName: '.bili-video-card__info--author',
            },
        ],
    },
    // #endregion 搜索
    {
        name: '普通视频',
        pattern: '*://www.bilibili.com/video/*',
        selectors: {
            container:
                '#mirror-vdcon > div.right-container > div > div.rcmd-tab > div.recommend-list-v1 > div.rec-list',
            videoTitle: '.title',
            authorName: '.name',
        },
    },
    {
        name: '课堂视频',
        pattern: '*://www.bilibili.com/cheese/play/*',
        selectors: {
            container:
                '#app div.edu-play-main-container div.edu-play-right div.season-recommends.right-box-rect',
            videoTitle: '.season-title',
            authorName: '.none',
        },
    },
    // !WARN 首页必须放在最后
    {
        name: '首页',
        pattern: '*://*.bilibili.com/*',
        selectors: [
            {
                container:
                    '#app > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8',
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
        mainScript({ newUrl: new URL(document.location.href) } as any);

        // 监听 URL 变化（例如单页应用的路由跳转）
        ctx.addEventListener(window, 'wxt:locationchange', mainScript);

        async function mainScript({
            newUrl,
            oldUrl,
        }: WxtWindowEventMap['wxt:locationchange']) {
            // console.log(newUrl, oldUrl);

            // 确保前一个清理操作完成后再进行新的初始化
            cleanupPromise = cleanupPromise.then(async () => {
                // 执行当前的清理函数
                if (currentCleanupFunctions.length > 0) {
                    currentCleanupFunctions.forEach(fn => fn && fn());
                    currentCleanupFunctions = [];
                }

                // 匹配当前 URL
                for (const config of pageConfigs) {
                    if (new MatchPattern(config.pattern).includes(newUrl)) {
                        // 智能等待：如果检测到 URL 变化可能导致的内容更新（如搜索翻页），
                        // 且旧内容的容器还存在，则等待容器内容变化后再初始化
                        if (
                            (oldUrl?.href.includes('search.bilibili.com/') &&
                                isOnlyQueryDifferent(newUrl, oldUrl)) ||
                            newUrl?.href?.includes?.('www.bilibili.com/video/')
                        ) {
                            const selectors = isArray(config.selectors)
                                ? config.selectors
                                : [config.selectors];

                            // 查找当前页面中是否存在旧容器
                            const existingContainer = selectors
                                .map(s => document.querySelector(s.container))
                                .find(el => el);

                            if (existingContainer) {
                                // 等待旧容器发生变动（翻页/刷新），或者超时自动继续
                                await waitForElementMutation(existingContainer);
                            }
                        }

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
    let currentCleanup: (() => void) | null = null;
    let latestConfigId = 0;

    /**
     * 应用新的配置规则
     */
    const applyConfig = async (storageValue: any) => {
        // 标记本次更新的 ID
        const configId = ++latestConfigId;

        // 立即清理上一次的副作用（断开旧的 observer，取消旧的 mutation 监听等）
        // 这样可以避免旧的规则和即将生效的新规则冲突
        if (currentCleanup) {
            currentCleanup();
            currentCleanup = null;
        }

        try {
            // 执行添加遮罩的逻辑
            // 传入 checkCancelled 回调，允许在 await waitForSelector 期间感知配置是否已过期
            const resultCleanup = await addMask(
                storageValue,
                selectorForList,
                selectorForVideoTitle,
                selectorForAuthorName,
                () => configId !== latestConfigId
            );

            // 如果在 await 期间配置又更新了，那么丢弃本次结果
            if (configId !== latestConfigId) {
                if (resultCleanup) resultCleanup();
                return;
            }

            // 保存清理函数
            currentCleanup = resultCleanup || null;
        } catch (error) {
            console.error('应用过滤规则时出错:', error);
        }
    };

    // 获取存储的初始值并应用
    const storagePromise = formStorage
        .getValue()
        .then(value => applyConfig(value));

    // 监听存储变化
    const unWatch = formStorage.watch(newValue => {
        applyConfig(newValue);
    });

    /**
     * 为匹配的内容添加模糊遮罩
     * @param storage - 存储的过滤条件
     * @param selectorForList - 列表容器选择器
     * @param selectorForVideoTitle - 视频标题选择器
     * @param selectorForAuthorName - 作者名称选择器
     * @param isCancelled - 检查当前任务是否已取消的回调
     * @returns 清理函数
     */
    async function addMask(
        storage: {
            videoTitle: string[];
            authorName: string[];
            filterMode: 'blur' | 'hide' | 'tip';
        },
        selectorForList: string,
        selectorForVideoTitle: string,
        selectorForAuthorName: string,
        isCancelled: () => boolean
    ) {
        try {
            // 等待目标元素出现
            // 如果超时，说明当前页面可能不包含此容器（多选一的情况），或者加载过慢
            // 这里的 catch 旨在消除非必要的控制台报错
            try {
                await waitForSelector(
                    selectorForList,
                    [selectorForVideoTitle, selectorForAuthorName],
                    undefined,
                    { timeout: 10000 } // 给够时间，避免网络慢导致误判
                );
            } catch (err) {
                // 如果是超时错误，且任务未取消，则认为是多选一未匹配到，静默失败
                // 仅在开发模式下或必要时打印
                // console.debug('waitForSelector timeout (expected for unmatched layout):', selectorForList);
                return;
            }

            // 如果在等待期间配置已过期，直接返回
            if (isCancelled()) return;

            const target = document.querySelector(selectorForList)!;
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
                card.classList.remove(
                    'bili-filter-mode-blur',
                    'bili-filter-mode-hide',
                    'bili-filter-mode-tip'
                );
                card.removeAttribute('data-filter-reason');

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

                const matchVideoTitleArr = getMatchRules(
                    videoTitle,
                    storage.videoTitle
                );

                const matchAuthorNameArr = getMatchRules(
                    authorName,
                    storage.authorName
                );

                if (matchVideoTitleArr.length || matchAuthorNameArr.length) {
                    const filterClass = `bili-filter-mode-${storage.filterMode}`;
                    card.classList.add(filterClass);

                    if (storage.filterMode === 'tip') {
                        function getFilterReason() {
                            const reasons: string[] = [];
                            if (matchVideoTitleArr.length) {
                                reasons.push(
                                    `标题包含（${matchVideoTitleArr.join(
                                        '、'
                                    )}）`
                                );
                            }
                            if (matchAuthorNameArr.length) {
                                reasons.push(
                                    `up名包含（${matchAuthorNameArr.join(
                                        '、'
                                    )}）`
                                );
                            }
                            return reasons.join('；');
                        }
                        card.setAttribute(
                            'data-filter-reason',
                            getFilterReason()
                        );
                    }
                }
            }

            // 处理已有的子节点
            if (target.childNodes.length) {
                Array.from(target.childNodes).forEach(node => {
                    handleCard(node as HTMLElement);
                });
            }

            // 设置观察器监听新增节点
            const observer = new MutationObserver(mutationsList => {
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
                }
            };
        } catch (error) {
            console.error('添加遮罩时出错:', error);
        }
    }

    // 返回主清理函数
    return () => {
        storagePromise.then(() => {
            // 清理当前的副作用
            if (currentCleanup) {
                currentCleanup();
                currentCleanup = null;
            }
            // 断开存储监听
            unWatch();
        });
    };
}
