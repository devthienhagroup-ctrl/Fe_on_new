<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

interface Customer {
  baseImage: string;
  foregroundImage: string;
  text: string;
  name: string;
}

const customers: Customer[] = [
  {
    baseImage: '/imgs/khach1.png',
    foregroundImage: '/imgs/khach1rb.png',
    text: 'Tôi đã bán nhà của tôi hơn 1 năm không có khách hàng nào quan tâm, nhờ biết đến Thiên Hà Group qua kênh Facebook tôi đã bán nhanh bất động sản chỉ trong 30 ngày.',
    name: 'Anh Lê Văn Thiện (Chủ nhà)'
  },
  {
    baseImage: '/imgs/khach2.png',
    foregroundImage: '/imgs/khach2rb.png',
    text: 'Tôi bán nhà từ năm 2020 giá còn rất cao, nhờ sự tư vấn tận tình của Thiên Hà Group tôi đã nắm được giá trị bất động sản của mình. Nhờ đó tôi đã bán được nhanh hơn chỉ trong 27 ngày.',
    name: 'Chị Nguyễn Thị Lan (Nhà đầu tư)'
  },
  {
    baseImage: '/imgs/khach3.png',
    foregroundImage: '/imgs/khach3rb.png',
    text: 'Trong quá trình bán đất tại Đà Lạt, tôi bị quá nhiều môi giới báo giá ảo nhằm kéo giá tôi xuống, một phần tôi cũng đưa giá quá cao. Sau khi biết đến Thiên Hà Group qua các trang báo chí, tôi đã hợp tác và bán thành công bất động sản của mình.',
    name: 'Anh Trần Quang Huy (Chủ đất)'
  }
];

const currentIndex = ref(0);
const isAnimating = ref(false);

const baseImageRef = ref<HTMLImageElement | null>(null);
const foregroundImageRef = ref<HTMLImageElement | null>(null);
const reviewTextRef = ref<HTMLDivElement | null>(null);
const reviewAuthorRef = ref<HTMLDivElement | null>(null);
const reviewBoxRef = ref<HTMLDivElement | null>(null);

const currentCustomer = ref(customers[0]);

onMounted(() => {
  animateIn();
  animateBorderLight();
});

const animateIn = () => {
  const tl = gsap.timeline();

  tl.fromTo(baseImageRef.value,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
  );

  tl.fromTo(foregroundImageRef.value,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
  );

  tl.to(foregroundImageRef.value,
      { scale: 1.25, duration: 0.5, ease: 'power2.out' },
      '+=0.1'
  );

  tl.fromTo(reviewTextRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.3'
  );

  tl.fromTo(reviewAuthorRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.2'
  );
};

const animateBorderLight = () => {
  if (!reviewBoxRef.value) return;

  const borderLight = document.createElement('div');
  borderLight.className = 'border-light';
  reviewBoxRef.value.appendChild(borderLight);

  gsap.to(borderLight, {
    rotation: 360,
    duration: 3,
    repeat: -1,
    ease: 'linear'
  });
};

const switchCustomer = (direction: 'next' | 'prev') => {
  if (isAnimating.value) return;

  isAnimating.value = true;

  const tl = gsap.timeline({
    onComplete: () => {
      if (direction === 'next') {
        currentIndex.value = (currentIndex.value + 1) % customers.length;
      } else {
        currentIndex.value = (currentIndex.value - 1 + customers.length) % customers.length;
      }
      currentCustomer.value = customers[currentIndex.value];

      gsap.set([baseImageRef.value, foregroundImageRef.value], { y: 100, opacity: 0, scale: 1 });
      gsap.set([reviewTextRef.value, reviewAuthorRef.value], { opacity: 0, y: 20 });

      animateIn();
      isAnimating.value = false;
    }
  });

  tl.to([reviewTextRef.value, reviewAuthorRef.value], {
    opacity: 0,
    y: -20,
    duration: 0.3,
    stagger: 0.1
  });

  tl.to(foregroundImageRef.value, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.in'
  }, '-=0.2');

  tl.to([baseImageRef.value, foregroundImageRef.value], {
    y: -100,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    stagger: 0.1
  }, '-=0.2');
};

const nextCustomer = () => switchCustomer('next');
const prevCustomer = () => switchCustomer('prev');
</script>

<template>
  <div class="customer-reviews">
    <h2 class="title">KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI</h2>
    <div class="content">
      <div class="left-column">
        <div class="image-container">
          <img
              ref="baseImageRef"
              :src="currentCustomer.baseImage"
              :alt="currentCustomer.name"
              class="base-image"
          />
          <img
              ref="foregroundImageRef"
              :src="currentCustomer.foregroundImage"
              :alt="currentCustomer.name"
              class="foreground-image"
          />
        </div>
      </div>

      <div class="right-column">
        <div ref="reviewBoxRef" class="review-box">
          <div class="message-bubble">
            <div class="bubble-tail"></div>
            <div class="review-content">
              <p ref="reviewTextRef" class="review-text">"{{ currentCustomer.text }}"</p>
              <p ref="reviewAuthorRef" class="review-author">{{ currentCustomer.name }}</p>
            </div>
          </div>
          <div class="navigation">
            <button @click="prevCustomer" class="nav-button" :disabled="isAnimating">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button @click="nextCustomer" class="nav-button" :disabled="isAnimating">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-reviews {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
  font-family: 'Ubuntu', sans-serif;
}

