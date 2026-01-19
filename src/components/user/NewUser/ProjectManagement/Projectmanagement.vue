<template>
  <div class="main-container mt-20" :style="cssVars">
    <!-- HERO SECTION -->
    <section class="hero-container flex items-center justify-center relative pt-20">
      <!-- Particle Background -->
      <div class="particle-bg">
        <div v-for="(particle, index) in config.particles" :key="index" class="particle" :style="{
          width: particle.size,
          height: particle.size,
          left: particle.position,
          animationDelay: particle.delay
        }"></div>
      </div>

      <!-- Left Floating Elements - Desktop only -->
      <div class="floating-element desktop-only" :style="{
        width: config.floatingElements.rocket.size,
        height: config.floatingElements.rocket.size,
        top: config.floatingElements.rocket.position.top,
        left: config.floatingElements.rocket.position.left,
        animationDelay: config.floatingElements.rocket.animationDelay
      }">
        <div class="icon-wrapper flex items-center justify-center w-full h-full">
          <i :class="config.floatingElements.rocket.icon" class="text-4xl text-gradient-primary"></i>
        </div>
      </div>

      <div class="floating-element desktop-only" v-for="(stat, index) in config.stats.desktopLeft" :key="'left-' + index" :style="{
        width: stat.size.width,
        height: stat.size.height,
        top: stat.position.top,
        left: stat.position.left,
        animationDelay: stat.animationDelay
      }">
        <div class="stat-card">
          <div class="stat-number count-up" :data-count="stat.value">{{ stat.displayValue }}</div>
          <p class="text-slate-400 text-sm uppercase tracking-widest mt-2">{{ stat.label }}</p>
          <div class="absolute bottom-4 right-4" :class="stat.iconColor">
            <i :class="stat.icon" class="text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Right Floating Elements - Desktop only -->
      <div class="floating-element desktop-only" :style="{
        width: config.floatingElements.chart.size,
        height: config.floatingElements.chart.size,
        top: config.floatingElements.chart.position.top,
        right: config.floatingElements.chart.position.right,
        animationDelay: config.floatingElements.chart.animationDelay
      }">
        <div class="icon-wrapper flex items-center justify-center w-full h-full">
          <i :class="config.floatingElements.chart.icon" class="text-3xl text-gradient-primary"></i>
        </div>
      </div>

      <div class="floating-element desktop-only" v-for="(stat, index) in config.stats.desktopRight" :key="'right-' + index" :style="{
        width: stat.size.width,
        height: stat.size.height,
        top: stat.position.top,
        right: stat.position.right,
        animationDelay: stat.animationDelay
      }">
        <div class="stat-card">
          <div class="stat-number count-up" :data-count="stat.value">{{ stat.displayValue }}</div>
          <p class="text-slate-400 text-sm uppercase tracking-widest mt-2">{{ stat.label }}</p>
          <div class="absolute bottom-4 right-4" :class="stat.iconColor">
            <i :class="stat.icon" class="text-2xl"></i>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 lg:px-6 relative z-10">
        <div class="text-center max-w-5xl mx-auto">
          <!-- Badge -->
          <div
              class="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8"
              data-aos="fade-up">
            <span class="text-blue-400 rounded-full animate-pulse"><i :class="config.hero.badge.icon"></i></span>
            <span class="text-blue-400 font-medium">{{ config.hero.badge.text }}</span>
          </div>

          <!-- Main Title -->
          <h1 class="hero-title mb-8" data-aos="fade-up" data-aos-delay="200">
            <span class="">{{ config.hero.title.part1 }}</span>
            <br>
            <span class="text-white">{{ config.hero.title.part2 }}</span>
            <br>
            <span class="text-gradient-primary">{{ config.hero.title.part3 }}</span>
          </h1>

          <!-- Description -->
          <p class="text-xl text-slate-300 mb-12 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="400">
            <b class="text-white">{{ config.hero.description.highlight }}</b> {{ config.hero.description.text }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16" data-aos="fade-up"
               data-aos-delay="600">
            <button class="btn-gradient">
              <i :class="config.hero.buttons.demo.icon" class="mr-2"></i> {{ config.hero.buttons.demo.text }}
            </button>
            <button class="btn-secondary">
              <i :class="config.hero.buttons.consultation.icon" class="mr-2"></i> {{ config.hero.buttons.consultation.text }}
            </button>
          </div>

          <!-- Stats card for mobile - chỉ hiện trên mobile -->
          <div class="mobile-stats mt-12" data-aos="fade-up" data-aos-delay="800">
            <div class="stats-grid">
              <div class="stat-card" v-for="(stat, index) in config.stats.mobile" :key="'mobile-' + index">
                <div class="stat-number count-up" :data-count="stat.value">{{ stat.displayValue }}</div>
                <p class="text-slate-400 text-sm uppercase tracking-widest mt-2">{{ stat.label }}</p>
                <div class="absolute bottom-4 right-4" :class="stat.iconColor">
                  <i :class="stat.icon" class="text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" data-aos="fade-up"
           data-aos-delay="1000">
        <div class="w-8 h-12 border-2 border-blue-500/30 rounded-full flex justify-center">
          <div class="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>

    <!-- FEATURE SHOWCASE -->
    <section class="feature-showcase bg-slate-900">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">
            <i :class="config.features.badge.icon" class="mr-2"></i> {{ config.features.badge.text }}
          </h2>
          <h3 class="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            {{ config.features.title.part1 }} <span class="text-gradient-primary">{{ config.features.title.part2 }}</span>
          </h3>
          <p class="text-slate-400 text-lg max-w-3xl mx-auto">
            {{ config.features.description }}
          </p>
        </div>

        <!-- Showcase 1: AI-Powered -->
        <div class="showcase-container mb-20" data-aos="fade-right">
          <div class="showcase-content">
            <div
                class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <span class="text-blue-400 font-medium">{{ config.showcases.ai.badge }}</span>
            </div>
            <h4 class="text-3xl font-bold text-white mb-6">{{ config.showcases.ai.title.part1 }} <span
                class="text-gradient-primary">{{ config.showcases.ai.title.part2 }}</span></h4>
            <p class="text-slate-300 mb-8">
              {{ config.showcases.ai.description }}
            </p>
            <ul class="space-y-4">
              <li v-for="(feature, index) in config.showcases.ai.features" :key="'ai-feature-' + index" class="flex items-start">
                <i :class="feature.icon" class="mt-1 mr-3"></i>
                <span class="text-slate-300">{{ feature.text }}</span>
              </li>
            </ul>
          </div>
          <div class="showcase-visual">
            <div class="showcase-card glow">
              <div class="flex items-center justify-center h-64 mb-6">
                <div class="relative mx-auto w-48 h-48">
                  <!-- Outer spinning rings -->
                  <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                  <div
                      class="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin">
                  </div>

                  <!-- Middle pulsing ring -->
                  <div class="absolute inset-6 border-4 border-purple-500/20 rounded-full"></div>
                  <div
                      class="absolute inset-6 border-4 border-transparent border-r-purple-500 rounded-full animate-spin"
                      style="animation-delay: -0.5s; animation-duration: 1.5s"></div>

                  <!-- Inner pulsing gradient circle -->
                  <div
                      class="absolute inset-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse">
                  </div>

                  <!-- AI Brain Icon -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <i :class="config.showcases.ai.visual.icon" class="text-white text-6xl"></i>
                  </div>
                </div>
              </div>

              <div class="text-center mb-4">
                <div class="text-5xl font-bold text-gradient-primary mb-2 typewriter-text">{{ config.showcases.ai.visual.value }}</div>
                <p class="text-slate-400">{{ config.showcases.ai.visual.label }}</p>
              </div>

              <div class="flex justify-center space-x-2 mt-4">
                <div v-for="(dot, index) in config.showcases.ai.visual.dots" :key="'dot-' + index" class="w-2 h-2 rounded-full animate-bounce" :class="dot.color" :style="{ animationDelay: dot.delay }">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Showcase 2: Kanban Interactive -->
        <div class="showcase-container flex-row-reverse mb-20" data-aos="fade-left">
          <div class="showcase-content">
            <div
                class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <span class="text-purple-400 font-medium">{{ config.showcases.kanban.badge }}</span>
            </div>
            <h4 class="text-3xl font-bold text-white mb-6">{{ config.showcases.kanban.title.part1 }} <span
                class="text-gradient-primary">{{ config.showcases.kanban.title.part2 }}</span></h4>
            <p class="text-slate-300 mb-8">
              {{ config.showcases.kanban.description }}
            </p>

            <button class="btn-secondary">
              <i :class="config.showcases.kanban.button.icon" class="mr-2"></i> {{ config.showcases.kanban.button.text }}
            </button>
          </div>
          <div class="showcase-visual">
            <div class="showcase-card">
              <div class="flex items-center justify-center h-64 mb-6">
                <i :class="config.showcases.kanban.visual.icon" class="text-8xl text-gradient-primary"></i>
              </div>
              <div class="text-center">
                <div class="text-5xl font-bold text-gradient-primary mb-2">{{ config.showcases.kanban.visual.value }}</div>
                <p class="text-slate-400">{{ config.showcases.kanban.visual.label }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Kanban Preview -->
        <div class="kanban-preview mb-8">
          <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 divide-x divide-slate-700/40"
              id="kanban-board"
          >
            <!-- Cột 1: Cần Làm -->
            <div class="text-center kanban-column ps-4" v-for="(column, index) in config.kanban.columns" :key="'column-' + index"
                 :data-status="column.status" @drop="drop" @dragover="allowDrop">
              <div :class="column.titleColor" class="font-bold mb-4">{{ column.title }}</div>
              <div class="space-y-3 min-h-[200px]">
                <div v-for="(task, taskIndex) in column.tasks" :key="'task-' + taskIndex"
                     class="task rounded-lg p-3 cursor-move draggable" :class="task.classes"
                     :draggable="true" :id="'task' + (taskIndex + 1 + column.taskOffset)" @dragstart="drag">
                  <div class="text-sm font-medium">{{ task.title }}</div>
                  <div :class="task.statusColor" class="text-xs mt-1">{{ task.statusText }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 text-center">
            <p class="text-slate-400 text-sm mb-3"><span class="text-blue-400">{{ config.kanban.instruction.highlight }}</span> {{ config.kanban.instruction.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFITS CAROUSEL -->
    <section class="benefits-carousel bg-slate-950">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">
            <i :class="config.benefits.badge.icon" class="mr-2"></i> {{ config.benefits.badge.text }}
          </h2>
          <h3 class="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            {{ config.benefits.title.part1 }} <span class="text-gradient-primary">{{ config.benefits.title.part2 }}</span>
          </h3>
        </div>

        <!-- Carousel Container -->
        <div class="glide benefits-slider relative" data-aos="fade-up">
          <div class="glide__track" data-glide-el="track">
            <div class="glide__slides py-4">
              <!-- Slide 1 -->
              <div class="glide__slide" v-for="benefit in config.benefits.items" :key="benefit.id">
                <SimpleGlassCard
                    :title="benefit.title"
                    :description="benefit.description"
                    :icon="benefit.icon"
                    :color="benefit.color"
                    :hover-effect="true"
                />
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="glide__arrows d-none" data-glide-el="controls">
            <button
                class="glide__arrow glide__arrow--left absolute !-left-12 md:!-left-20 top-1/2 transform -translate-y-1/2"
                data-glide-dir="<">
              <i class="fas fa-chevron-left text-2xl text-white bg-slate-800/70 hover:bg-slate-800 rounded-full w-12 h-12 flex items-center justify-center"></i>
            </button>
            <button
                class="glide__arrow glide__arrow--right absolute !-right-12 md:!-right-20 top-1/2 transform -translate-y-1/2"
                data-glide-dir=">">
              <i class="fas fa-chevron-right text-2xl text-white bg-slate-800/70 hover:bg-slate-800 rounded-full w-12 h-12 flex items-center justify-center"></i>
            </button>
          </div>

          <!-- Bullets -->
          <div class="glide__bullets flex justify-center mt-8 gap-2" data-glide-el="controls[nav]">
            <button v-for="(bullet, index) in config.benefits.carouselBullets" :key="'bullet-' + index"
                    class="glide__bullet w-3 h-3 rounded-full bg-slate-700 hover:bg-blue-500 transition-colors"
                    :data-glide-dir="'=' + index"></button>
          </div>
        </div>
      </div>
    </section>

    <!-- INTERACTIVE TIMELINE -->
    <section class="interactive-timeline bg-slate-900">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">
            <i :class="config.timeline.badge.icon" class="mr-2"></i> {{ config.timeline.badge.text }}
          </h2>
          <h3 class="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            {{ config.timeline.title.part1 }} <span class="text-gradient-primary">{{ config.timeline.title.part2 }}</span>
          </h3>
        </div>

        <div class="max-w-4xl mx-auto" data-aos="fade-up">
          <div class="relative">
            <!-- Timeline Line -->
            <div
                class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500">
            </div>

            <!-- Timeline Items -->
            <div class="space-y-20">
              <!-- Item 1 -->
              <div v-for="(item, index) in config.timeline.items" :key="'timeline-' + index" class="flex items-center">
                <div v-if="index % 2 === 0" class="w-1/2 pr-12 text-right" data-aos="fade-right">
                  <h4 class="text-2xl font-bold text-white mb-2">{{ item.title }}</h4>
                  <p class="text-slate-400">{{ item.description }}</p>
                </div>
                <div v-else class="w-1/2 pr-12 text-right" data-aos="fade-right">
                  <div :class="item.timeColor" class="text-lg font-semibold">{{ item.timeLabel }}</div>
                </div>

                <div class="flex-shrink-0 relative z-10">
                  <div class="timeline-node">
                    <span class="text-white font-bold">{{ item.number }}</span>
                  </div>
                </div>

                <div v-if="index % 2 === 0" class="w-1/2 pl-12" data-aos="fade-left">
                  <div :class="item.timeColor" class="text-lg font-semibold">{{ item.timeLabel }}</div>
                </div>
                <div v-else class="w-1/2 pl-12" data-aos="fade-left">
                  <h4 class="text-2xl font-bold text-white mb-2">{{ item.title }}</h4>
                  <p class="text-slate-400">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-16" data-aos="fade-up">
          <button class="btn-gradient">
            <i :class="config.timeline.button.icon" class="mr-2"></i> {{ config.timeline.button.text }}
          </button>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="cta-section">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="max-w-4xl mx-auto">
          <div class="cta-card text-center" data-aos="zoom-in">
            <!-- Badge -->
            <div
                class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8">
              <span
                  class="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
              <span class="text-gradient-primary font-bold">{{ config.cta.badge.text }}</span>
            </div>

            <!-- Title -->
            <h3 class="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              {{ config.cta.title.line1 }} <span class="text-gradient-primary">{{ config.cta.title.line2 }}</span>
              <br>
              {{ config.cta.title.line3 }}
            </h3>

            <!-- Description -->
            <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              {{ config.cta.description.part1 }} <span class="text-white font-bold">{{ config.cta.description.highlight }}</span>
              {{ config.cta.description.part2 }}
            </p>

            <!-- Features -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div v-for="(feature, index) in config.cta.features" :key="'feature-' + index" class="flex flex-col items-center p-4">
                <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    :style="{ background: feature.bgGradient }">
                  <i :class="feature.icon" class="text-2xl text-gradient-primary"></i>
                </div>
                <span class="text-white font-medium">{{ feature.text }}</span>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button class="btn-gradient">
                <i :class="config.cta.buttons.primary.icon" class="mr-2"></i> {{ config.cta.buttons.primary.text }}
              </button>
              <button class="btn-secondary">
                <i :class="config.cta.buttons.secondary.icon" class="mr-2"></i> {{ config.cta.buttons.secondary.text }}
              </button>
            </div>

            <!-- Guarantee -->
            <div class="mt-10 pt-6 border-t border-slate-700/50">
              <div class="flex items-center justify-center gap-2 text-slate-400">
                <i :class="config.cta.guarantee.icon" class="text-emerald-400"></i>
                <span>{{ config.cta.guarantee.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {onMounted, ref, computed, reactive} from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Glide from '@glidejs/glide'
import '@glidejs/glide/dist/css/glide.core.min.css'
import '@glidejs/glide/dist/css/glide.theme.min.css'
import SimpleGlassCard from "../../UI/SimpleGlassCard.vue";
import api from "../../../../api/api.js";

// CONFIG OBJECT
const config = reactive({
  // Colors and gradients
  colors: {
    blue400: 'var(--color-blue-400)',
    blue500: 'var(--color-blue-500)',
    blue600: 'var(--color-blue-600)',
    blue700: 'var(--color-blue-700)',
    purple500: 'var(--color-purple-500)',
    purple600: 'var(--color-purple-600)',
    slate300: 'var(--color-slate-300)',
    slate400: 'var(--color-slate-400)',
    slate700: 'var(--color-slate-700)',
    slate900: 'var(--color-slate-900)',
    emerald500: 'var(--color-emerald-500)',
    emerald600: 'var(--color-emerald-600)',
    cyan400: 'var(--color-cyan-400)',
    pink500: 'var(--color-pink-500)'
  },

  gradients: {
    primary: 'linear-gradient(90deg, #60a5fa, #8b5cf6)',
    secondary: 'linear-gradient(90deg, #22d3ee, #ec4899)',
    heroBg: `linear-gradient(145deg,
      rgba(15, 23, 42, 0.95) 0%,
      rgba(30, 41, 59, 0.92) 50%,
      rgba(15, 23, 42, 0.95) 100%),
      radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
    ctaBg: `linear-gradient(135deg,
      rgba(15, 23, 42, 0.95) 0%,
      rgba(30, 41, 59, 0.9) 50%,
      rgba(15, 23, 42, 0.95) 100%),
      radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)`
  },

  // Hero section
  hero: {
    badge: {
      icon: 'fas fa-star',
      text: 'CÔNG NGHỆ ĐỘT PHÁ 2026'
    },
    title: {
      part1: 'Quản Lý Dự Án',
      part2: 'Thông Minh Với',
      part3: 'AI & Thời Gian Thực'
    },
    description: {
      highlight: 'Dự Án & Tiến Độ',
      text: '- Công cụ quản lý dự án bất động sản thế hệ mới, tích hợp trí tuệ nhân tạo và công nghệ thời gian thực, giúp bạn kiểm soát mọi khía cạnh của dự án chỉ với một cú nhấp chuột.'
    },
    buttons: {
      demo: {
        icon: 'fas fa-play-circle',
        text: 'TRẢI NGHIỆM DEMO'
      },
      consultation: {
        icon: 'fas fa-calendar-alt',
        text: 'ĐẶT LỊCH TƯ VẤN'
      }
    }
  },

  // Stats
  stats: {
    desktopLeft: [
      {
        value: 12500,
        displayValue: '0',
        label: 'Dự Án Đang Chạy',
        icon: 'fas fa-project-diagram',
        iconColor: 'text-blue-500/20',
        size: { width: '300px', height: '150px' },
        position: { top: '25%', left: '7%' },
        animationDelay: '0.5s'
      },
      {
        value: 94.3,
        displayValue: '0',
        label: 'Đúng Tiến Độ',
        icon: 'fas fa-chart-line',
        iconColor: 'text-purple-500/20',
        size: { width: '300px', height: '150px' },
        position: { top: '42%', left: '7%' },
        animationDelay: '0s'
      }
    ],
    desktopRight: [
      {
        value: 62,
        displayValue: '0',
        label: 'Tăng Năng Suất',
        icon: 'fas fa-bolt',
        iconColor: 'text-cyan-400/20',
        size: { width: '300px', height: '150px' },
        position: { top: '5%', right: '10%' },
        animationDelay: '1s'
      },
      {
        value: 8500,
        displayValue: '0',
        label: 'Môi Giới Tin Dùng',
        icon: 'fas fa-user-check',
        iconColor: 'text-emerald-500/20',
        size: { width: '300px', height: '150px' },
        position: { top: '25%', right: '10%' },
        animationDelay: '1.5s'
      }
    ],
    mobile: [
      {
        value: 12500,
        displayValue: '0',
        label: 'Dự Án Đang Chạy',
        icon: 'fas fa-project-diagram',
        iconColor: 'text-blue-500/20'
      },
      {
        value: 94.3,
        displayValue: '0',
        label: 'Đúng Tiến Độ',
        icon: 'fas fa-chart-line',
        iconColor: 'text-purple-500/20'
      },
      {
        value: 8500,
        displayValue: '0',
        label: 'Môi Giới Tin Dùng',
        icon: 'fas fa-user-check',
        iconColor: 'text-emerald-500/20'
      },
      {
        value: 62,
        displayValue: '0',
        label: 'Tăng Năng Suất',
        icon: 'fas fa-bolt',
        iconColor: 'text-cyan-400/20'
      }
    ]
  },

  // Floating elements
  floatingElements: {
    rocket: {
      icon: 'fas fa-rocket text-4xl text-gradient-primary',
      size: '150px',
      position: { top: '5%', left: '7%' },
      animationDelay: '0s'
    },
    chart: {
      icon: 'fas fa-chart-line text-3xl text-gradient-primary',
      size: '150px',
      position: { top: '42%', right: '10%' },
      animationDelay: '1s'
    }
  },

  // Particles
  particles: [
    { size: '20px', position: '10%', delay: '0s' },
    { size: '15px', position: '25%', delay: '5s' },
    { size: '25px', position: '50%', delay: '10s' },
    { size: '18px', position: '75%', delay: '15s' },
    { size: '22px', position: '90%', delay: '20s' }
  ],

  // Features section
  features: {
    badge: {
      icon: 'fas fa-star',
      text: 'TÍNH NĂNG ĐỘT PHÁ'
    },
    title: {
      part1: 'Công Nghệ',
      part2: 'Làm Thay Đổi Cuộc Chơi'
    },
    description: 'Khám phá bộ công cụ quản lý dự án đầu tiên tại Việt Nam được thiết kế riêng cho ngành bất động sản'
  },

  // Showcases
  showcases: {
    ai: {
      badge: 'AI THÔNG MINH',
      title: {
        part1: 'Dự Đoán Tiến Độ Với',
        part2: 'Trí Tuệ Nhân Tạo'
      },
      description: 'Hệ thống AI của chúng tôi phân tích hàng nghìn dự án tương tự để dự đoán chính xác tiến độ, cảnh báo rủi ro và đề xuất giải pháp tối ưu. Độ chính xác lên đến 94% giúp bạn luôn đi trước một bước.',
      features: [
        { icon: 'fas fa-check-circle text-emerald-500', text: 'Phân tích dự đoán rủi ro tự động' },
        { icon: 'fas fa-check-circle text-emerald-500', text: 'Đề xuất điều chỉnh kế hoạch thông minh' },
        { icon: 'fas fa-check-circle text-emerald-500', text: 'Tối ưu hóa phân bổ nguồn lực' }
      ],
      visual: {
        icon: 'fas fa-brain',
        value: '94%',
        label: 'Độ chính xác dự đoán',
        dots: [
          { color: 'bg-blue-400', delay: '0s' },
          { color: 'bg-purple-400', delay: '0.2s' },
          { color: 'bg-blue-400', delay: '0.4s' }
        ]
      }
    },
    kanban: {
      badge: 'KANBAN 3D',
      title: {
        part1: 'Quản Lý Công Việc',
        part2: 'Trực Quan Nhất'
      },
      description: 'Bảng Kanban 3D với hiệu ứng hình ảnh sống động, cho phép kéo thả công việc giữa các cột trạng thái. Tích hợp timeline tương tác và thông báo thời gian thực.',
      button: {
        icon: 'fas fa-hand-pointer',
        text: 'TRẢI NGHIỆM KANBAN 3D'
      },
      visual: {
        icon: 'fas fa-columns',
        value: '75%',
        label: 'Giảm thời gian quản lý'
      }
    }
  },

  // Kanban
  kanban: {
    columns: [
      {
        status: 'todo',
        title: 'Cần Làm',
        titleColor: 'text-blue-400',
        taskOffset: 0,
        tasks: [
          {
            title: 'Tìm khách hàng',
            statusText: 'Hạn: 15/11',
            classes: 'bg-blue-500/10',
            statusColor: 'text-blue-400'
          },
          {
            title: 'Chuẩn bị tài liệu',
            statusText: 'Hạn: 16/11',
            classes: 'bg-blue-500/10',
            statusColor: 'text-blue-400'
          }
        ]
      },
      {
        status: 'doing',
        title: 'Đang Làm',
        titleColor: 'text-amber-400',
        taskOffset: 2,
        tasks: [
          {
            title: 'Đàm phán HĐ',
            statusText: 'Đang thực hiện',
            classes: 'bg-amber-500/10',
            statusColor: 'text-amber-400'
          }
        ]
      },
      {
        status: 'review',
        title: 'Xem Xét',
        titleColor: 'text-emerald-400',
        taskOffset: 3,
        tasks: [
          {
            title: 'Kiểm tra tài liệu',
            statusText: 'Chờ duyệt',
            classes: 'bg-emerald-500/10',
            statusColor: 'text-emerald-400'
          }
        ]
      },
      {
        status: 'done',
        title: 'Hoàn Thành',
        titleColor: 'text-green-400',
        taskOffset: 4,
        tasks: [
          {
            title: 'Khảo sát thị trường',
            statusText: 'Hoàn thành 10/11',
            classes: 'bg-green-500/10',
            statusColor: 'text-green-400'
          },
          {
            title: 'Phân tích đối thủ',
            statusText: 'Hoàn thành 08/11',
            classes: 'bg-green-500/10',
            statusColor: 'text-green-400'
          }
        ]
      }
    ],
    instruction: {
      highlight: 'Kéo và thả',
      text: 'các task giữa các cột để trải nghiệm!'
    }
  },

  // Benefits
  benefits: {
    badge: {
      icon: 'fas fa-trophy',
      text: 'LỢI ÍCH NỔI BẬT'
    },
    title: {
      part1: 'Tại Sao',
      part2: 'Hơn 8.500 Môi Giới'
    },
    items: [
      {
        id: 1,
        title: 'Tăng 62% Năng Suất',
        description: 'Tự động hóa 80% công việc quản lý dự án, giúp môi giới tập trung vào bán hàng và chốt giao dịch.',
        icon: 'fas fa-bolt',
        color: '#60a5fa',
      },
      {
        id: 2,
        title: '94.3% Dự Án Đúng Tiến Độ',
        description: 'Hệ thống cảnh báo thông minh giúp phát hiện và xử lý rủi ro từ sớm, đảm bảo tiến độ dự án.',
        icon: 'fas fa-chart-line',
        color: '#a78bfa',
      },
      {
        id: 3,
        title: 'Hợp Tác Nhóm Liền Mạch',
        description: 'Kết nối mọi thành viên trong một nền tảng, giảm 75% email nội bộ và họp không cần thiết.',
        icon: 'fas fa-users',
        color: '#34d399',
      },
      {
        id: 4,
        title: 'Đa Nền Tảng',
        description: 'Truy cập từ mọi thiết bị: Web, iOS, Android. Đồng bộ thời gian thực, làm việc mọi lúc mọi nơi.',
        icon: 'fas fa-mobile-alt',
        color: '#06b6d4',
      },
      {
        id: 5,
        title: 'Báo Cáo Thông Minh',
        description: 'Hơn 50 mẫu báo cáo tự động, phân tích dữ liệu theo thời gian thực, hỗ trợ ra quyết định nhanh chóng.',
        icon: 'fas fa-chart-pie',
        color: '#ec4899',
      },
      {
        id: 6,
        title: 'Bảo Mật Tuyệt Đối',
        description: 'Mã hóa end-to-end, xác thực 2 lớp, backup tự động hàng ngày đảm bảo an toàn dữ liệu tuyệt đối.',
        icon: 'fas fa-shield-alt',
        color: '#22d3ee',
      }
    ],
    carouselBullets: 6
  },

  // Timeline
  timeline: {
    badge: {
      icon: 'fas fa-road',
      text: 'HÀNH TRÌNH TRIỂN KHAI'
    },
    title: {
      part1: 'Bắt Đầu Trong',
      part2: 'Chưa Đầy 48 Giờ'
    },
    items: [
      {
        number: '01',
        title: 'Đăng Ký & Thiết Lập',
        description: 'Tạo tài khoản và thiết lập workspace trong 10 phút. Nhập dự án hiện có hoặc bắt đầu từ template.',
        timeLabel: 'Thời gian: 10 phút',
        timeColor: 'text-blue-400'
      },
      {
        number: '02',
        title: 'Nhập Dữ Liệu & Đào Tạo',
        description: 'Nhập dữ liệu dự án và tham gia buổi đào tạo trực tuyến với chuyên gia của chúng tôi.',
        timeLabel: 'Thời gian: 15 phút',
        timeColor: 'text-purple-400'
      },
      {
        number: '03',
        title: 'Vận Hành & Tối Ưu',
        description: 'Bắt đầu quản lý dự án thực tế. Nhận phân tích và tối ưu hóa tự động từ hệ thống AI.',
        timeLabel: 'Thời gian: 24 giờ',
        timeColor: 'text-emerald-400'
      }
    ],
    button: {
      icon: 'fas fa-calendar-check',
      text: 'ĐĂNG KÝ TRIỂN KHAI NGAY'
    }
  },

  // CTA Section
  cta: {
    badge: {
      text: 'ƯU ĐÃI ĐẶC BIỆT'
    },
    title: {
      line1: 'Sẵn Sàng',
      line2: 'Cách Mạng Hóa',
      line3: 'Quy Trình Quản Lý Dự Án?'
    },
    description: {
      part1: 'Đăng ký ngay hôm nay để nhận',
      highlight: '30 NGÀY DÙNG THỬ MIỄN PHÍ',
      part2: 'và tặng kèm gói tư vấn chuyển đổi số trị giá 15 triệu đồng.'
    },
    features: [
      {
        icon: 'fas fa-gift',
        bgGradient: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
        text: '30 ngày dùng thử'
      },
      {
        icon: 'fas fa-headset',
        bgGradient: 'linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
        text: 'Hỗ trợ 24/7 chuyên nghiệp'
      },
      {
        icon: 'fas fa-lock',
        bgGradient: 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(34, 211, 238, 0.2))',
        text: 'Bảo mật tuyệt đối'
      }
    ],
    buttons: {
      primary: {
        icon: 'fas fa-rocket',
        text: 'BẮT ĐẦU DÙNG THỬ MIỄN PHÍ'
      },
      secondary: {
        icon: 'fas fa-phone-alt',
        text: 'GỌI TƯ VẤN: 1900 1001'
      }
    },
    guarantee: {
      icon: 'fas fa-shield-alt',
      text: 'Cam kết hoàn tiền 100% trong 14 ngày nếu không hài lòng'
    }
  }
});

const loadConfig = async () => {
  const response = await api.get('/thg/public/cms/contentSection/62');

  if (response.status === 200) {
    const apiConfig = JSON.parse(response.data.contentJson);

    // Hàm đệ quy để xử lý toàn bộ object
    const wrapCssVariables = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;

      const result = {};

      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value.startsWith('--')) {
          // Nếu bắt đầu bằng -- thì bọc lại bằng var()
          result[key] = `var(${value})`;
        } else if (typeof value === 'object' && value !== null) {
          // Đệ quy xử lý object lồng nhau
          result[key] = wrapCssVariables(value);
        } else {
          // Giữ nguyên các giá trị khác
          result[key] = value;
        }
      }

      return result;
    };

    // Áp dụng cho toàn bộ config
    const processedConfig = wrapCssVariables(apiConfig);

    // Cập nhật config
    Object.assign(config, processedConfig)

    console.log('Config đã được xử lý:', processedConfig);
  }
};

// CSS Variables computed from config
const cssVars = computed(() => ({
  '--color-blue-400': config.colors.blue400,
  '--color-blue-500': config.colors.blue500,
  '--color-blue-600': config.colors.blue600,
  '--color-blue-700': config.colors.blue700,
  '--color-purple-500': config.colors.purple500,
  '--color-purple-600': config.colors.purple600,
  '--color-slate-300': config.colors.slate300,
  '--color-slate-400': config.colors.slate400,
  '--color-slate-700': config.colors.slate700,
  '--color-slate-900': config.colors.slate900,
  '--color-emerald-500': config.colors.emerald500,
  '--color-emerald-600': config.colors.emerald600,
  '--color-cyan-400': config.colors.cyan400,
  '--color-pink-500': config.colors.pink500,
  '--gradient-primary': config.gradients.primary,
  '--gradient-secondary': config.gradients.secondary,
  '--gradient-hero-bg': config.gradients.heroBg,
  '--gradient-cta-bg': config.gradients.ctaBg
}))

// Tham chiếu cho Glide slider
let glide = ref(null)

// Kanban drag and drop functions
const allowDrop = (ev) => {
  ev.preventDefault()
}

const drag = (ev) => {
  ev.dataTransfer.setData("text", ev.target.id)
  ev.target.classList.add('dragging')
}

const drop = (ev) => {
  ev.preventDefault()
  const data = ev.dataTransfer.getData("text")
  const draggedElement = document.getElementById(data)

  // Find closest column
  const column = ev.target.closest('.kanban-column')
  if (column) {
    const taskContainer = column.querySelector('.space-y-3')

    // Thay vì thay đổi border, thêm lớp tạm thời để highlight
    column.classList.add('drop-highlight')

    // Add task to new column
    taskContainer.appendChild(draggedElement)

    // Drop effect
    draggedElement.style.transform = 'scale(1.05)'
    draggedElement.style.transition = 'transform 0.3s ease'

    setTimeout(() => {
      draggedElement.style.transform = 'scale(1)'
      draggedElement.classList.remove('dragging')
      // Xóa lớp highlight sau khi hiệu ứng kết thúc
      column.classList.remove('drop-highlight')
    }, 300)

    // Update task status
    updateTaskStatus(draggedElement, column.dataset.status)
  }
}

const updateTaskStatus = (taskElement, status) => {
  const statusMap = {
    'todo': {color: 'blue-400', text: 'Cần Làm'},
    'doing': {color: 'amber-400', text: 'Đang Làm'},
    'review': {color: 'emerald-400', text: 'Xem Xét'},
    'done': {color: 'green-400', text: 'Hoàn Thành'}
  }

  const statusInfo = statusMap[status]
  if (statusInfo) {
    // Update color
    const colorClass = `bg-${statusInfo.color.split('-')[0]}-500/10`
    taskElement.className = taskElement.className.replace(/bg-(blue|amber|emerald|green)-500\/10/g, colorClass)

    // Update status text if exists
    const statusText = taskElement.querySelector('.text-xs')
    if (statusText) {
      if (status === 'done') {
        statusText.textContent = `Hoàn thành ${new Date().toLocaleDateString('vi-VN')}`
        statusText.className = statusText.className.replace(/text-(blue|amber|emerald|green)-400/g, `text-${statusInfo.color}`)
      } else if (status === 'doing') {
        statusText.textContent = 'Đang thực hiện'
        statusText.className = statusText.className.replace(/text-(blue|amber|emerald|green)-400/g, `text-${statusInfo.color}`)
      } else if (status === 'review') {
        statusText.textContent = 'Chờ duyệt'
        statusText.className = statusText.className.replace(/text-(blue|amber|emerald|green)-400/g, `text-${statusInfo.color}`)
      } else {
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 3)
        statusText.textContent = `Hạn: ${dueDate.toLocaleDateString('vi-VN')}`
        statusText.className = statusText.className.replace(/text-(blue|amber|emerald|green)-400/g, `text-${statusInfo.color}`)
      }
    }
  }
}

const resetKanban = () => {
  const todoColumn = document.querySelector('[data-status="todo"] .space-y-3')
  const doingColumn = document.querySelector('[data-status="doing"] .space-y-3')
  const reviewColumn = document.querySelector('[data-status="review"] .space-y-3')
  const doneColumn = document.querySelector('[data-status="done"] .space-y-3')

      // Clear all tasks
  ;[todoColumn, doingColumn, reviewColumn, doneColumn].forEach(col => {
    col.innerHTML = ''
  })

  // Add initial tasks
  const tasks = [
    {id: 'task1', content: 'Tìm khách hàng', status: 'todo', due: '15/11'},
    {id: 'task2', content: 'Chuẩn bị tài liệu', status: 'todo', due: '16/11'},
    {id: 'task3', content: 'Đàm phán HĐ', status: 'doing'},
    {id: 'task4', content: 'Kiểm tra tài liệu', status: 'review'},
    {id: 'task5', content: 'Khảo sát thị trường', status: 'done', completed: '10/11'},
    {id: 'task6', content: 'Phân tích đối thủ', status: 'done', completed: '08/11'}
  ]

  tasks.forEach(task => {
    const taskElement = document.createElement('div')
    taskElement.className = `task bg-${getStatusColor(task.status)} rounded-lg p-3 cursor-move draggable`
    taskElement.draggable = true
    taskElement.id = task.id
    taskElement.ondragstart = drag

    taskElement.innerHTML = `
      <div class="text-sm font-medium">${task.content}</div>
      <div class="text-xs text-${getStatusTextColor(task.status)} mt-1">
        ${task.status === 'done' ? `Hoàn thành ${task.completed}` :
        task.status === 'doing' ? 'Đang thực hiện' :
            task.status === 'review' ? 'Chờ duyệt' : `Hạn: ${task.due}`}
      </div>
    `

    document.querySelector(`[data-status="${task.status}"] .space-y-3`).appendChild(taskElement)
  })
}

const getStatusColor = (status) => {
  const colors = {
    'todo': 'blue-500/10',
    'doing': 'amber-500/10',
    'review': 'emerald-500/10',
    'done': 'green-500/10'
  }
  return colors[status] || 'blue-500/10'
}

const getStatusTextColor = (status) => {
  const colors = {
    'todo': 'blue-400',
    'doing': 'amber-400',
    'review': 'emerald-400',
    'done': 'green-400'
  }
  return colors[status] || 'blue-400'
}

// Animated counters
const startCounter = (counter) => {
  const target = +counter.getAttribute('data-count')
  const suffix = counter.innerText.replace(/[0-9.]/g, '') || ''
  const count = +counter.innerText.replace(/[^0-9.]/g, '') || 0

  const duration = 2000
  const steps = 60
  const stepTime = duration / steps
  const increment = target / steps
  let current = 0
  let step = 0

  const timer = setInterval(() => {
    step++
    current = Math.min(increment * step, target)

    if (suffix === '%') {
      counter.innerText = current.toFixed(1) + suffix
    } else {
      counter.innerText = Math.floor(current).toLocaleString() + suffix
    }

    if (step >= steps) {
      clearInterval(timer)
      if (suffix === '%') {
        counter.innerText = target.toFixed(1) + suffix
      } else {
        counter.innerText = target.toLocaleString() + suffix
      }
    }
  }, stepTime)
}

// Particle animation
const createParticles = () => {
  const particleBg = document.querySelector('.particle-bg')
  if (!particleBg) return

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'

    const size = Math.random() * 20 + 10
    const left = Math.random() * 100
    const delay = Math.random() * 20

    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${left}%`
    particle.style.animationDelay = `${delay}s`

    particleBg.appendChild(particle)
  }
}

// Khởi tạo Glide slider
const initGlideSlider = () => {
  const benefitsSlider = document.querySelector('.benefits-slider')
  if (!benefitsSlider) return

  glide.value = new Glide(benefitsSlider, {
    type: 'carousel',
    startAt: 0,
    perView: 3,
    gap: 24,
    autoplay: 4000,
    hoverpause: true,
    breakpoints: {
      1280: {
        perView: 3
      },
      1024: {
        perView: 2
      },
      768: {
        perView: 2
      },
      640: {
        perView: 1
      },
      480: {
        perView: 1
      }
    }
  })

  glide.value.mount()
}

onMounted(async () => {

  console.log("Chuẩn bị load config")
  await loadConfig();
  console.log("Đã load")

  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  })

  // Initialize counters
  const counters = document.querySelectorAll('.count-up')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  })

  counters.forEach(counter => {
    const suffix = counter.getAttribute('data-count').includes('.') ? '%' : ''
    counter.innerText = '0' + suffix
    observer.observe(counter)
  })

  // Initialize Kanban
  resetKanban()

  // Create particles
  createParticles()

  // Initialize Glide slider
  initGlideSlider()

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()

      const targetId = this.getAttribute('href')
      if (targetId === '#') return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        })
      }
    })
  })

  // Interactive button effects
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-5px)'
    })

    button.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)'
    })
  })

  // Add scroll effect to highlight current section
  window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section')
    const scrollPosition = window.scrollY + 100

    sections.forEach(section => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      const sectionId = section.getAttribute('id')

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Add active class if needed
      }
    })
  })

  // Add ripple effect to buttons
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span')
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.classList.add('ripple')

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.main-container {
  font-family: 'Inter', sans-serif;
  background-color: var(--color-slate-900);
  color: white;
  overflow-x: hidden;
}

