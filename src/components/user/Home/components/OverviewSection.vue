<template>
  <div class="morph-section">
    <div class="sv-container">
      <!-- Cột trái -->
      <div class="left-column">
        <img class="logo" :src="config.logo" alt="Logo">
        <div class="nav-wrapper">
          <div class="nav-list" :class="{ 'scrollable': totalNavItems > 3 }" ref="navListRef">
            <div
                v-for="(item, index) in config.navItems"
                :key="item.key"
                class="nav-item"
                :class="{ active: currentKey === item.key }"
                @click="morphTo(item.key, index)"
            >
              <div class="nav-item-bg"></div>
              <span class="nav-item-text">{{ item.label }}</span>
            </div>
          </div>

          <!-- Scroll indicators for mobile -->
          <div v-if="showScrollIndicators" class="scroll-indicators">
            <div class="scroll-indicator left" @click="scrollNav(-1)">
              <span>‹</span>
            </div>
            <div class="scroll-indicator right" @click="scrollNav(1)">
              <span>›</span>
            </div>
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
          <div class="rich-text-editor-wrapper">
          <div class="text-content tiptap"
               :key="currentKey + '-text'"
               v-html="currentText">
          </div>
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
      <p>Total Items: {{ totalNavItems }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onBeforeUnmount, watch } from 'vue'
import gsap from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { baseImgaeUrl } from "../../../../assets/js/global.js";

const props = defineProps({
  content: {
    type: Object
  }
});

// Đăng ký plugin MorphSVG
gsap.registerPlugin(MorphSVGPlugin)

// ===================== CONFIGURATION OBJECT =====================
// Config mặc định
const defaultConfig = {
  logo: '/imgs/logoTHG.png',
  colors: {
    primary: '#031358',
    secondary: '#0629BE',
    accent: '#6C63FF',
    text: '#333',
    white: '#FFFFFF'
  },
  navItems: [
    {
      key: 'tamnhin',
      label: 'Tầm nhìn',
      title: 'Khát vọng vươn tầm – Dẫn đầu thị trường BĐS Việt Nam',
      content: '<b>Thiên Hà Group</b> hướng đến trở thành đơn vị tư vấn mua bán và đầu tư bất động sản uy tín hàng đầu Việt Nam, mang đến cho khách hàng những giá trị bền vững và khác biệt.'
    },
    {
      key: 'sumenh',
      label: 'Sứ mệnh',
      title: 'Kiến tạo giá trị thật – Gắn kết niềm tin thật',
      content: 'Với sứ mệnh <b>"Bất động sản thật – Giá trị thật"</b>, Thiên Hà Group cam kết mang đến giải pháp bán nhanh, an toàn và hiệu quả.'
    },
    {
      key: 'giatri',
      label: 'Giá trị cốt lõi',
      title: 'Con người – Kinh nghiệm – Niềm tin tạo nên thành công',
      content: '<b>Thiên Hà Group</b> sở hữu đội ngũ chuyên nghiệp, giàu kinh nghiệm hơn 15 năm cùng hơn 500 giao dịch thành công.'
    }
  ],
  svgPaths: {
    tamnhin: {
      from: 'svg-tamnhin.svg',
      to: 'svg-tamnhin-1.svg'
    },
    sumenh: {
      from: 'svg-sumenh.svg',
      to: 'svg-sumenh-1.svg'
    },
    giatri: {
      from: 'svg-giatri.svg',
      to: 'svg-giatri-1.svg'
    }
  },
  layout: {
    containerHeight: '90vh',
    containerMinHeight: '600px',
    containerMaxHeight: '800px',
    containerMaxWidth: '1400px',
    leftColumnWidth: '400px',
    svgMaxWidth: '500px',
    svgHeight: '250px',
    textMaxWidth: '900px',
    navItemHeight: '85px'
  },
  fontSizes: {
    title: '26px',
    navItem: '20px',
    textContent: '18px'
  }
}

// Config động - sẽ được cập nhật từ props hoặc dùng default
const config = ref({ ...defaultConfig })

