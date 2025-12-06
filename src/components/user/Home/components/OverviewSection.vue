<template>
  <div class="morph-section">
    <div class="sv-container">
      <!-- Cột trái -->
      <div class="left-column">
        <img class="logo" src="/imgs/logoTHG.png" alt="">
        <div class="nav-list">
          <div
              v-for="(item, index) in navItems"
              :key="item.key"
              class="nav-item"
              :class="{ active: currentKey === item.key }"
              @click="morphTo(item.key, index)"
          >
            <div class="nav-item-bg"></div>
            <span class="nav-item-text">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Cột phải -->
      <div class="right-column">
        <div class="content-wrapper">
          <!-- Title section -->
          <div class="title-section">
            <h2 class="title"
                :key="currentKey + '-title'"
                v-html="currentTitle">
            </h2>
            <div class="title-decoration"></div>
          </div>

          <!-- SVG container -->
          <div class="svg-container">
            <svg ref="svgRef" :viewBox="currentViewBox" class="morph-svg">
              <path v-for="(path, index) in currentPaths"
                    :key="index"
                    :ref="el => setPathRef(el, index)"
                    :d="path.d"
                    :fill="path.fill"
                    :stroke="path.stroke"
                    :stroke-width="path.strokeWidth"/>
            </svg>
          </div>

          <!-- Text content -->
          <div class="text-content"
               :key="currentKey + '-text'"
               v-html="currentText">
          </div>
        </div>
      </div>
    </div>

    <!-- Debug info -->
    <div class="debug-info" v-if="debug">
      <p>Current: {{ currentKey }}</p>
      <p>Status: {{ status }}</p>
      <p>Path Count: {{ pathCount }}</p>
      <p>Active Index: {{ activeIndex }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import gsap from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

// Đăng ký plugin MorphSVG
gsap.registerPlugin(MorphSVGPlugin)

// ref
const svgRef = ref(null)
const pathRefs = ref([])
const status = ref('idle')
const pathCount = ref(0)
const debug = ref(false)
const currentViewBox = ref('0 0 100 100')

// State
const currentPaths = ref([])
const currentKey = ref('tamnhin')
const activeIndex = ref(0)

// Dữ liệu navigation
const navItems = [
  { key: 'tamnhin', label: 'Tầm nhìn' },
  { key: 'sumenh', label: 'Sứ mệnh' },
  { key: 'giatri', label: 'Giá trị cốt lõi' }
]

// Text content tương ứng
const textContents = {
  tamnhin: '<b>Thiên Hà Group</b> hướng đến trở thành đơn vị tư vấn mua bán và đầu tư bất động sản uy tín hàng đầu Việt Nam, ' +
      'mang đến cho khách hàng những giá trị bền vững và khác biệt. Chúng tôi không ngừng đổi mới để xây dựng hệ sinh ' +
      'thái bất động sản toàn diện, góp phần nâng tầm chất lượng dịch vụ và phát triển thị trường một cách chuyên nghiệp, ' +
      'minh bạch.',
  sumenh: 'Với sứ mệnh <b>"Bất động sản thật – Giá trị thật"</b>, Thiên Hà Group cam kết mang đến giải pháp bán nhanh, an toàn và hiệu quả, giúp khách hàng giao dịch thành công trong 30 ngày. Chúng tôi đặt uy tín và sự minh bạch lên hàng đầu, đồng hành cùng khách hàng trong hành trình đầu tư, hướng đến giá trị thật và lợi ích thật.',
  giatri: '<b>Thiên Hà Group</b> sở hữu đội ngũ chuyên nghiệp, giàu kinh nghiệm hơn 15 năm cùng hơn 500 giao dịch thành công. Chúng tôi coi con người là nền tảng, lấy tận tâm và chuyên nghiệp làm kim chỉ nam để mang đến sự hài lòng, niềm tin và giá trị bền vững cho khách hàng.'
}

// Titles tương ứng
const titles = {
  tamnhin: 'Khát vọng vươn tầm – Dẫn đầu thị trường BĐS Việt Nam',
  sumenh: 'Kiến tạo giá trị thật – Gắn kết niềm tin thật',
  giatri: 'Con người – Kinh nghiệm – Niềm tin tạo nên thành công'
}

// Computed
const currentText = computed(() => textContents[currentKey.value])
const currentTitle = computed(() => titles[currentKey.value])

// Đã bỏ sliderStyle computed property

// đường dẫn các SVG
const svgs = {
  tamnhin: {
    from: '/imgs/svg-tamnhin.svg',
    to: '/imgs/svg-tamnhin-1.svg'
  },
  sumenh: {
    from: '/imgs/svg-sumenh.svg',
    to: '/imgs/svg-sumenh-1.svg'
  },
  giatri: {
    from: '/imgs/svg-giatri.svg',
    to: '/imgs/svg-giatri-1.svg'
  }
}

// Helper function để set refs
function setPathRef(el, index) {
  if (el) {
    pathRefs.value[index] = el
  }
}

// Hàm parse SVG và extract paths
function parseSvg(svgText) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svgElement = doc.querySelector('svg')

  if (!svgElement) {
    throw new Error('Invalid SVG format')
  }

  // Lấy viewBox
  const viewBox = svgElement.getAttribute('viewBox') || '0 0 100 100'

  // Extract tất cả paths
  const paths = []
  const pathElements = svgElement.querySelectorAll('path')

  pathElements.forEach((pathEl, index) => {
    paths.push({
      d: pathEl.getAttribute('d') || '',
      fill: pathEl.getAttribute('fill') || '#6C63FF',
      stroke: pathEl.getAttribute('stroke') || 'none',
      strokeWidth: pathEl.getAttribute('stroke-width') || '0',
      opacity: pathEl.getAttribute('opacity') || '1'
    })
  })

  return { viewBox, paths }
}