.title {
  font-size: 33px;
  font-weight: 600;
  color: #031358;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 50px;
  letter-spacing: 0.5px;
}

.content {
  display: flex;
  gap: 40px;
  align-items: center;
}

.left-column {
  flex: 0 0 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 30%;
}

.image-container {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: visible;
}

.base-image,
.foreground-image {
  position: absolute;
  bottom: 0;
  left: 30%;
  transform: translateX(-50%);
  max-width: 100%;
  height: auto;
}

.base-image {
  max-height: 330px;
  z-index: 1;
}

.foreground-image {
  max-height: 400px;
  z-index: 2;
  transform-origin: bottom center;
}

.right-column {
  width: 70%;
}

.review-box {
  position: relative;
  border-radius: 20px;
  padding: 25px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  box-shadow: 0 10px 30px rgba(3, 19, 88, 0.1);
  overflow: hidden;
}

.message-bubble {
  position: relative;
  background: white;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(3, 19, 88, 0.08);
}

.bubble-tail {
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 15px solid white;
}

.review-content {
  flex: 1;
}

.review-text {
  font-size: 17px;
  line-height: 1.7;
  color: #000;
  margin-bottom: 20px;
  text-align: justify;
}

.review-author {
  font-size: 20px;
  font-weight: 600;
  color: #031358;
  margin-top: 15px;
}

.navigation {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.nav-button {
  background: none;
  border: none;
  color: #031358;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  opacity: 0.7;
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-button svg {
  width: 24px;
  height: 24px;
}

/* Hiệu ứng tia sáng chạy quanh viền */
.border-light {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  background: linear-gradient(90deg,
  transparent,
  rgba(194, 203, 240, 0.8),
  rgba(3, 19, 88, 0.6),
  rgba(194, 203, 240, 0.8),
  transparent);
  z-index: 0;
  pointer-events: none;
  filter: blur(1px);
}

.review-box::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  background: linear-gradient(135deg,
  rgba(3, 19, 88, 0.1) 0%,
  rgba(194, 203, 240, 0.3) 50%,
  rgba(3, 19, 88, 0.1) 100%);
  z-index: -1;
  opacity: 0.7;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .content {
    gap: 30px;
  }

}

@media (max-width: 992px) {
  .content {
    flex-direction: column;
    gap: 30px;
  }

  .left-column,
  .right-column {
    flex: 1 1 100%;
    width: 100%;
  }

  .left-column {
    min-height: 300px;
  }

  .image-container {
    height: 300px;
    align-items: center;
  }

  .base-image,
  .foreground-image {
    left: 40%;
  }

  .base-image {
    max-height: 250px;
  }

  .foreground-image {
    max-height: 300px;
  }

  .bubble-tail {
    left: 50%;
    top: -15px;
    transform: translateX(-50%) rotate(90deg);
  }
}

@media (max-width: 768px) {
  .customer-reviews {
    padding: 40px 15px;
  }

  .title {
    font-size: 26px;
    margin-bottom: 30px;
  }

  .left-column {
    min-height: 250px;
  }

  .image-container {
    height: 250px;
  }

  .base-image {
    max-height: 200px;
  }

  .foreground-image {
    max-height: 250px;
  }

  .review-box {
    padding: 20px;
    min-height: 200px;
  }

  .message-bubble {
    padding: 20px;
  }

  .review-text {
    font-size: 16px;
    line-height: 1.6;
  }

  .review-author {
    font-size: 18px;
  }
}

@media (max-width: 576px) {
  .customer-reviews {
    padding: 30px 10px;
  }

  .title {
    font-size: 22px;
    margin-bottom: 25px;
  }

  .left-column {
    min-height: 200px;
  }

  .image-container {
    height: 200px;
  }

  .base-image {
    max-height: 160px;
  }

  .foreground-image {
    max-height: 200px;
  }

  .review-box {
    padding: 15px;
    min-height: auto;
  }

  .message-bubble {
    padding: 15px;
  }

  .review-text {
    font-size: 15px;
    line-height: 1.5;
    margin-bottom: 15px;
  }

  .review-author {
    font-size: 16px;
    margin-top: 10px;
  }

  .navigation {
    margin-top: 15px;
  }
}

@media (max-width: 400px) {
  .left-column {
    min-height: 180px;
  }

  .image-container {
    height: 180px;
  }

  .base-image {
    max-height: 140px;
  }

  .foreground-image {
    max-height: 180px;
  }
}
</style>