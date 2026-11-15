// Local-only prototype: never creates an order, reserves stock, or calculates payment.
const key = 'lcb-preview-selection-v1'
export function usePreviewCart() {
  const items = useState('preview-selection', () => [])
  const loaded = useState('preview-selection-loaded', () => false)
  const count = computed(() => items.value.reduce((n,item)=>n+item.quantity,0))
  function persist(){ if(import.meta.client) localStorage.setItem(key, JSON.stringify(items.value)) }
  onMounted(()=>{
    if(loaded.value) return
    try {
      const data=JSON.parse(localStorage.getItem(key)||'[]')
      if(Array.isArray(data)) items.value=data.filter(i=>i && typeof i.slug==='string' && typeof i.title==='string' && ['product','set'].includes(i.kind) && Number.isInteger(i.quantity) && i.quantity>0 && i.quantity<=20).slice(0,50)
    } catch { items.value=[] }
    loaded.value=true
  })
  function add(item,kind='product'){
    if(!item?.slug || !item?.title || !['product','set'].includes(kind)) return
    const found=items.value.find(i=>i.slug===item.slug&&i.kind===kind)
    if(found) found.quantity=Math.min(found.quantity+1,20)
    else if(items.value.length<50) items.value.push({slug:String(item.slug),title:String(item.title),kind,quantity:1})
    persist()
  }
  function change(item,amount){item.quantity=Math.max(1,Math.min(20,item.quantity+amount));persist()}
  function remove(item){items.value=items.value.filter(i=>!(i.slug===item.slug&&i.kind===item.kind));persist()}
  return {items,count,add,change,remove}
}
