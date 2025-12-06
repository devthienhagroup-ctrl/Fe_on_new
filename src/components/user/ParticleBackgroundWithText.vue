<template>
  <div class="particle-container">
    <img
        :src="imageUrl"
        :alt="altText"
        class="background-image"
        @load="onImageLoad"
        @error="onImageError"
    />
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

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
    default: 'Particle background'
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
  },
  particleCount: {
    type: Number,
    default: 300
  },
  animationSpeed: {
    type: Number,
    default: 1.0
  },
  formText: {
    type: String,
    default: 'THG'
  },
  fontSize: {
    type: Number,
    default: 120
  }
})

// Refs
const canvasRef = ref(null)
const isImageLoaded = ref(false)
const animationId = ref(null)
const particles = ref([])
const currentState = ref('RANDOM') // RANDOM, FORMING, FORMED, DISPERSING
const stateTimer = ref(0)
const textPoints = ref([])

// Particle class
class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.reset()
    this.originalX = this.x
    this.originalY = this.y
    this.targetX = this.x
    this.targetY = this.y
    this.speed = 0.02 + Math.random() * 0.03
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.size = Math.random() * (props.maxParticleSize - 2) + 2
    this.baseSize = this.size
    this.vx = (Math.random() - 0.5) * 3
    this.vy = (Math.random() - 0.5) * 3
    this.opacity = Math.random() * 0.5 + 0.3
  }

  setTarget(x, y) {
    this.targetX = x
    this.targetY = y
  }

  update(stateProgress) {
    const speed = props.animationSpeed

    switch (currentState.value) {
      case 'RANDOM':
        this.x += this.vx * speed
        this.y += this.vy * speed

        // Bounce off walls
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1

        this.size = this.baseSize * (0.8 + Math.sin(Date.now() * 0.001) * 0.2)
        break

      case 'FORMING':
        const formProgress = Math.min(stateProgress * 2, 1)
        const easeProgress = 1 - Math.pow(1 - formProgress, 3) // Easing function
        this.x += (this.targetX - this.x) * this.speed * easeProgress * speed
        this.y += (this.targetY - this.y) * this.speed * easeProgress * speed
        this.size = this.baseSize * (0.3 + (1 - easeProgress) * 0.7)
        break

      case 'FORMED':
        this.size = this.baseSize * 0.3
        // Small vibration effect
        this.x += (Math.random() - 0.5) * 0.5
        this.y += (Math.random() - 0.5) * 0.5
        break

      case 'DISPERSING':
        const disperseProgress = Math.min(stateProgress * 2, 1)
        this.x += (this.originalX - this.x) * this.speed * disperseProgress * speed
        this.y += (this.originalY - this.y) * this.speed * disperseProgress * speed
        this.size = this.baseSize * (0.3 + disperseProgress * 0.7)
        break
    }

    // Keep particles within bounds
    this.x = Math.max(0, Math.min(this.canvas.width, this.x))
    this.y = Math.max(0, Math.min(this.canvas.height, this.y))
  }

  draw() {
    this.ctx.fillStyle = props.particleColor
    this.ctx.globalAlpha = this.opacity
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
  }
}

// Improved text points generation
function getTextPoints(text, canvas, ctx) {
  const points = []
  const fontSize = props.fontSize
  const x = canvas.width / 2
  const y = canvas.height / 2

  // Create offscreen canvas for better text rendering
  const offscreen = document.createElement('canvas')
  offscreen.width = canvas.width
  offscreen.height = canvas.height
  const offCtx = offscreen.getContext('2d')

  // Clear and setup offscreen canvas
  offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
  offCtx.fillStyle = '#ffffff'
  offCtx.font = `bold ${fontSize}px Arial, sans-serif`
  offCtx.textAlign = 'center'
  offCtx.textBaseline = 'middle'

  // Draw text
  offCtx.fillText(text, x, y)

  // Add stroke for better coverage
  offCtx.strokeStyle = '#ffffff'
  offCtx.lineWidth = 2
  offCtx.strokeText(text, x, y)

  // Sample points from text
  const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  const spacing = Math.max(3, Math.sqrt((canvas.width * canvas.height) / props.particleCount))

  for (let i = 0; i < canvas.width; i += spacing) {
    for (let j = 0; j < canvas.height; j += spacing) {
      const alpha = data[(j * canvas.width + i) * 4 + 3]
      if (alpha > 50) { // Lower threshold for better coverage
        points.push({
          x: i + (Math.random() - 0.5) * spacing * 0.5,
          y: j + (Math.random() - 0.5) * spacing * 0.5
        })
      }
    }
  }

  // If we don't have enough points, add some random ones within text bounds
  if (points.length < props.particleCount) {
    const textMetrics = offCtx.measureText(text)
    const textWidth = textMetrics.width
    const textHeight = fontSize

    for (let i = points.length; i < props.particleCount; i++) {
      points.push({
        x: x + (Math.random() - 0.5) * textWidth,
        y: y + (Math.random() - 0.5) * textHeight
      })
    }
  }

  return points
}

