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
import { name } from '@/package.json';

const form = ref({
    videoTitle: [] as string[],
    authorName: [] as string[],
    filterMode: 'blur' as 'blur' | 'hide',
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
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item>
                <el-button type="primary" @click="handleSave"
                    >保存设置</el-button
                >
            </el-form-item> -->
        </el-form>
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
</style>
