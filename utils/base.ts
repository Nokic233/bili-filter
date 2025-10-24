// 判断是否是纯对象（非 null、非数组、非函数）
export function isObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
}

// 判断是否是数组
export function isArray<T = unknown>(value: unknown): value is T[] {
    return Array.isArray(value);
}

// 对比除了 query 之外的所有部分都相同
export function isOnlyQueryDifferent(u1: URL, u2: URL): boolean {
    // u1、u2 均为 URL 对象
    const sameBase =
        u1.protocol === u2.protocol &&
        u1.host === u2.host &&
        u1.pathname === u2.pathname &&
        u1.hash === u2.hash; // 可根据需要是否包含 hash

    if (!sameBase) return false; // 其他部分不一样，直接 false

    // 比较 query 是否不同
    const q1 = new URLSearchParams(u1.search);
    const q2 = new URLSearchParams(u2.search);

    const o1 = Object.fromEntries(q1.entries());
    const o2 = Object.fromEntries(q2.entries());

    return JSON.stringify(o1) !== JSON.stringify(o2);
}

// 既能 nextTick，也能真正 sleep
export function sleep(ms = 0) {
    if (ms <= 0) {
        // 类似 Vue.nextTick：放入微任务队列
        return Promise.resolve();
    }
    // 真正的延时
    return new Promise(resolve => setTimeout(resolve, ms));
}
