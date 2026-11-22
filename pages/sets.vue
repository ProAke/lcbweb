<script setup>
import { previewSets } from '~/utils/previewSets'
useSeoMeta({title:'ชุดสินค้า | แหลมฉบังอินเตอร์ออโต้ไทร์',description:'ตัวอย่างชุดสินค้าและบริการติดตั้ง'})
</script>
<template><div><div class="page-hero"><div class="wrap"><div class="breadcrumbs"><NuxtLink to="/">หน้าแรก</NuxtLink> / ชุดสินค้า</div><span class="section-kicker light">PRODUCT SETS</span><h1>ชุดสินค้าและบริการ</h1><p>ตัวอย่างการจัดชุดเพื่อช่วยเลือกสินค้าที่เหมาะกับคุณ</p></div></div><section class="section wrap"><p class="demo-notice"><strong>ตัวอย่างเพื่อทดลองเท่านั้น</strong> ชุดสินค้า ราคา ขนาด สต็อก และค่าติดตั้งยังไม่ได้รับการยืนยัน ขณะนี้ยังไม่รับคำสั่งซื้อหรือชำระเงินจริง</p><div class="cards-grid"><PreviewSetCard v-for="item in previewSets" :key="item.slug" :item="item"/></div></section></div></template>