// ref
const svgRef = ref(null)
const pathRefs = ref([])
const navListRef = ref(null)
const status = ref('idle')
const pathCount = ref(0)
const debug = ref(false)
const currentViewBox = ref('0 0 100 100')
const isMobile = ref(false)

// State
const currentPaths = ref([])
const currentKey = ref('')
const activeIndex = ref(0)

// Computed properties
const totalNavItems = computed(() => config.value.navItems?.length || 0)

const currentItem = computed(() => {
  return config.value.navItems?.find(item => item.key === currentKey.value) || config.value.navItems?.[0]
})

const currentText = computed(() => currentItem.value?.content || '')
const currentTitle = computed(() => currentItem.value?.title || '')

// Kiểm tra nếu cần hiển thị scroll indicators (trên mobile)
const showScrollIndicators = computed(() => {
  return isMobile.value && totalNavItems.value > 3
})

// Helper function để set refs
function setPathRef(el, index) {
  if (el) {
    pathRefs.value[index] = el
  }
}

// Hàm kiểm tra responsive
function checkResponsive() {
  isMobile.value = window.innerWidth <= 1024
}

// Hàm scroll navigation (cho mobile)
function scrollNav(direction) {
  if (!navListRef.value) return

  const scrollAmount = 200 // px
  const newScrollLeft = navListRef.value.scrollLeft + (direction * scrollAmount)

  gsap.to(navListRef.value, {
    scrollLeft: newScrollLeft,
    duration: 0.5,
    ease: 'power2.out'
  })
}

// Hàm lấy đường dẫn SVG đầy đủ
function getFullSvgPath(filename) {
  // Nếu không có filename, trả về null
  if (!filename) return null;

  // Nếu đã có base URL hoặc là URL đầy đủ, trả về nguyên bản
  if (filename.startsWith('http') ||
      filename.startsWith('data:') ||
      filename.startsWith(baseImgaeUrl)) {
    return filename;
  }

  // Nếu baseImgaeUrl có / ở cuối và filename có / ở đầu, bỏ một trong hai
  let base = baseImgaeUrl;
  let file = filename;

  // Nếu base kết thúc bằng / và file bắt đầu bằng /, bỏ / của file
  if (base.endsWith('/') && file.startsWith('/')) {
    file = file.substring(1);
  }
  // Nếu base không kết thúc bằng / và file không bắt đầu bằng /, thêm / ở giữa
  else if (!base.endsWith('/') && !file.startsWith('/')) {
    file = '/' + file;
  }

  return base + file;
}

// Hàm lấy SVG config cho key
function getSvgConfig(key) {
  const svgPath = config.value.svgPaths?.[key];

  // Debug log
  console.log('Getting SVG config for key:', key, 'svgPath:', svgPath);

  // Nếu không có config cho key này, sử dụng fallback
  if (!svgPath) {
    const fallbackFrom = getFullSvgPath(`svg-${key}.svg`);
    const fallbackTo = getFullSvgPath(`svg-${key}-1.svg`);
    console.log('Using fallback paths:', fallbackFrom, fallbackTo);
    return {
      from: fallbackFrom,
      to: fallbackTo
    }
  }

  const fromPath = getFullSvgPath(svgPath.from);
  const toPath = getFullSvgPath(svgPath.to);
  console.log('Using configured paths:', fromPath, toPath);

  return {
    from: fromPath,
    to: toPath
  }
}

// Hàm parse SVG và extract paths
function parseSvg(svgText) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svgElement = doc.querySelector('svg')

  if (!svgElement) {
    console.error('Invalid SVG format:', svgText.substring(0, 100));
    throw new Error('Invalid SVG format')
  }

  const viewBox = svgElement.getAttribute('viewBox') || '0 0 100 100'
  const paths = []
  const pathElements = svgElement.querySelectorAll('path')

  pathElements.forEach((pathEl, index) => {
    paths.push({
      d: pathEl.getAttribute('d') || '',
      fill: pathEl.getAttribute('fill') || config.value.colors?.accent || '#6C63FF',
      stroke: pathEl.getAttribute('stroke') || 'none',
      strokeWidth: pathEl.getAttribute('stroke-width') || '0',
      opacity: pathEl.getAttribute('opacity') || '1'
    })
  })

  console.log(`Parsed SVG: ${paths.length} paths, viewBox: ${viewBox}`);
  return { viewBox, paths }
}

