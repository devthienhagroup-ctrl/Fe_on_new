<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
//
// const updateScroll = () => {
//   if (route.path === '/-thg/quan-tri-du-lieu/') {
//     document.body.style.overflow = 'hidden'
//   } else {
//     document.body.style.overflow = ''
//   }
// }
//
// watch(
//     () => route.path,
//     () => {
//       updateScroll()
//     },
//     { immediate: true }
// )

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style>
body {
  margin: 0;
  font-family: "Segoe UI", Roboto, sans-serif;
  background-color: #f9f9f9;
}
</style>

