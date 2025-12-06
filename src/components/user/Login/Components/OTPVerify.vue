<template>
  <div class="otp-form">
    <!-- Dòng text mới -->
    <p class="otp-title">
      Mã OTP đã được gửi đến mail của bạn:
      <span class="otp-email">{{ email }}</span>
    </p>

    <!-- Thông báo thời gian OTP -->
    <p class="otp-timer">
      Mã OTP có thời hạn trong 5 phút.
      <span class="timer-countdown">{{ formattedTime }}</span>
    </p>

    <!-- 6 ô OTP -->
    <div class="otp-container">
      <input
          v-for="(box, index) in otpBoxes"
          :key="index"
          maxlength="1"
          class="otp-box"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          @input="handleOtpInput($event, index)"
          @paste="handleOtpPaste($event)"
          @keydown="handleOtpKeydown($event, index)"
          ref="otpRefs"
      />
    </div>

    <p class="error" v-if="error">{{ error }}</p>

    <!-- Nút xác minh -->
    <div class="otp-actions">
      <button class="switch-btn verify-btn" type="submit" @click="handleVerify">Xác minh OTP</button>
    </div>

    <!-- Link gửi lại OTP -->
    <div class="resend-section">
      <p>Quý khách chưa nhận được OTP?
        <span
            class="resend-link"
            :class="{ 'resend-disabled': timeLeft > 0 }"
            @click="handleResendOtp"
        >
          Gửi lại {{ timeLeft > 0 ? `(${formattedTime})` : '' }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, watch, defineProps, defineEmits, onMounted, onUnmounted, computed } from "vue";

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(['verify-otp', 'resend-otp', 'update:otp']);

const otpBoxes = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);
const timeLeft = ref(300); // 5 phút = 300 giây
let timerInterval = null;