function assignParticlesToText() {
  if (!textPoints.value.length || !particles.value.length) return

  // Shuffle particles and assign to text points
  const shuffledParticles = [...particles.value].sort(() => Math.random() - 0.5)
  const shuffledPoints = [...textPoints.value].sort(() => Math.random() - 0.5)

  shuffledParticles.forEach((particle, index) => {
    const point = shuffledPoints[index % shuffledPoints.length]
    if (point) {
      particle.setTarget(point.x, point.y)
      particle.originalX = particle.x
      particle.originalY = particle.y
    }
  })
}

// Canvas setup and animation
function initCanvas() {
  if (!canvasRef.value || !isImageLoaded.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // Set canvas size
  const container = canvas.parentElement
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight

  // Generate text points first
  textPoints.value = getTextPoints(props.formText, canvas, ctx)

  // Create particles
  particles.value = []
  for (let i = 0; i < props.particleCount; i++) {
    particles.value.push(new Particle(canvas, ctx))
  }

  // Reset state
  currentState.value = 'RANDOM'
  stateTimer.value = 0

  // Start animation loop
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  animate()
}

function animate() {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Update state timing
  stateTimer.value += 0.016 // ~60fps

  // State transitions
  if (currentState.value === 'RANDOM' && stateTimer.value > 4) {
    // Start forming text
    currentState.value = 'FORMING'
    stateTimer.value = 0
    assignParticlesToText()
  } else if (currentState.value === 'FORMING' && stateTimer.value > 2) {
    currentState.value = 'FORMED'
    stateTimer.value = 0
  } else if (currentState.value === 'FORMED' && stateTimer.value > 1.5) {
    currentState.value = 'DISPERSING'
    stateTimer.value = 0
  } else if (currentState.value === 'DISPERSING' && stateTimer.value > 2) {
    currentState.value = 'RANDOM'
    stateTimer.value = 0
    particles.value.forEach(particle => particle.reset())
  }

  // Update and draw particles
  particles.value.forEach(particle => {
    particle.update(stateTimer.value)
    particle.draw()
  })

  // Draw connections in random and dispersing states
  if (currentState.value === 'RANDOM' || currentState.value === 'DISPERSING') {
    drawConnections(ctx)
  }

  animationId.value = requestAnimationFrame(animate)
}

function drawConnections(ctx) {
  const maxDistance = 80
  ctx.strokeStyle = props.lineColor
  ctx.lineWidth = props.lineWidth

  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const p1 = particles.value[i]
      const p2 = particles.value[j]
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < maxDistance) {
        ctx.globalAlpha = 0.2 * (1 - distance / maxDistance)
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
  }
}

// Event handlers
const onImageLoad = () => {
  isImageLoaded.value = true
  nextTick(() => {
    initCanvas()
  })
}

const onImageError = () => {
  console.error(`Failed to load image: ${props.imageUrl}`)
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', initCanvas)
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  window.removeEventListener('resize', initCanvas)
})

// Watch for prop changes
watch(() => [props.particleCount, props.formText, props.fontSize], () => {
  if (isImageLoaded.value) {
    initCanvas()
  }
})

watch(() => props.imageUrl, () => {
  isImageLoaded.value = false
})
</script>

<style scoped>
.particle-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>