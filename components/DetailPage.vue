<script setup>
import { ArrowRight, ChevronLeft } from 'lucide-vue-next'
const props=defineProps({type:String,base:String,label:String})
const route=useRoute()
const {data:items}=await useFetch('/api/content',{query:{type:props.type,slug:route.params.slug},default:()=>[]})
const item=computed(()=>items.value[0])
if(!item.value) throw createError({statusCode:404,statusMessage:'ไม่พบข้อมูล'})
useSeoMeta({title:()=>`${item.value?.title} | แหลมฉบังอินเตอร์ออโต้ไทร์`,description:()=>item.value?.summary})
</script>
<template><div class="wrap detail"><NuxtLink :to="base" class="detail-back"><ChevronLeft :size="17"/> กลับไป{{label}}</NuxtLink><div class="detail-grid"><img :src="item.image || '/images/tires.jpg'" :alt="item.title"><div><span class="section-kicker">{{item.category || label}}</span><h1>{{item.title}}</h1><p class="detail-summary">{{item.summary}}</p><div class="detail-body">{{item.body}}</div><p v-if="item.brand"><b>แบรนด์:</b> {{item.brand}}</p><p v-if="item.link && /^https?:\/\//i.test(item.link)"><a :href="item.link" target="_blank" rel="noopener noreferrer" class="text-link">ดูรายละเอียดเพิ่มเติม <ArrowRight :size="16"/></a></p><NuxtLink to="/contact" class="btn btn-dark">สอบถามรายละเอียด <ArrowRight :size="18"/></NuxtLink></div></div></div></template>