// Hàm load file SVG
async function loadSvg(path) {
  try {
    status.value = `Loading: ${path}`
    const res = await fetch(path)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const text = await res.text()
    console.log('Loaded SVG:', path)
    return text
  } catch (error) {
    console.error('Error loading SVG:', path, error)
    status.value = `Error loading: ${path}`
    // Fallback SVG đơn giản
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20,20 L80,20 L80,80 L20,80 Z" fill="#6C63FF"/></svg>'
  }
}

// Hàm chuẩn bị morph - tạo paths với số lượng bằng nhau
function prepareMorphPaths(currentPaths, targetPaths) {
  const maxPaths = Math.max(currentPaths.length, targetPaths.length)
  const preparedCurrent = []
  const preparedTarget = []

  for (let i = 0; i < maxPaths; i++) {
    // Nếu current path không tồn tại, tạo path rỗng
    if (!currentPaths[i]) {
      preparedCurrent.push({
        d: 'M50,50 L50,50',
        fill: targetPaths[i]?.fill || '#6C63FF',
        stroke: 'none',
        strokeWidth: '0',
        opacity: '0'
      })
    } else {
      preparedCurrent.push(currentPaths[i])
    }

    // Nếu target path không tồn tại, tạo path rỗng
    if (!targetPaths[i]) {
      preparedTarget.push({
        d: 'M50,50 L50,50',
        fill: currentPaths[i]?.fill || '#6C63FF',
        stroke: 'none',
        strokeWidth: '0',
        opacity: '0'
      })
    } else {
      preparedTarget.push(targetPaths[i])
    }
  }

  return { preparedCurrent, preparedTarget }
}

// Hàm hiển thị SVG "from" trước
async function showFromSvgFirst(fromPaths, fromViewBox) {
  return new Promise((resolve) => {
    // Cập nhật ngay lập tức SVG "from"
    currentPaths.value = fromPaths
    currentViewBox.value = fromViewBox
    pathCount.value = fromPaths.length

    nextTick(() => {
      // Đảm bảo SVG đã được render
      gsap.set(pathRefs.value, {
        opacity: 1
      })

      // Delay 50ms rồi resolve
      setTimeout(resolve, 50)
    })
  })
}

// Hàm animation cho text
function animateText() {
  // Tạo timeline cho text animation
  const textTimeline = gsap.timeline()

  // Animation cho title
  textTimeline.fromTo('.title',
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, 0
  )

  // Animation cho text content
  textTimeline.fromTo('.text-content',
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, 0.3
  )

  return textTimeline
}

