<script setup>
import { Menu, X, Phone, ArrowUpRight } from 'lucide-vue-next'
defineProps({ settings: { type: Object, default: () => ({}) } })
const open = ref(false)
const links = [{label:'โปรโมชั่น',to:'/promotions'},{label:'สินค้า',to:'/products'},{label:'บริการ',to:'/services'},{label:'รอบรู้ดูแลรถ',to:'/articles'},{label:'เกี่ยวกับเรา',to:'/about'},{label:'ติดต่อเรา',to:'/contact'}]
const route = useRoute(); watch(()=>route.path,()=>open.value=false)
</script>
<template>
<header class="site-header">
  <div class="header-main wrap-wide">
    <NuxtLink to="/" class="brand" aria-label="แหลมฉบังอินเตอร์ออโต้ไทร์ หน้าหลัก"><span class="brand-mark">C<span>O</span>CKPIT</span><span class="brand-sub">LAEMCHABANG INTERAUTOTIRE <small>COMPANY LIMITED</small></span></NuxtLink>
    <div class="desktop-header"><div class="header-top"><span>พร้อมดูแลทุกการเดินทางของคุณ</span><a :href="settings.facebook" target="_blank" rel="noopener noreferrer">ติดตามเรา <ArrowUpRight :size="13"/></a></div><div class="header-bottom"><nav aria-label="เมนูหลัก"><NuxtLink v-for="item in links" :key="item.to" :to="item.to">{{item.label}}</NuxtLink></nav><a class="phone-pill" :href="`tel:${settings.phone_link}`"><Phone :size="16" fill="currentColor"/> {{settings.phone}}</a></div></div>
    <button class="mobile-menu" :aria-expanded="open" aria-label="เปิดเมนู" @click="open=!open"><X v-if="open"/><Menu v-else/></button>
  </div>
  <nav v-if="open" class="mobile-nav" aria-label="เมนูมือถือ"><NuxtLink v-for="item in links" :key="item.to" :to="item.to">{{item.label}}</NuxtLink><a :href="`tel:${settings.phone_link}`">โทร {{settings.phone}}</a></nav>
</header>
</template>
