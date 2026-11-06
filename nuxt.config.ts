export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  routeRules: { '/aboutus.php': { redirect: '/about' }, '/gallery.php': { redirect: '/gallery' }, '/contactus.php': { redirect: '/contact' } },
  css: ['~/assets/css/main.css'],
  app: { head: { htmlAttrs: { lang: 'th' }, title: 'แหลมฉบังอินเตอร์ออโต้ไทร์ | ศูนย์บริการรถยนต์ครบวงจร', meta: [{ name: 'description', content: 'ศูนย์บริการยางและดูแลรถยนต์ แหลมฉบัง ศรีราชา ชลบุรี' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }], link: [{ rel: 'preconnect', href: 'https://fonts.googleapis.com' }, { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Prompt:wght@400;500;600;700&display=swap' }] } },
})
