<script lang="ts" setup>
import { ref, onMounted, toRaw, watch } from 'vue';
import {
    ElForm,
    ElFormItem,
    ElButton,
    ElRadio,
    ElRadioGroup,
} from 'element-plus';
import DynamicTags from '@/components/DynamicTags.vue';
import { formStorage } from '@/utils/storage';
import { name, version } from '@/package.json';

const form = ref({
    videoTitle: [] as string[],
    authorName: [] as string[],
    filterMode: 'blur' as 'blur' | 'hide' | 'tip',
});

onMounted(async () => {
    form.value = await formStorage.getValue();
});

watch(
    () => form.value,
    newValue => {
        handleSave();
    },
    { deep: true }
);

function handleSave() {
    formStorage.setValue(toRaw(form.value));
}

function open(url: string) {
    window.open(url, '_blank');
}
</script>

<template>
    <div>
        <div class="title">{{ name.toLocaleUpperCase() }}设置</div>

        <el-form
            :model="form"
            label-width="auto"
            label-position="top"
            @submit.prevent
        >
            <el-form-item label="视频标题(模糊匹配)">
                <DynamicTags
                    v-model:dynamicTags="form.videoTitle"
                ></DynamicTags>
            </el-form-item>
            <el-form-item label="up名(精确匹配)">
                <DynamicTags
                    v-model:dynamicTags="form.authorName"
                ></DynamicTags>
            </el-form-item>
            <el-form-item label="过滤模式">
                <el-radio-group v-model="form.filterMode">
                    <el-radio value="blur">模糊</el-radio>
                    <el-radio value="hide">隐藏</el-radio>
                    <el-radio value="tip">提示</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <footer class="footer">
            <el-button
                link
                type="warning"
                @click="open('https://github.com/Nokic233/bili-filter/issues')"
                >反馈</el-button
            >
            <div>V{{ version }}</div>
            <el-button
                link
                type="primary"
                @click="open('https://github.com/Nokic233/bili-filter')"
                >Github</el-button
            >
        </footer>
    </div>
</template>

<style scoped>
.title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
    color: var(--el-color-primary);
}
.footer {
    display: flex;
    justify-content: space-between;
}
</style>
