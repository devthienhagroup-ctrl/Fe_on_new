<template>
  <div class="facebook-section">
    <div id="fb-root"></div>
    <div
        class="fb-page"
        data-href="https://www.facebook.com/profile.php?id=61557872978828"
        data-tabs="timeline"
        data-width="400"
        data-height="300"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true">
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Load Facebook SDK
  if (!document.getElementById('facebook-jssdk')) {
    const fbScript = document.createElement('script')
    fbScript.id = 'facebook-jssdk'
    fbScript.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0'
    fbScript.async = true
    fbScript.defer = true
    fbScript.crossOrigin = 'anonymous'
    document.body.appendChild(fbScript)
  }

  // Re-render Facebook widgets khi component mounted
  if (window.FB) {
    window.FB.XFBML.parse()
  }
})
</script>