// Hàm morph chính
async function performMorph(targetPaths, targetViewBox) {
  return new Promise((resolve) => {
    const { preparedCurrent, preparedTarget } = prepareMorphPaths(currentPaths.value, targetPaths)

    const timeline = gsap.timeline({
      onComplete: resolve
    })

    // Animation cho viewBox
    timeline.to(svgRef.value, {
      attr: { viewBox: targetViewBox },
      duration: 1.2,
      ease: 'power2.inOut'
    }, 0)

    // Animation cho từng path
    preparedTarget.forEach((targetPath, index) => {
      const pathRef = pathRefs.value[index]

      if (pathRef) {
        // Morph shape
        timeline.to(pathRef, {
          morphSVG: targetPath.d,
          duration: 1.5,
          ease: 'power2.inOut'
        }, 0)

        // Animation màu sắc và opacity
        timeline.to(pathRef, {
          fill: targetPath.fill,
          stroke: targetPath.stroke,
          strokeWidth: targetPath.strokeWidth,
          opacity: targetPath.opacity || 1,
          duration: 1.2,
          ease: 'power2.inOut'
        }, 0)
      }
    })

    // Thêm animation cho text cùng lúc với SVG
    timeline.add(animateText(), 0)

    // Cập nhật state sau khi animation
    timeline.call(() => {
      currentPaths.value = preparedTarget
      currentViewBox.value = targetViewBox
      pathCount.value = preparedTarget.length
    })
  })
}

// Gọi khi bấm vào mục
async function morphTo(key, index) {
  if (key === currentKey.value) {
    console.log('Same key, skipping')
    return
  }

  if (status.value === 'animating') {
    console.log('Animation in progress, skipping')
    return
  }

  status.value = 'animating'
  console.log('Transitioning to:', key, 'Index:', index)

  const target = svgs[key]

  // Cập nhật active index ngay lập tức để màu nền chuyển đến đúng vị trí
  activeIndex.value = index

  try {
    // Ẩn text trước khi bắt đầu transition
    gsap.set(['.title', '.text-content'], {
      opacity: 0,
      y: 10
    })

    // Bước 1: Load cả from và to
    const [fromSvgText, toSvgText] = await Promise.all([
      loadSvg(target.from),
      loadSvg(target.to)
    ])

    const { viewBox: fromViewBox, paths: fromPaths } = parseSvg(fromSvgText)
    const { viewBox: targetViewBox, paths: targetPaths } = parseSvg(toSvgText)

    console.log(`From has ${fromPaths.length} paths, To has ${targetPaths.length} paths`)

    // Bước 2: Hiển thị SVG "from" ngay lập tức và delay 50ms
    status.value = 'Showing FROM SVG...'
    await showFromSvgFirst(fromPaths, fromViewBox)

    // Bước 3: Delay 50ms rồi bắt đầu morph
    status.value = 'Starting morph animation...'

    // Cập nhật currentKey trước khi animation bắt đầu
    // để text content được cập nhật
    currentKey.value = key

    // Thực hiện morph sau delay
    await performMorph(targetPaths, targetViewBox)

    status.value = 'Transition complete'

  } catch (error) {
    console.error('Error in morphTo:', error)
    status.value = `Error: ${error.message}`
  } finally {
    // Reset trạng thái nếu có lỗi
    if (status.value === 'animating') {
      status.value = 'idle'
    }
  }
}

// Khởi tạo component
onMounted(async () => {
  status.value = 'Initializing...'

  try {
    // Load và hiển thị SVG đầu tiên (tamnhin.from)
    const initialSvg = await loadSvg(svgs.tamnhin.from)
    const { viewBox, paths } = parseSvg(initialSvg)

    currentPaths.value = paths
    currentViewBox.value = viewBox
    pathCount.value = paths.length

    status.value = 'Ready'

    await nextTick()

    // Set initial styles
    gsap.set(pathRefs.value, {
      opacity: 1
    })

    // Hiển thị text với animation khi khởi tạo
    gsap.fromTo('.title',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5 }
    )
    gsap.fromTo('.text-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8 }
    )

  } catch (error) {
    console.error('Initialization error:', error)
    status.value = `Init Error: ${error.message}`
  }
})
</script>

<style scoped>
.morph-section {
  width: 100%;
  font-family: 'Ubuntu', sans-serif;
  padding: 0 20px;
}

.sv-container {
  display: flex;
  height: 90vh; /* Cố định chiều cao 80vh */
  min-height: 600px; /* Chiều cao tối thiểu */
  max-height: 800px; /* Chiều cao tối đa */
  max-width: 1400px;
  margin: 60px auto;
  position: relative;
  border-radius: 20px;
  border: solid 2px #031358;
  overflow: hidden;
  box-sizing: border-box;

}

.left-column, .right-column {
  border-radius: 9px;
  box-sizing: border-box;
}

/* Cột trái */
.left-column {
  position: relative;
  width: 400px;
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  overflow: hidden;
  flex-shrink: 0; /* Không cho co lại */
}

/*LOGO left*/
.left-column .logo {
  position: absolute;
  top: 10px;
  width: 50%;
  max-width: 120px;
}

