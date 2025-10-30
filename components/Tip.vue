<template>
    <div class="comp-tip">
        <div class="title">通配符规则:</div>
        <div>如有以下字符串:apple、banana</div>
        <div>a*->匹配以a开头的字符串:apple</div>
        <div>*a->匹配以a结尾的字符串:banana</div>
        <div>*a*->匹配所有包含a的字符串:apple、banana</div>
        <div>!a*->不匹配以a开头的字符串:banana</div>
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
}
</style>
