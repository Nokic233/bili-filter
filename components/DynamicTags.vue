<template>
    <div class="comp-dynamic-tags">
        <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            size="large"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
        >
            {{ tag }}
        </el-tag>
        <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="w-20"
            size="default"
            placeholder="请输入关键字并回车(enter)"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button
            v-else
            class="button-new-tag"
            size="default"
            @click="showInput"
        >
            + 添加
        </el-button>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { ElTag, ElInput, ElButton } from 'element-plus';
import type { InputInstance } from 'element-plus';

const dynamicTags = defineModel<string[]>('dynamicTags', {
    default: () => ['Tag 1', 'Tag 2', 'Tag 3'],
});

const inputValue = ref('');
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();

const handleClose = (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
        InputRef.value!.input!.focus();
    });
};

const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value);
    }
    inputVisible.value = false;
    inputValue.value = '';
};
</script>

<style scoped>
.comp-dynamic-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}
</style>
