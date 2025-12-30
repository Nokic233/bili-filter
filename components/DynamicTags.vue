<template>
    <div class="comp-dynamic-tags">
        <template v-for="(tag, index) in dynamicTags" :key="index">
            <el-input
                v-if="editIndex === index"
                :ref="setEditRef"
                v-model="editInputValue"
                size="default"
                @keyup.enter="handleEditConfirm"
                @blur="handleEditConfirm"
            />
            <el-tag
                v-else
                :key="tag"
                :type="hasNegated(tag)"
                size="large"
                closable
                :disable-transitions="true"
                @close="handleClose(tag)"
                @click="handleEdit(tag, index)"
            >
                {{ tag }}
            </el-tag>
        </template>
        <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            size="default"
            :placeholder="props.placeholder"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
            clearable
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
import { nextTick, ref, computed } from 'vue';
import type { InputInstance } from 'element-plus';

const props = withDefaults(
    defineProps<{ placeholder?: string; inputType?: 'wildcard' | 'default' }>(),
    {
        placeholder: '请输入关键字并回车(enter)',
        inputType: 'default',
    }
);

const dynamicTags = defineModel<string[]>('dynamicTags', {
    default: () => ['Tag 1', 'Tag 2', 'Tag 3'],
});

const inputValue = ref('');
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();
const isWildcard = computed(() => props.inputType === 'wildcard');

function hasNegated(tag: string) {
    return tag.startsWith('!') && isWildcard.value ? 'success' : 'primary';
}

const editIndex = ref(-1);
const editInputValue = ref('');
let activeEditInput: InputInstance | null = null;

const setEditRef = (el: any) => {
    if (el) activeEditInput = el;
};

const handleEdit = (tag: string, index: number) => {
    editIndex.value = index;
    editInputValue.value = tag;
    nextTick(() => {
        activeEditInput?.input?.focus();
    });
};

const handleEditConfirm = () => {
    if (editIndex.value !== -1) {
        if (editInputValue.value) {
            dynamicTags.value[editIndex.value] = editInputValue.value;
        }
        editIndex.value = -1;
    }
};

const handleClose = (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
    if (isWildcard.value) {
        inputValue.value = '**';
    }

    inputVisible.value = true;

    nextTick(() => {
        InputRef.value!.input!.focus();
        InputRef.value!.input!.setSelectionRange(1, 1);
    });
};

const handleInputConfirm = () => {
    if (
        (!isWildcard.value && inputValue.value) ||
        (isWildcard.value && inputValue.value !== '**' && inputValue.value)
    ) {
        dynamicTags.value.push(inputValue.value);
    }
    inputVisible.value = false;
    inputValue.value = '';
};
</script>

<style lang="scss" scoped>
.comp-dynamic-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}
</style>
