<script setup>
import { ArrowRight, ChevronLeft, Package, Plus } from 'lucide-vue-next'
const props=defineProps({type:String,base:String,label:String})
const route=useRoute()
const {add}=usePreviewCart()
const added=ref(false)
function addItem(){add(item.value);added.value=true}
const {data:items}=await useFetch('/api/content',{query:{type:props.type,slug:route.params.slug},default:()=>[]})
const item=computed(()=>items.value[0])
if(!item.value) throw createError({statusCode:404,statusMessage:'ไม่พบข้อมูล'})
useSeoMeta({title:()=>`${item.value?.title} | แหลมฉบังอินเตอร์ออโต้ไทร์`,description:()=>item.value?.summary})
</script>
<template><div class="wrap detail"><NuxtLink :to="base" class="detail-back"><ChevronLeft :size="17"/> กลับไป{{label}}</NuxtLink><div class="detail-grid"><img v-if="item.image" :src="item.image" :alt="item.title"><div v-else class="detail-image-placeholder"><Package :size="55" :stroke-width="1.1"/><span>ไม่มีภาพสินค้า</span></div><div><span class="section-kicker">{{item.category || label}}</span><h1>{{item.title}}</h1><p class="detail-summary">{{item.summary}}</p><div class="detail-body">{{item.body}}</div><p v-if="item.brand"><b>แบรนด์:</b> {{item.brand}}</p><p v-if="item.link && /^https?:\/\//i.test(item.link)"><a :href="item.link" target="_blank" rel="noopener noreferrer" class="text-link">ดูแหล่งข้อมูลอ้างอิง <ArrowRight :size="16"/></a></p><div v-if="type==='product'" class="preview-add"><p>รายการอ้างอิงเพื่อทดลองเลือก ยังไม่ใช่การสั่งซื้อ</p><button class="btn btn-yellow" type="button" @click="addItem"><Plus :size="17"/>{{added?'เพิ่มในรายการทดลองแล้ว':'เพิ่มในรายการทดลอง'}}</button> <NuxtLink v-if="added" to="/cart" class="text-link">ดูรายการทดลอง</NuxtLink></div><NuxtLink to="/contact" class="btn btn-dark">สอบถามรายละเอียด <ArrowRight :size="18"/></NuxtLink></div></div></div></template>