// Định dạng thời gian đếm ngược
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Bắt đầu đếm ngược
const startTimer = () => {
  timeLeft.value = 300; // Reset về 5 phút
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const handleOtpInput = (e, index) => {
  let value = e.target.value.replace(/\D/g, ""); // chỉ cho số

  // Nếu người dùng dán nhiều số, chỉ lấy số đầu tiên
  if (value.length > 1) {
    value = value.charAt(0);
    e.target.value = value;
  }

  otpBoxes.value[index] = value;

  // Auto move to next
  if (value && index < 5) {
    nextTick(() => {
      otpRefs.value[index + 1].focus();
    });
  }

  // Ghép OTP 6 số thành một string
  const otpValue = otpBoxes.value.join("");
  emit('update:otp', otpValue);

  // Tự động gửi xác minh khi đủ 6 số
  if (otpValue.length === 6) {
    nextTick(() => {
      emit('verify-otp', otpValue);
    });
  }
};

const handleOtpKeydown = (e, index) => {
  // Xử lý phím Backspace
  if (e.key === 'Backspace') {
    if (!otpBoxes.value[index] && index > 0) {
      // Di chuyển về ô trước đó nếu ô hiện tại trống
      nextTick(() => {
        otpRefs.value[index - 1].focus();
        otpRefs.value[index - 1].select();
      });
    } else if (otpBoxes.value[index]) {
      // Xóa nội dung ô hiện tại nhưng giữ focus
      otpBoxes.value[index] = "";
      e.target.value = "";
      emit('update:otp', otpBoxes.value.join(""));
    }
  }

  // Xử lý phím mũi tên
  if (e.key === 'ArrowLeft' && index > 0) {
    nextTick(() => {
      otpRefs.value[index - 1].focus();
    });
    e.preventDefault();
  }

  if (e.key === 'ArrowRight' && index < 5) {
    nextTick(() => {
      otpRefs.value[index + 1].focus();
    });
    e.preventDefault();
  }

  // Cho phép các phím điều hướng và số
  if (!/^(Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Enter|Home|End)$/.test(e.key) &&
      !/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

const handleOtpPaste = (e) => {
  const paste = e.clipboardData.getData("text").trim();
  const numbersOnly = paste.replace(/\D/g, "");

  if (numbersOnly.length >= 6) {
    const digits = numbersOnly.substring(0, 6).split("");

    // Cập nhật giá trị cho từng ô
    digits.forEach((digit, i) => {
      otpBoxes.value[i] = digit;
    });

    // Fill UI
    nextTick(() => {
      otpBoxes.value.forEach((digit, i) => {
        if (otpRefs.value[i]) {
          otpRefs.value[i].value = digit;
        }
      });

      const otpValue = digits.join("");
      emit('update:otp', otpValue);

      // Tự động gửi xác minh
      emit('verify-otp', otpValue);

      // Focus vào ô cuối cùng
      if (otpRefs.value[5]) {
        otpRefs.value[5].focus();
      }
    });
  } else {
    // Nếu paste ít hơn 6 số, điền vào các ô từ vị trí hiện tại
    const startIndex = Array.from(otpRefs.value).findIndex(ref => ref === document.activeElement);
    if (startIndex !== -1) {
      const digits = numbersOnly.split("");
      digits.forEach((digit, i) => {
        const targetIndex = startIndex + i;
        if (targetIndex < 6) {
          otpBoxes.value[targetIndex] = digit;
          if (otpRefs.value[targetIndex]) {
            otpRefs.value[targetIndex].value = digit;
          }
        }
      });

      const otpValue = otpBoxes.value.join("");
      emit('update:otp', otpValue);

      // Focus vào ô tiếp theo sau khi paste
      const nextIndex = Math.min(startIndex + digits.length, 5);
      nextTick(() => {
        if (otpRefs.value[nextIndex]) {
          otpRefs.value[nextIndex].focus();
        }
      });
    }
  }

  e.preventDefault();
};

const handleVerify = () => {
  const otpValue = otpBoxes.value.join("");
  emit('verify-otp', otpValue);
};

const handleResendOtp = () => {
  if (timeLeft.value <= 0) {
    emit('resend-otp');
    startTimer(); // Bắt đầu lại đếm ngược
    resetOtp(); // Reset các ô OTP
  }
};

const resetOtp = () => {
  otpBoxes.value = ["", "", "", "", "", ""];
  nextTick(() => {
    if (otpRefs.value.length > 0) {
      otpRefs.value.forEach(ref => {
        if (ref) ref.value = "";
      });
      otpRefs.value[0].focus();
    }
  });
};

// Bắt đầu đếm ngược khi component được mount
onMounted(() => {
  startTimer();
  nextTick(() => {
    if (otpRefs.value.length > 0) {
      otpRefs.value[0].focus();
    }
  });
});

// Dọn dẹp timer khi component unmount
onUnmounted(() => {
  clearInterval(timerInterval);
});

// Expose reset method
defineExpose({
  resetOtp
});
</script>

<style scoped>
.otp-title {
  font-size: 16px;
  text-align: center;
  margin-top: 5px;
  color: #333;
}

.otp-email {
  font-weight: 700;
  color: #031358;
}

.otp-timer {
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  color: #666;
}

.timer-countdown {
  font-weight: bold;
  color: #e74c3c;
}

/* Vùng chứa OTP */
.otp-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin: 25px 0;
}

/* Ô OTP vuông tuyệt đối */
.otp-box {
  width: 60px;
  height: 60px;
  aspect-ratio: 1 / 1;     /* đảm bảo vuông trên mọi máy */
  border: none;
  border-radius: 12px;
  background: #EEF1FF;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1),
  inset -2px -2px 5px rgba(255, 255, 255, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 28px;
  font-weight: bold;
  text-align: center;

  padding: 0;
  outline: none;
  box-sizing: border-box;
  transition: 0.2s ease;
}

.otp-box:focus {
  background: #e4e7ff;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.15),
  inset -2px -2px 5px rgba(255, 255, 255, 0.7),
  0 0 6px rgba(3, 19, 88, 0.35);
}

/* Error message */
.error {
  color: #FF9AA2;
  font-size: 14px;
  margin-top: 5px;
  text-align: left;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Nút OTP */
.otp-actions {
  margin-top: 10px;
}

.switch-btn {
  width: 100%;
  padding: 15px;
  background-color: #031358;
  color: white;
  border: none;
  border-radius: 13px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s ease;
  max-width: 430px; /* 60*60 + 14*5 */
  display: block;
  margin: 0 auto;
}

.switch-btn:hover {
  background-color: #020c3a;
}

/* Section gửi lại OTP */
.resend-section {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.resend-link {
  color: #4a68ff;
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.resend-link:hover {
  color: #334bdb;
}

.resend-disabled {
  color: #999;
  cursor: not-allowed;
  text-decoration: none;
}

.resend-disabled:hover {
  color: #999;
}

/* 📱 Responsive */
@media (max-width: 768px) {
  .otp-box {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .otp-box {
    width: 42px;
    height: 42px;
    font-size: 20px;
  }
}

@media (max-width: 360px) {
  .otp-box {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
}
</style>