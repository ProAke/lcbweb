<script setup>
const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
const { data: settings } = await useFetch('/api/settings', { default: () => ({}) })
</script>
<template><div><SiteHeader v-if="!isAdmin" :settings="settings"/><main><slot /></main><SiteFooter v-if="!isAdmin" :settings="settings"/></div></template>
