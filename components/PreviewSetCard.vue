<script setup>
import { Plus, Check } from 'lucide-vue-next'
const props=defineProps({item:{type:Object,required:true}})
const {add}=usePreviewCart()
const added=ref(false)
function addSet(){add(props.item,'set');added.value=true;setTimeout(()=>added.value=false,1800)}
</script>
<template><article class="set-card"><div class="set-card-image"><img :src="item.image" :alt="item.title" loading="lazy"><span>ชุดตัวอย่าง</span></div><div class="set-card-body"><h3>{{item.title}}</h3><p>{{item.description}}</p><ul><li v-for="line in item.contents" :key="line">{{line}}</li></ul><small>{{item.note}}</small><button type="button" class="btn btn-dark" @click="addSet"><Check v-if="added" :size="17"/><Plus v-else :size="17"/>{{added?'เพิ่มในรายการทดลองแล้ว':'เพิ่มในรายการทดลอง'}}</button></div></article></template>
