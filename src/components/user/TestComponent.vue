<template>
  <QuickTestApi></QuickTestApi>
  <!--  <cms></cms>-->
  <!--  <Banner></Banner>-->

  <AdvancedEditModal v-model="htmlText"></AdvancedEditModal>
  <div class="rich-text-editor-wrapper">
    <div v-html="htmlText" class="tiptap"></div>
  </div>
</template>
<script setup lang="ts">
import QuickTestApi from "../cms/QuickTestApi.vue";
import Cms from "../cms/cms.vue";
import Banner from "../user/Home/components/Banner.vue";
import RichTextEditor from "../RichTextEditor/RichTextEditor.vue";
import AdvancedEditModal from "../RichTextEditor/AdvancedEditModal.vue";
import {ref} from "vue";


const htmlText = ref('<p>Nội dung mặc định</p>')
</script>


<style>

</style>