/* Đã bỏ slider-bar */

.nav-list {
  position: relative;
  z-index: 2;
  width: 100%;
}

.nav-item {
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  user-select: none;
  margin: 5px 20px;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
}

.nav-item-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(57, 82, 191, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

.nav-item-text {
  position: relative;
  z-index: 1;
  color: white;
  font-size: 20px;
  transition: all 0.3s ease;
}

.nav-item:hover .nav-item-bg {
  opacity: 0.5;
}

.nav-item.active .nav-item-bg {
  opacity: 1;
}

.nav-item.active .nav-item-text {
  font-weight: bolder;
  color: white;
}

/* Cột phải */
.right-column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 40px;
  overflow: hidden; /* Ẩn overflow */
}

.content-wrapper {
  text-align: center;
  width: 100%; /* Chiếm toàn bộ chiều rộng */
  max-width: 800px; /* Tăng max-width lên */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Title Section */
.title-section {
  margin-bottom: 15px;
  position: relative;
  width: 100%;
}

.title {
  font-size: 26px; /* Tăng kích thước font */
  font-weight: 700;
  color: #031358;
  line-height: 1.4;
  margin: 15px 0;
  text-align: center;
  padding: 0 20px;
  width: 100%;
}

.title-decoration {
  width: 100px; /* Tăng chiều rộng */
  height: 4px; /* Tăng chiều cao */
  background: linear-gradient(90deg, #031358, #0629BE);
  margin: 0 auto;
  border-radius: 2px;
}

/* SVG Container */
.svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  width: 100%;
  flex-shrink: 0;
  max-height: 250px;
}

.morph-svg {
  width: 100%;
  max-width: 500px; /* Giới hạn kích thước SVG */
  height: 250px;
  transform-origin: center;
}

/* Text Content */
.text-content {
  font-size: 18px; /* Tăng kích thước font */
  color: #333;
  line-height: 1.8;
  font-weight: 400;
  text-align: justify;
  text-justify: inter-word;
  padding: 0 20px;
  width: 100%; /* Chiếm toàn bộ chiều rộng */
  max-width: 900px; /* Tăng max-width */
  margin-top: 10px;
  flex-shrink: 0;
}

.text-content b {
  color: #031358;
  font-weight: 600;
}

/* Debug info */
.debug-info {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  z-index: 1000;
}

/* Responsive */
@media (max-width: 1200px) {
  .sv-container {
    max-width: 95%;
    height: 75vh;
  }

  .content-wrapper {
    max-width: 700px;
  }

  .text-content {
    max-width: 800px;
    font-size: 17px;
  }
}

@media (max-width: 1024px) {

  .sv-container {
    flex-direction: column;
    height: auto; /* Bỏ cố định chiều cao trên mobile */
    min-height: auto;
    max-height: none;
  }

  .left-column {
    width: 100%;
    border-radius: 0 0 20px 20px;
    height: 30%;
    min-height: 100px;
    padding: 20px 0;
  }

  .left-column .logo {
    height: auto;
    top: 15px;
    opacity: 0.2;
    max-width: 150px;
  }

  .nav-list {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .nav-item {
    padding: 0 20px;
    font-size: 18px;
    height: 60px;
    margin: 5px 10px;
    flex: 1;
    max-width: 200px;
  }

  .nav-item-text {
    font-size: 18px;
  }

  .right-column {
    padding: 30px 20px;
  }

  .title {
    font-size: 22px;
  }

  .text-content {
    font-size: 16px;
    line-height: 1.7;

    max-width: 100%;
  }

  .morph-svg {
    max-width: 400px;
    height: 250px;
  }

}

@media (max-width: 768px) {
  .sv-container {
    margin: 30px auto;
    border-radius: 15px;
  }

  .content-wrapper {
    max-width: 100%;
  }

  .title {
    font-size: 20px;
    padding: 0 10px;
  }

  .text-content {
    font-size: 15px;
    line-height: 1.6;
    padding: 0 10px;
  }

  .morph-svg {
    height: 200px;
    max-width: 350px;
  }

  .nav-item {
    font-size: 16px;
    height: 50px;
    padding: 0 15px;
    margin: 5px 5px;
  }

  .nav-item-text {
    font-size: 16px;
  }

  .left-column .logo {
    max-width: 120px;
  }
}

@media (max-height: 700px) {
  .sv-container {
  }

  .morph-svg {
    height: 200px;
  }

  .text-content {
    font-size: 16px;
    line-height: 1.6;
  }
}
</style>