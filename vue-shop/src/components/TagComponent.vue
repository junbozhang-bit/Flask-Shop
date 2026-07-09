<template>
<el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    class="w-20"
    size="small"
    @blur="handleInputConfirm"
    />
<el-button v-else class="button-new-tag" size="small" @click="showInput">
    + 添加值
</el-button>
</template>

<script setup>

import { ref,nextTick } from 'vue';

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref(null)

//定义事件
const emit = defineEmits(['addTagEvent'])
//定义接收父级组件传递过来的值
const props = defineProps({
    row:{
        type:Object,//传递过来的数据类型
        default:() =>Object //默认值
    }
})
const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}

const handleInputConfirm = () => {
    //触发事件
    emit('addTagEvent',{'inputValue':inputValue.value,'row':props.row}) 
    inputVisible.value = false
    inputValue.value = ''
}
</script>

<style scoped>
.w-20{
    width: 100px;
}
</style>