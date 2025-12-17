<template>
  <div v-if="sectionData" class="section section1" :id="sectionData.id">
    <div
        class="decor1"
        :style="{
        height: sectionData.decor1.css.height,
        width: sectionData.decor1.css.width,
        left: sectionData.decor1.position.left,
        right: sectionData.decor1.position.right,
        bottom: sectionData.decor1.position.bottom,
        top: sectionData.decor1.position.top
      }"
    >
      <img :src="baseImgaeUrl+sectionData.decor1.src" :alt="sectionData.decor1.alt">
    </div>

    <div
        class="decor2"
        :style="{
        height: sectionData.decor2.css.height,
        width: sectionData.decor2.css.width,
        left: sectionData.decor2.position.left,
        right: sectionData.decor2.position.right,
        bottom: sectionData.decor2.position.bottom,
        top: sectionData.decor2.position.top
      }"
    >
      <img :src="baseImgaeUrl+sectionData.decor2.src" :alt="sectionData.decor2.alt">
    </div>

    <div class="st-title fade-right">
      <TitleComponent
          :circle-size="sectionData.title.circleSize"
          :icon-height="sectionData.title.iconHeight"
          :icon-width="sectionData.title.iconWidth"
          :order-number="sectionData.title.orderNumber"
          :component-height="sectionData.title.componentHeight"
          :component-width="sectionData.title.componentWidth"
          :icon-url="baseImgaeUrl+sectionData.title.iconUrl"
          :title="sectionData.title.titleText"
      />
    </div>

    <div
        class="main-content-wrapper"
        :style="{ gap: sectionData.layout.gap, flexDirection: flexDirection }"
    >
      <!-- Hiệu ứng xuất hiện -->
      <div
          class="left-content-section fade-left"
          :style="{ flex: columnLeftFlex }"
          v-if="!sectionData.layout.reverseColumns"
      >
        <div
            class="text-content"
            :style="{
            borderTopLeftRadius: sectionData.content.css.borderRadius,
            borderBottomLeftRadius: sectionData.content.css.borderRadius,
            borderTopRightRadius: sectionData.layout.reverseColumns ? sectionData.content.css.borderRadius : '0',
            borderBottomRightRadius: sectionData.layout.reverseColumns ? sectionData.content.css.borderRadius : '0',
            borderRight: sectionData.layout.reverseColumns ? '2px #0827af solid' : '0',
            borderLeft: sectionData.layout.reverseColumns ? '0' : '2px #0827af solid',
            padding: sectionData.content.css.padding
          }"
        >
          <div class="rich-text-editor-wrapper">
          <div class="tiptap" :style="{ fontSize: sectionData.content.css.fontSize }" v-html="sectionData.content.text">
          </div>
          </div>
          <router-link
              :to="sectionData.content.link.to"
              class="detail-button"
              :style="{
              backgroundColor: sectionData.button.backgroundColor,
              fontSize: sectionData.button.fontSize,
              width: sectionData.button.width,
              minWidth: sectionData.button.minWidth,
              borderRadius: sectionData.button.css.borderRadius,
              padding: sectionData.button.css.padding,
              marginLeft: sectionData.layout.reverseColumns ? '30px' : 'auto',
              marginRight: sectionData.layout.reverseColumns ? 'auto' : '30px'
            }"
              @mouseover="hoverButton = true"
              @mouseleave="hoverButton = false"
          >
            {{ sectionData.content.link.text }}
          </router-link>
        </div>
      </div>

      <div
          class="right-content-section fade-right"
          :style="{ flex: columnRightFlex }"
          v-if="!sectionData.layout.reverseColumns"
      >
        <img
            :src="baseImgaeUrl+sectionData.image.src"
            :alt="sectionData.image.alt"
            :style="{ borderRadius: sectionData.image.css.borderRadius }"
        >
      </div>

      <!-- Layout khi đảo cột -->
      <div
          class="right-content-section fade-left"
          :style="{ flex: columnRightFlex }"
          v-if="sectionData.layout.reverseColumns"
      >
        <img
            :src="baseImgaeUrl+sectionData.image.src"
            :alt="sectionData.image.alt"
            :style="{ borderRadius: sectionData.image.css.borderRadius }"
        >
      </div>

      <div
          class="left-content-section fade-right"
          :style="{ flex: columnLeftFlex }"
          v-if="sectionData.layout.reverseColumns"
      >
        <div
            class="text-content"
            :style="{
            borderTopLeftRadius: sectionData.content.css.borderRadius,
            borderBottomLeftRadius: sectionData.content.css.borderRadius,
            borderTopRightRadius: sectionData.layout.reverseColumns ? sectionData.content.css.borderRadius : '0',
            borderBottomRightRadius: sectionData.layout.reverseColumns ? sectionData.content.css.borderRadius : '0',
            borderRight: sectionData.layout.reverseColumns ? '2px #0827af solid' : '0',
            borderLeft: sectionData.layout.reverseColumns ? '0' : '2px #0827af solid',
            padding: sectionData.content.css.padding
          }"
        >
          <p :style="{ fontSize: sectionData.content.css.fontSize }">
            {{ sectionData.content.text }}
          </p>
          <router-link
              :to="sectionData.content.link.to"
              class="detail-button"
              :style="{
              backgroundColor: sectionData.button.backgroundColor,
              fontSize: sectionData.button.fontSize,
              width: sectionData.button.width,
              minWidth: sectionData.button.minWidth,
              borderRadius: sectionData.button.css.borderRadius,
              padding: sectionData.button.css.padding,
              marginLeft: sectionData.layout.reverseColumns ? '30px' : 'auto',
              marginRight: sectionData.layout.reverseColumns ? 'auto' : '30px'
            }"
              @mouseover="hoverButton = true"
              @mouseleave="hoverButton = false"
          >
            {{ sectionData.content.link.text }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TitleComponent from "./TitleQickSale.vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";
const props = defineProps({
  sectionData: Object
})

// Dữ liệu mặc định
const defaultSectionData = {
  id: "section1",
  layout: {
    reverseColumns: false,
    leftColumnWidth: "1",
    rightColumnWidth: "1.4",
    gap: "30px"
  },
  decor1: {
    src: "/imgs/trang-tri-1.png",
    alt: "",
    position: {
      left: "0",
      right: "auto",
      bottom: "0",
      top: "auto"
    },
    css: {
      height: "100px",
      width: "auto"
    }
  },
  decor2: {
    src: "/imgs/trang-tri-2.png",
    alt: "",
    position: {
      left: "auto",
      right: "0",
      bottom: "0",
      top: "auto"
    },
    css: {
      height: "700px",
      width: "auto"
    }
  },
  title: {
    circleSize: 100,
    iconHeight: 109,
    iconWidth: 109,
    orderNumber: 1,
    componentHeight: "80px",
    componentWidth: "100%",
    iconUrl: "/imgs/icon-dinh-gia-so-bo.png",
    titleText: "Định giá sơ bộ"
  },
  content: {
    text: "Đây là nền tảng đầu tiên và quan trọng nhất trong quy trình. Đội ngũ chuyên viên sẽ tiến hành định giá sơ bộ thông qua hệ thống chuyên nghiệp, giúp khách hàng biết được giá trị thật của bất động sản trước khi bán.",
    link: {
      to: "/dinh-gia-bds",
      text: "Xem chi tiết"
    },
    css: {
      borderRadius: "150px",
      padding: "50px 50px 10px",
      fontSize: "17px"
    }
  },
  image: {
    src: "file_20251209_235748_919.png",
    alt: "dgsb",
    css: {
      borderRadius: "10px"
    }
  },
  button: {
    backgroundColor: "#0827af",
    hoverColor: "#041b6a",
    fontSize: "17px",
    width: "40%",
    minWidth: "150px",
    css: {
      borderRadius: "50px",
      padding: "12px 24px"
    }
  },
  border: {
    color: "#c2cbf0",
    width: "5px",
    style: "dashed",
    position: {
      top: "-10px",
      right: "0",
      width: "80%",
      height: "110%",
      marginRight: "75px"
    }
  }
};

// Sử dụng dữ liệu từ props hoặc dữ liệu mặc định
const sectionData = computed(() => {
  return props.sectionData.section1 || defaultSectionData;
});

const hoverButton = ref(false);

// Computed properties
const flexDirection = computed(() => {
  return sectionData.value.layout.reverseColumns ? "row-reverse" : "row";
});

const columnLeftFlex = computed(() => {
  return sectionData.value.layout.reverseColumns ?
      sectionData.value.layout.rightColumnWidth :
      sectionData.value.layout.leftColumnWidth;
});

const columnRightFlex = computed(() => {
  return sectionData.value.layout.reverseColumns ?
      sectionData.value.layout.leftColumnWidth :
      sectionData.value.layout.rightColumnWidth;
});
</script>

<style scoped>
/****************************************/
.decor1, .decor2 {
  position: absolute;
  z-index: -1;
}

.decor1 img, .decor2 img {
  width: 100%;
  height: 100%;
}

/****************************************/
.section {
  position: relative;
  padding: 20px;
  margin-bottom: 40px;
  overflow: visible;
}

.title-component {
  z-index: 1;
}

/* Viền nửa trên bên phải */
.section1::before {
  content: "";
  position: absolute;
  border-top: v-bind('sectionData ? sectionData.border.width + " " + sectionData.border.style + " " + sectionData.border.color : ""');
  border-right: v-bind('sectionData ? sectionData.border.width + " " + sectionData.border.style + " " + sectionData.border.color : ""');
  z-index: -1;

  /* Dynamic positioning */
  top: v-bind('sectionData ? sectionData.border.position.top : ""');
  right: v-bind('sectionData ? sectionData.border.position.right : ""');
  width: v-bind('sectionData ? sectionData.border.position.width : ""');
  height: v-bind('sectionData ? sectionData.border.position.height : ""');
  margin-right: v-bind('sectionData ? sectionData.border.position.marginRight : ""');
}

.section1 .title-component {
  transform: translateY(-70px);
}

.main-content-wrapper {
  display: flex;
  align-items: center;
}

.left-content-section,
.right-content-section {
  min-width: 0;
  z-index: 2;
}

.right-content-section img {
  width: 100%;
  height: auto;
}

.section1 .text-content {
  border: 2px #0827af solid;
  border-right: 0;
}

.section1 .text-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  color: #333;
  text-align: justify;
  padding-right: 30px;
}

.detail-button {
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  text-decoration: none;
  text-align: center;
}

.detail-button:hover {
  background-color: v-bind('sectionData ? sectionData.button.hoverColor : ""');
}

.st-title {
  width: 40%;
}

/* Responsive */
@media (max-width: 1400px) {
  .st-title {
    width: 100%;
  }
  .section1::before {
    width: 2px;
    height: 115%;
  }
}

@media (max-width: 992px) {
  .main-content-wrapper {
    flex-direction: column !important;
    gap: 20px !important;
  }

  .left-content-section,
  .right-content-section {
    flex: none !important;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
    margin-bottom: 30px;
  }

  .decor2 {
    display: none;
  }
}
</style>