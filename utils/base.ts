// 判断是否是纯对象（非 null、非数组、非函数）
export function isObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
}

// 判断是否是数组
export function isArray<T = unknown>(value: unknown): value is T[] {
    return Array.isArray(value);
}
