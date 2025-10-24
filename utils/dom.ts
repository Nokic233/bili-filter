/**
 * 等待某个 selector 出现后执行回调函数（或返回 Promise）
 * - 支持立即检测
 * - 支持可选回调（callback）
 * - 支持超时
 *
 * @param selector CSS 选择器
 * @param callback 可选，元素出现后执行的函数
 * @param options 可选配置项
 * @returns Promise<Element> 如果提供 callback，则返回 Promise<Element>；否则仅等待
 */
export function waitForSelector<T extends Element>(
    selector: string,
    childSelector: string[],
    callback?: (el: T) => void | Promise<void>,
    options: { timeout?: number } = {}
): Promise<T> {
    const { timeout = 5000 } = options;

    return new Promise<T>((resolve, reject) => {
        // 1. 立即检查是否已存在
        const existing = () => {
            const target = document.querySelector<T>(selector);
            if (target && childSelector.every(s => target.querySelector(s))) {
                return target;
            }
        };
        const result = existing();
        if (result) {
            // 执行回调（异步安全）
            Promise.resolve(callback?.(result)).catch(console.error);
            return resolve(result);
        }

        // 2. 创建观察器监听 DOM 变化
        const observer = new MutationObserver(() => {
            const result = existing();
            if (result) {
                cleanup();
                Promise.resolve(callback?.(result)).catch(console.error);
                resolve(result);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // 3. 超时处理
        const timer = setTimeout(() => {
            cleanup();
            reject(
                new Error(
                    `waitForSelector: timeout ${timeout}ms for ${selector}`
                )
            );
        }, timeout);

        // 清理函数
        const cleanup = () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    });
}