// Hàm load file SVG
async function loadSvg(path) {
  if (!path) {
    console.error('No path provided to loadSvg');
    throw new Error('No SVG path provided');
  }

  try {
    status.value = `Loading: ${path}`;
    console.log('Loading SVG from:', path);

    // Lấy đường dẫn đầy đủ
    const fullPath = getFullSvgPath(path);
    console.log('Full SVG path:', fullPath);

    const res = await fetch(fullPath);
    if (!res.ok) {
      // Thử fallback nếu là file "-1.svg"
      if (fullPath.includes('-1.svg')) {
        const fallbackPath = fullPath.replace('-1.svg', '.svg');
        console.log(`Retrying with fallback: ${fallbackPath}`);
        const fallbackFilename = path.replace('-1.svg', '.svg');
        return loadSvg(fallbackFilename);
      }

      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    console.log('Successfully loaded SVG:', fullPath);
    return text;
  } catch (error) {
    console.error('Error loading SVG:', path, error);
    status.value = `Error loading: ${path}`;

    // Fallback SVG đơn giản
    const keyMatch = path?.match(/svg-(\w+)(?:-1)?\.svg/);
    const index = keyMatch ?
        config.value.navItems?.findIndex(item => item.key === keyMatch[1]) || 0 :
        0;

    const size = 80 - (index % 4) * 10;
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="60" height="60" rx="10"
            fill="${config.value.colors?.accent || '#6C63FF'}" opacity="0.8"/>
      <circle cx="50" cy="50" r="${size/2}"
              fill="${config.value.colors?.secondary || '#0629BE'}" opacity="0.5"/>
    </svg>`;
  }
}

// Các hàm khác giữ nguyên (prepareMorphPaths, showFromSvgFirst, animateText, performMorph)

// Hàm chuẩn bị morph
function prepareMorphPaths(currentPaths, targetPaths) {
  const maxPaths = Math.max(currentPaths.length, targetPaths.length);
  const preparedCurrent = [];
  const preparedTarget = [];

  for (let i = 0; i < maxPaths; i++) {
    if (!currentPaths[i]) {
      preparedCurrent.push({
        d: 'M50,50 L50,50',
        fill: targetPaths[i]?.fill || config.value.colors?.accent || '#6C63FF',
        stroke: 'none',
        strokeWidth: '0',
        opacity: '0'
      });
    } else {
      preparedCurrent.push(currentPaths[i]);
    }

    if (!targetPaths[i]) {
      preparedTarget.push({
        d: 'M50,50 L50,50',
        fill: currentPaths[i]?.fill || config.value.colors?.accent || '#6C63FF',
        stroke: 'none',
        strokeWidth: '0',
        opacity: '0'
      });
    } else {
      preparedTarget.push(targetPaths[i]);
    }
  }

  return { preparedCurrent, preparedTarget };
}

// Hàm hiển thị SVG "from" trước
async function showFromSvgFirst(fromPaths, fromViewBox) {
  return new Promise((resolve) => {
    currentPaths.value = fromPaths;
    currentViewBox.value = fromViewBox;
    pathCount.value = fromPaths.length;

    nextTick(() => {
      gsap.set(pathRefs.value, {
        opacity: 1
      });
      setTimeout(resolve, 50);
    });
  });
}

// Hàm animation cho text
function animateText() {
  const textTimeline = gsap.timeline();

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
  );

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
  );

  return textTimeline;
}

// Hàm morph chính
async function performMorph(targetPaths, targetViewBox) {
  return new Promise((resolve) => {
    const { preparedCurrent, preparedTarget } = prepareMorphPaths(currentPaths.value, targetPaths);

    const timeline = gsap.timeline({
      onComplete: resolve
    });

    timeline.to(svgRef.value, {
      attr: { viewBox: targetViewBox },
      duration: 1.2,
      ease: 'power2.inOut'
    }, 0);

    preparedTarget.forEach((targetPath, index) => {
      const pathRef = pathRefs.value[index];

      if (pathRef) {
        timeline.to(pathRef, {
          morphSVG: targetPath.d,
          duration: 1.5,
          ease: 'power2.inOut'
        }, 0);

        timeline.to(pathRef, {
          fill: targetPath.fill,
          stroke: targetPath.stroke,
          strokeWidth: targetPath.strokeWidth,
          opacity: targetPath.opacity || 1,
          duration: 1.2,
          ease: 'power2.inOut'
        }, 0);
      }
    });

    timeline.add(animateText(), 0);

    timeline.call(() => {
      currentPaths.value = preparedTarget;
      currentViewBox.value = targetViewBox;
      pathCount.value = preparedTarget.length;
    });
  });
}

// Gọi khi bấm vào mục
async function morphTo(key, index) {
  if (key === currentKey.value) {
    console.log('Same key, skipping');
    return;
  }

  if (status.value === 'animating') {
    console.log('Animation in progress, skipping');
    return;
  }

  status.value = 'animating';
  console.log('Transitioning to:', key, 'Index:', index);

  const target = getSvgConfig(key);
  activeIndex.value = index;

  try {
    // Scroll đến mục được chọn trên mobile
    if (isMobile.value && navListRef.value) {
      const itemWidth = navListRef.value.querySelector('.nav-item')?.offsetWidth || 150;
      const scrollPos = index * (itemWidth + 16) - (navListRef.value.clientWidth / 2) + (itemWidth / 2);

      gsap.to(navListRef.value, {
        scrollLeft: Math.max(0, scrollPos),
        duration: 0.5,
        ease: 'power2.out'
      });
    }

    gsap.set(['.title', '.text-content'], {
      opacity: 0,
      y: 10
    });

    const [fromSvgText, toSvgText] = await Promise.all([
      loadSvg(target.from),
      loadSvg(target.to)
    ]);

    const { viewBox: fromViewBox, paths: fromPaths } = parseSvg(fromSvgText);
    const { viewBox: targetViewBox, paths: targetPaths } = parseSvg(toSvgText);

    console.log(`From has ${fromPaths.length} paths, To has ${targetPaths.length} paths`);

    status.value = 'Showing FROM SVG...';
    await showFromSvgFirst(fromPaths, fromViewBox);

    status.value = 'Starting morph animation...';
    currentKey.value = key;

    await performMorph(targetPaths, targetViewBox);
    status.value = 'Transition complete';

  } catch (error) {
    console.error('Error in morphTo:', error);
    status.value = `Error: ${error.message}`;
  } finally {
    if (status.value === 'animating') {
      status.value = 'idle';
    }
  }
}

// Khởi tạo component
async function initialize() {
  status.value = 'Initializing...';
  console.log('Initializing with config:', config.value);

  try {
    const firstItem = config.value.navItems?.[0];

    if (!firstItem) {
      throw new Error('No navigation items found in config');
    }

    // Set current key
    currentKey.value = firstItem.key;
    activeIndex.value = 0;

    const initialSvgConfig = getSvgConfig(firstItem.key);
    console.log('Initial SVG config:', initialSvgConfig);

    if (!initialSvgConfig.from) {
      throw new Error('No SVG path found for initial item');
    }

    const initialSvg = await loadSvg(initialSvgConfig.from);
    const { viewBox, paths } = parseSvg(initialSvg);

    currentPaths.value = paths;
    currentViewBox.value = viewBox;
    pathCount.value = paths.length;

    status.value = 'Ready';
    console.log('Initialization complete. Paths loaded:', paths.length);

    await nextTick();

    if (pathRefs.value.length > 0) {
      gsap.set(pathRefs.value, {
        opacity: 1
      });
    }

    // Hiển thị text với animation khi khởi tạo
    gsap.fromTo('.title',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5 }
    );
    gsap.fromTo('.text-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8 }
    );

  } catch (error) {
    console.error('Initialization error:', error);
    status.value = `Init Error: ${error.message}`;

    // Fallback: hiển thị ít nhất một hình vuông
    currentPaths.value = [{
      d: 'M20,20 L80,20 L80,80 L20,80 Z',
      fill: config.value.colors?.accent || '#6C63FF',
      stroke: 'none',
      strokeWidth: '0',
      opacity: '1'
    }];
    currentViewBox.value = '0 0 100 100';
    pathCount.value = 1;
  }
}

// Watch cho props content để cập nhật config
watch(() => props.content, (newContent) => {
  if (newContent?.contentJson) {
    console.log('Received new content from props:', newContent.contentJson);
    config.value = { ...defaultConfig, ...newContent.contentJson };

    // Re-initialize với config mới
    if (svgRef.value) {
      initialize();
    }
  }
}, { immediate: true });

onMounted(async () => {
  // Kiểm tra responsive ban đầu
  checkResponsive();
  window.addEventListener('resize', checkResponsive);

  // Khởi tạo với config hiện tại
  await initialize();
});

// Cleanup
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkResponsive);
});
</script>

<style scoped>
.morph-section {
  width: 100%;
  font-family: 'Ubuntu', sans-serif;
  padding: 0 20px;
}

.sv-container {
  display: flex;
  height: v-bind('config.layout.containerHeight');
  min-height: v-bind('config.layout.containerMinHeight');
  max-height: v-bind('config.layout.containerMaxHeight');
  max-width: v-bind('config.layout.containerMaxWidth');
  margin: 60px auto;
  position: relative;
  border-radius: 20px;
  border: solid 2px v-bind('config.colors.primary');
  overflow: hidden;
  box-sizing: border-box;
}

.left-column, .right-column {
  border-radius: 9px;
  box-sizing: border-box;
}

/* Cột trái - DESKTOP VERSION */
.left-column {
  position: relative;
  width: v-bind('config.layout.leftColumnWidth');
  background: linear-gradient(135deg, v-bind('config.colors.primary') 0%, v-bind('config.colors.secondary') 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 0;
  overflow: hidden;
  flex-shrink: 0;
}

.left-column .logo {
  position: absolute;
  top: 10px;
  width: 50%;
  max-width: 120px;
}

/* Nav wrapper */
.nav-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding-top: 60px; /* Khoảng cách cho logo */
}

/* Nav list - DESKTOP: cuộn dọc nếu nhiều mục */
.nav-list {
  width: 100%;
  height: auto;
  max-height: calc(100% - 80px); /* Giới hạn chiều cao */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto; /* Cuộn dọc */
  overflow-x: hidden; /* Ẩn cuộn ngang */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  padding-right: 5px;
  gap: 5px;
}

.nav-list::-webkit-scrollbar {
  width: 6px;
}

.nav-list::-webkit-scrollbar-track {
  background: transparent;
}

.nav-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.nav-list.scrollable {
  overflow-y: auto; /* Chỉ bật cuộn khi nhiều mục */
}

/* Nav item - DESKTOP */
.nav-item {
  height: v-bind('config.layout.navItemHeight');
  min-height: 85px;
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
  width: calc(100% - 40px);
  flex-shrink: 0;
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
  color: v-bind('config.colors.white');
  font-size: v-bind('config.fontSizes.navItem');
  transition: all 0.3s ease;
  padding: 0 10px;
}

.nav-item:hover .nav-item-bg {
  opacity: 0.5;
}

.nav-item.active .nav-item-bg {
  opacity: 1;
}

.nav-item.active .nav-item-text {
  font-weight: bolder;
  color: v-bind('config.colors.white');
}

/* Scroll indicators (chỉ hiển thị trên mobile) */
.scroll-indicators {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.scroll-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: all;
  transition: background 0.3s ease;
  font-size: 20px;
  font-weight: bold;
}

.scroll-indicator:hover {
  background: rgba(0, 0, 0, 0.5);
}

.scroll-indicator.left {
  left: 10px;
}

.scroll-indicator.right {
  right: 10px;
}

/* Cột phải */
.right-column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: v-bind('config.colors.white');
  padding: 40px;
  overflow: hidden;
}

.content-wrapper {
  text-align: center;
  width: 100%;
  max-width: 800px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title-section {
  margin-bottom: 15px;
  position: relative;
  width: 100%;
}

.title {
  font-size: v-bind('config.fontSizes.title');
  font-weight: 700;
  color: v-bind('config.colors.primary');
  line-height: 1.4;
  margin: 15px 0;
  text-align: center;
  padding: 0 20px;
  width: 100%;
}

.title-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, v-bind('config.colors.primary'), v-bind('config.colors.secondary'));
  margin: 0 auto;
  border-radius: 2px;
}

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
  max-width: v-bind('config.layout.svgMaxWidth');
  height: v-bind('config.layout.svgHeight');
  transform-origin: center;
}

.text-content {
  font-size: v-bind('config.fontSizes.textContent');
  color: v-bind('config.colors.text');
  line-height: 1.8;
  font-weight: 400;
  text-align: justify;
  text-justify: inter-word;
  padding: 0 20px;
  width: 100%;
  max-width: v-bind('config.layout.textMaxWidth');
  margin-top: 10px;
  flex-shrink: 0;
}

.text-content b {
  color: v-bind('config.colors.primary');
  font-weight: 600;
}

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

/* ===================== RESPONSIVE ===================== */

/* Tablet & Mobile (dưới 1024px) */
@media (max-width: 1024px) {
  .sv-container {
    flex-direction: column;
    height: auto;
    min-height: auto;
    max-height: none;
  }

  .left-column {
    width: 100%;
    height: auto;
    min-height: 120px;
    padding: 15px 0;
    border-radius: 0 0 20px 20px;
  }

  .left-column .logo {
    height: auto;
    top: 15px;
    opacity: 0.2;
    max-width: 150px;
  }

  .nav-wrapper {
    padding-top: 0;
    height: auto;
  }

  /* MOBILE: Nav list hiển thị ngang, cuộn ngang */
  .nav-list {
    display: flex;
    flex-direction: row !important; /* Quan trọng: ghi đè desktop */
    overflow-x: auto !important; /* Cuộn ngang */
    overflow-y: hidden !important;
    padding: 10px 15px;
    gap: 10px;
    height: auto;
    max-height: none;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Ẩn scrollbar trên Firefox */
  }

  .nav-list::-webkit-scrollbar {
    display: none; /* Ẩn scrollbar trên Chrome/Safari */
  }

  /* MOBILE: Nav item layout ngang */
  .nav-item {
    flex: 0 0 auto; /* Không co giãn */
    height: 60px;
    min-height: 60px;
    margin: 0;
    width: auto;
    min-width: 150px;
    max-width: 200px;
    scroll-snap-align: start;
  }

  .nav-item-text {
    font-size: 16px;
    white-space: nowrap;
    padding: 0 20px;
  }

  /* Hiển thị scroll indicators trên mobile */
  .scroll-indicators {
    display: flex;
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

/* Mobile nhỏ (dưới 768px) */
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
    min-height: 50px;
    min-width: 130px;
    max-width: 180px;
  }

  .nav-item-text {
    font-size: 14px;
    padding: 0 15px;
  }

  .left-column .logo {
    max-width: 120px;
  }

  .scroll-indicator {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }
}

/* Desktop nhiều mục (trên 1024px) */
@media (min-width: 1025px) {
  /* Nếu có nhiều hơn 5 mục, giảm chiều cao mỗi item */
  .nav-list.scrollable .nav-item {
    height: calc(v-bind('config.layout.navItemHeight') * 0.85);
    min-height: 70px;
  }

  .nav-list.scrollable .nav-item-text {
    font-size: calc(v-bind('config.fontSizes.navItem') * 0.9);
  }
}

/* Màn hình cao (trên 900px height) */
@media (min-height: 900px) and (min-width: 1025px) {
  .nav-list {
    max-height: 70vh; /* Cho phép cuộn nhiều hơn */
  }
}

/* Màn hình thấp (dưới 700px height) */
@media (max-height: 700px) {
  .morph-svg {
    height: 200px;
  }

  .text-content {
    font-size: 16px;
    line-height: 1.6;
  }

  /* Trên desktop, giảm chiều cao nav item */
  @media (min-width: 1025px) {
    .nav-item {
      height: 75px;
      min-height: 75px;
    }
  }
}
</style>