<script lang="ts" setup>
import { ref, onMounted, toRaw } from 'vue';
import { ElForm, ElFormItem, ElButton } from 'element-plus';
import DynamicTags from '@/components/DynamicTags.vue';
import { formStorage } from '@/utils/storage';

const form = ref({
    videoTitle: [] as string[],
    authorName: [] as string[],
});

onMounted(async () => {
    form.value = await formStorage.getValue();
});

function handleSave() {
    formStorage.setValue(toRaw(form.value));
}
</script>

<template>
    <div>
        <el-form :model="form" label-width="auto" @submit.prevent>
            <el-form-item label="视频标题">
                <DynamicTags
                    v-model:dynamicTags="form.videoTitle"
                ></DynamicTags>
            </el-form-item>
            <el-form-item label="作者名">
                <DynamicTags
                    v-model:dynamicTags="form.authorName"
                ></DynamicTags>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSave"
                    >保存并过滤</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
