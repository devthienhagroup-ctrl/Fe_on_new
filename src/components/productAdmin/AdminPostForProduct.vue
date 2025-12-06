<template>
  <DescriptionEditor v-model="worldData" />
</template>

<script setup>
import { ref } from "vue";
import DescriptionEditor from "../common/DescriptionEditor.vue";

const worldData = ref(null);</script>
