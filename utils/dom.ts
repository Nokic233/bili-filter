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
            if (target && childSelector.some(s => target.querySelector(s))) {
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

/**
 * 等待元素发生变化（子节点变化或属性变化）
 * @param element 目标元素
 * @param timeout 超时时间(ms)
 */
export function waitForElementMutation(
    element: Element,
    timeout = 2000
): Promise<void> {
    return new Promise(resolve => {
        let isResolved = false;
        const done = () => {
            if (!isResolved) {
                isResolved = true;
                observer.disconnect();
                clearTimeout(timer);
                resolve();
            }
        };

        const observer = new MutationObserver(() => done());

        // 监听子节点变化（翻页）或者属性变化
        observer.observe(element, {
            childList: true,
            subtree: true, // 搜索列表可能是 list 下面的 div 变了
            attributes: true, // 某些容器可能会变 class
        });

        // 超时也通过（可能是变动太微小没监听到，或者已经变完了）
        // 我们的目的是“如果不确定，就等一会；如果变了，立即继续”
        const timer = setTimeout(done, timeout);
    });
}
