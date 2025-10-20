import { ContentScriptContext, WxtWindowEventMap } from '#imports';
import { formStorage } from '@/utils/storage';

// 综合热门 https://www.bilibili.com/v/popular/all
const allPattern = new MatchPattern('*://*.bilibili.com/v/popular/all*');
// 每周必看 https://www.bilibili.com/v/popular/weekly
const weeklyPattern = new MatchPattern('*://*.bilibili.com/v/popular/weekly*');
// 入站必刷 https://www.bilibili.com/v/popular/history
const historyPattern = new MatchPattern(
    '*://*.bilibili.com/v/popular/history*'
);
// 排行榜  https://www.bilibili.com/v/popular/rank/all
const rankPattern = new MatchPattern('*://*.bilibili.com/v/popular/rank/all*');
// 全站音乐榜 https://www.bilibili.com/v/popular/music
const musicPattern = new MatchPattern('*://*.bilibili.com/v/popular/music*');

export default defineContentScript({
    matches: ['*://*.bilibili.com/*'],
    main(ctx) {
        mainScript({ newUrl: document.location.href });
        ctx.addEventListener(window, 'wxt:locationchange', mainScript);

        function mainScript({
            newUrl,
        }: WxtWindowEventMap['wxt:locationchange']) {
            if (allPattern.includes(newUrl)) {
                allMain(ctx);
            }
            if (weeklyPattern.includes(newUrl)) {
                weeklyMain(ctx);
            }
            if (historyPattern.includes(newUrl)) {
                historyMain(ctx);
            }
            if (rankPattern.includes(newUrl)) {
                rankMain(ctx);
            }
            if (musicPattern.includes(newUrl)) {
                musicMain(ctx);
            }
        }
    },
});

function allMain(ctx: ContentScriptContext) {
    console.log('allMain');

    formStorage.getValue().then(value => {
        console.log(111111111);
        addMask(value);
    });
    formStorage.watch(newValue => {
        console.log(22222222);
        addMask(newValue);
    });

    function addMask(storage: { videoTitle: string[]; authorName: string[] }) {
        const selector =
            '#app > div > div.popular-video-container.popular-list > div.flow-loader > ul';

        const target = document.querySelector(selector);
        if (target) {
            function handleCard(card: HTMLElement) {
                const videoTitle =
                    card
                        .querySelector('.video-card__info .video-name')
                        ?.getAttribute('title') || '';

                if (
                    storage.videoTitle.some(title => videoTitle.includes(title))
                ) {
                    card.style.filter = 'blur(16px)';
                    card.style.pointerEvents = 'none';
                    card.style.userSelect = 'none';
                } else {
                    card.style.filter = 'none';
                    card.style.pointerEvents = 'auto';
                    card.style.userSelect = 'auto';
                }
            }
            if (target.childNodes.length) {
                console.log('have childNodes');
                target.childNodes.forEach(handleCard);
            } else {
                const observer = new MutationObserver(mutationsList => {
                    mutationsList.forEach(mutation => {
                        if (mutation.type === 'childList') {
                            // console.log('子节点发生变化:', mutation);

                            const card = mutation.addedNodes[0];
                            handleCard(card);
                        }
                    });
                });

                observer.observe(target, {
                    // attributes: true, // 监听属性变化
                    childList: true, // 监听子节点增删
                    // subtree: true, // 子孙节点也监听
                    // characterData: true, // 监听文本变化
                });
            }
        }
    }
}

function weeklyMain(ctx: ContentScriptContext) {
    console.log('weeklyMain');
}
function historyMain(ctx: ContentScriptContext) {
    console.log('historyMain');
}
function rankMain(ctx: ContentScriptContext) {
    console.log('rankMain');
}
function musicMain(ctx: ContentScriptContext) {
    console.log('musicMain');
}
