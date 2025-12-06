<template>
  <div class="particle-image-container">
    <div :id="canvasId" class="particle-canvas"></div>
    <img
        :src="imageUrl"
        :alt="altText"
        class="particle-image"
        @load="onImageLoad"
        @error="onImageError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
    validator: (value) => {
      return value.startsWith('http') || value.startsWith('/') || value.startsWith('./')
    }
  },
  altText: {
    type: String,
    default: 'Particle image'
  },
  particleColor: {
    type: String,
    default: '#ffffff'
  },
  maxParticleSize: {
    type: Number,
    default: 10,
    validator: (value) => value > 0 && value <= 20
  },
  lineColor: {
    type: String,
    default: '#ffffff'
  },
  lineWidth: {
    type: Number,
    default: 1
  }
})

const canvasId = ref(`particle-canvas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
const particlesInstance = ref(null)
const isImageLoaded = ref(false)
const imageAspectRatio = ref(0)

const loadParticlesJS = () => {
  return new Promise((resolve) => {
    if (typeof window.particlesJS !== 'undefined') {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
    script.onload = () => resolve()
    script.onerror = () => console.error('Failed to load particles.js')
    document.head.appendChild(script)
  })
}

const initParticles = () => {
  if (!isImageLoaded.value) return

  const particlesConfig = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: props.particleColor
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        },
        max: props.maxParticleSize
      },
      line_linked: {
        enable: true, // Bật kết nối dây
        distance: 150, // Khoảng cách tối đa để nối dây
        color: props.lineColor, // Màu của dây nối
        opacity: 0.4, // Độ trong suốt của dây nối
        width: props.lineWidth // Độ dày của dây nối
      },
      move: {
        enable: true,
        speed: { min: 0.5, max: 2 },
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  }

  if (window.particlesJS) {
    particlesInstance.value = window.particlesJS(canvasId.value, particlesConfig)
  }
}

const onImageLoad = (event) => {
  const img = event.target
  imageAspectRatio.value = img.naturalHeight / img.naturalWidth
  isImageLoaded.value = true

  nextTick(() => {
    initParticles()
  })
}

const onImageError = () => {
  console.error(`Failed to load image: ${props.imageUrl}`)
}

const destroyParticles = () => {
  if (particlesInstance.value && particlesInstance.value.pJSDom && particlesInstance.value.pJSDom[0]) {
    particlesInstance.value.pJSDom[0].pJS.fn.vendors.destroypJS()
    particlesInstance.value = null
  }
}

onMounted(async () => {
  await loadParticlesJS()
})

onBeforeUnmount(() => {
  destroyParticles()
})
</script>

<style scoped>
.particle-image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.particle-image {
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  z-index: 0;
}
</style>