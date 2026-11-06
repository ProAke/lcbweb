<script setup>
import { Search, ArrowRight } from 'lucide-vue-next'
const props=defineProps({type:String,title:String,subtitle:String,base:String})
useSeoMeta({title: `${props.title} | แหลมฉบังอินเตอร์ออโต้ไทร์`, description: props.subtitle})
const route=useRoute(); const search=ref(''); const category=ref(typeof route.query.category==='string'?route.query.category:'')
const {data:items}=await useFetch('/api/content',{query:{type:props.type},default:()=>[]})
const categories=computed(()=>[...new Set(items.value.map(i=>i.category).filter(Boolean))])
const filtered=computed(()=>items.value.filter(i=>(!category.value||i.category===category.value)&&`${i.title} ${i.summary} ${i.brand}`.toLowerCase().includes(search.value.toLowerCase())))
</script>
<template><div><div class="page-hero"><div class="wrap"><div class="breadcrumbs"><NuxtLink to="/">หน้าแรก</NuxtLink> / {{title}}</div><span class="section-kicker light">LAEMCHABANG INTERAUTOTIRE</span><h1>{{title}}</h1><p>{{subtitle}}</p></div></div><section class="section wrap"><div class="listing-head"><div><span class="section-kicker">EXPLORE MORE</span><h2>{{title}}ของเรา</h2></div><label class="search-box"><Search :size="19"/><input v-model="search" :placeholder="`ค้นหา${title}`" :aria-label="`ค้นหา${title}`"></label></div><div v-if="categories.length" class="filter-row"><button :class="{active:!category}" @click="category=''">ทั้งหมด</button><button v-for="c in categories" :key="c" :class="{active:category===c}" @click="category=c">{{c}}</button></div><div v-if="filtered.length" class="cards-grid"><ContentCard v-for="item in filtered" :key="item.slug" :item="item" :base="base"/></div><div v-else class="empty-state"><h3>ยังไม่มีรายการที่แสดง</h3><p>กรุณาลองค้นหาใหม่ หรือติดต่อเราเพื่อสอบถามรายละเอียด</p><NuxtLink to="/contact" class="text-link">ติดต่อเรา <ArrowRight :size="16"/></NuxtLink></div></section></div></template>
