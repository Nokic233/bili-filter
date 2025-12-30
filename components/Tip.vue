<template>
    <div class="comp-tip">
        <div class="title">💡 匹配规则小贴士:</div>
        <div style="margin-top: 4px; color: #666; font-size: 12px">
            符号 <code>*</code> 代表任意字符，<code>!</code> 代表取反(不包含)
        </div>
        <div style="margin: 6px 0; border-bottom: 1px dashed #ccc"></div>
        <div>假设有一个标题为：<b>原神攻略</b></div>
        <div><code>原神*</code> &nbsp;→ 匹配以 <b>原神</b> 开头的内容</div>
        <div><code>*攻略</code> &nbsp;→ 匹配以 <b>攻略</b> 结尾的内容</div>
        <div><code>*神*</code> &nbsp;&nbsp;→ 匹配包含 <b>神</b> 的内容</div>
        <div><code>!原神*</code> → 匹配 <b>不是</b> 以原神开头的内容</div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.comp-tip {
    padding: 8px 16px;
    background-color: rgba(64, 158, 255, 0.1);
    border-radius: 4px;
    border-left: 5px solid var(--el-color-primary);
    margin-bottom: 20px;
    .title {
        font-size: 14px;
        font-weight: bold;
    }

    code {
        background-color: rgba(64, 158, 255, 0.2);
        padding: 2px 4px;
        border-radius: 4px;
        color: var(--el-color-primary);
        font-family: monospace;
        margin: 0 2px;
    }
}
</style>