.font-display {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
}

.bg-brand-dark {
  background-color: var(--color-slate-900);
}

/* Gradient Text */
.text-gradient-primary {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-secondary {
  background: var(--gradient-secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hero Section */
.hero-container {
  min-height: 100vh;
  background: var(--gradient-hero-bg),
  url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.hero-title {
  font-size: 4.5rem;
  line-height: 1.1;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
}

.hero-title span {
  position: relative;
  display: inline-block;
}

/* Floating Elements - FIXED ANIMATION */
.floating-element {
  position: absolute;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  z-index: 50;
  transition: all 0.5s ease;
  animation: float 6s ease-in-out infinite;
}

.floating-element .icon-wrapper {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

.floating-element:hover, .stat-card:hover {
  transform: translateY(-10px) scale(1.05);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
}

/* Float Animation Keyframes */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(5deg);
  }
  66% {
    transform: translateY(10px) rotate(-5deg);
  }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}

.stat-card {
  background: linear-gradient(145deg,
  rgba(15, 23, 42, 0.8),
  rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  height: 150px;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg,
  rgba(59, 130, 246, 0.1),
  rgba(139, 92, 246, 0.1));
  opacity: 0;
  transition: opacity 0.4s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 900;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

/* Feature Showcase */
.feature-showcase {
  position: relative;
  padding: 8rem 0;
  overflow: hidden;
}

.showcase-container {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.showcase-content {
  flex: 1;
}

.showcase-visual {
  flex: 1;
  position: relative;
}

.showcase-card {
  background: linear-gradient(145deg,
  rgba(15, 23, 42, 0.9),
  rgba(30, 41, 59, 0.9));
  border-radius: 24px;
  padding: 3rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.showcase-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: 24px 24px 0 0;
}

/* Interactive Kanban Preview */
.kanban-preview {
  position: relative;
  padding: 2rem;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  overflow: hidden;
}

.kanban-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
  rgba(59, 130, 246, 0.05),
  rgba(139, 92, 246, 0.05));
  z-index: 1;
}

/* Benefits Carousel - GLIDE CUSTOM STYLES */
.benefits-carousel {
  position: relative;
  padding: 6rem 0;
}

.benefit-slide {
  background: linear-gradient(145deg,
  rgba(15, 23, 42, 0.9),
  rgba(30, 41, 59, 0.9));
  border-radius: 24px;
  padding: 3rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  height: 100%;
  transition: all 0.4s ease;
}

.benefit-slide:hover {
  transform: translateY(-10px);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
}

/* Glide Custom Styles */
.benefits-slider .glide__slide {
  padding: 0 12px;
  height: auto;
}

.benefits-slider .glide__arrow {
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.benefits-slider .glide__arrow:hover {
  opacity: 0.8;
}

.benefits-slider .glide__bullet--active {
  background-color: var(--color-blue-500) !important;
}



@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* Interactive Timeline */
.interactive-timeline {
  position: relative;
  padding: 6rem 0;
}

.timeline-node {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  position: relative;
  z-index: 2;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.timeline-node:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
}

/* CTA Section */
.cta-section {
  position: relative;
  padding: 10rem 0;
  background: var(--gradient-cta-bg);
  overflow: hidden;
}

.cta-card {
  background: linear-gradient(145deg,
  rgba(15, 23, 42, 0.9),
  rgba(30, 41, 59, 0.9));
  border-radius: 32px;
  padding: 4rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  position: relative;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
  rgba(59, 130, 246, 0.1),
  rgba(139, 92, 246, 0.1));
  opacity: 0;
  transition: opacity 0.4s ease;
}

.cta-card:hover::before {
  opacity: 1;
}

/* Button Styles */
.btn-primary {
  background: var(--gradient-primary);
  color: white;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4);
  background: linear-gradient(90deg,
  var(--color-blue-600),
  var(--color-purple-600));
}

.btn-secondary {
  background: transparent;
  color: white;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  border: 2px solid rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.btn-secondary:hover {
  border-color: var(--color-blue-500);
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

/* Particle Background */
.particle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: var(--gradient-primary);
  border-radius: 50%;
  opacity: 0.3;
  animation: particle-float 20s linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
  }
}

/* Kanban drag and drop styles */
.kanban-column {
  min-height: 300px;
  transition: all 0.3s ease;
}

.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.task {
  user-select: none;
  transition: all 0.3s ease;
}

.task:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.typewriter-text {
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: 0.15em;
  animation: typewriter 1s steps(10, end);
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* RESPONSIVE DESIGN - ĐÃ SỬA */
/* Desktop: Hiển thị floating elements, ẩn mobile stats */
@media (min-width: 1024px) {
  .floating-element.desktop-only {
    display: block;
  }

  .mobile-stats {
    display: none !important;
  }
}

/* Tablet: Ẩn floating elements, hiển thị mobile stats */
@media (max-width: 1023px) {
  .floating-element.desktop-only {
    display: none !important;
  }

  .mobile-stats {
    display: block;
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .showcase-container {
    flex-direction: column;
  }

  /* Glide responsive */
  .benefits-slider .glide__slide {
    padding: 0 8px;
  }
}

/* Mobile nhỏ: 1 cột cho stats */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .kanban-preview {
    padding: 1rem;
  }

  #kanban-board {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .kanban-column {
    min-height: 150px;
  }

  /* Glide mobile */
  .benefits-slider .glide__arrows {
    display: none;
  }
}

/* Additional responsive fixes */
@media (max-width: 640px) {
  .btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .cta-card {
    padding: 2rem;
  }

  .benefit-slide {
    padding: 2rem;
  }
}

.glide__bullets {
  bottom: -30px;
}

/* Trong phần scoped styles */
.drop-highlight {
  position: relative;
}

.drop-highlight::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: calc(-1px - 1.5rem);
  bottom: -1px;
  border: 1px dashed rgba(59, 130, 246, 0.5);
  border-radius: 8px;
  pointer-events: none;
  animation: drop-pulse 0.5s ease-out;
  /*width: calc(100% + 1.5rem);*/
}

@keyframes drop-pulse {
  0% {
    border-color: rgba(59, 130, 246, 0.8);
    transform: scale(1);
  }
  50% {
    border-color: rgba(59, 130, 246, 0.4);
    transform: scale(1.02);
  }
  100% {
    border-color: rgba(59, 130, 246, 0);
    transform: scale(1);
  }
}
</style>