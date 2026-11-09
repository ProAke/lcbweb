// Curated from publicly accessible Cockpit pages. Names are reference information,
// not a statement of branch stock, price, current promotion, or vehicle fitment.
const tireSource = 'https://cockpit.co.th/promotion/173/ค็อกพิทเซฟดีล'
const generalSource = 'https://cockpit.co.th/post/677/วิธีการดูแลรักษายางอะไหล่'
const brakeSource = 'https://cockpit.co.th/post/3172/ผ้าเบรค-Bendix-Ultra-Premium-เบรคนุ่มเงียบ-เบรคสั้น-มั่นใจ'
const definitions = [
  ['bridgestone-potenza-re005','BRIDGESTONE POTENZA Adrenalin RE005','ยางรถยนต์','BRIDGESTONE',tireSource],
  ['bridgestone-turanza-6','BRIDGESTONE TURANZA 6','ยางรถยนต์','BRIDGESTONE',tireSource],
  ['bridgestone-ecopia-ep300','BRIDGESTONE ECOPIA EP300','ยางรถยนต์','BRIDGESTONE',tireSource],
  ['bridgestone-ecopia-ep150','BRIDGESTONE ECOPIA EP150','ยางรถยนต์','BRIDGESTONE',tireSource],
  ['bridgestone-alenza-001','BRIDGESTONE ALENZA 001','ยางรถยนต์','BRIDGESTONE',tireSource],
  ['bridgestone-ecopia-hl001','BRIDGESTONE ECOPIA H/L001','ยางรถยนต์','BRIDGESTONE',tireSource],
  ['bridgestone-dueler-at002','BRIDGESTONE DUELER A/T002','ยางรถยนต์','BRIDGESTONE',tireSource],
  ['gs-battery','แบตเตอรี่ GS','แบตเตอรี่','GS',generalSource],
  ['bendix-ultra-premium','ผ้าเบรก Bendix Ultra Premium','ผ้าเบรก','Bendix',brakeSource],
  ['ptt-engine-oil','น้ำมันเครื่อง PTT','น้ำมันและสารเหลว','PTT',generalSource],
]
export const referenceProducts = definitions.map(([slug,title,category,brand,link],index)=>({
  type:'product',slug,title,category,brand,link,image:'',status:'published',sort_order:index+10,
  summary:'ข้อมูลสินค้าอ้างอิงจาก Cockpit กรุณาสอบถามรุ่น ขนาด และสินค้าที่มีในสาขา',
  body:'รายการนี้เป็นข้อมูลสินค้าอ้างอิงจากเว็บไซต์ Cockpit ไม่ใช่การยืนยันสต็อก ราคา หรือโปรโมชั่นของสาขา กรุณาติดต่อร้านเพื่อตรวจสอบรุ่น ขนาด ความเหมาะสมกับรถ และสินค้าที่มีให้บริการก่อนตัดสินใจ',
}))
