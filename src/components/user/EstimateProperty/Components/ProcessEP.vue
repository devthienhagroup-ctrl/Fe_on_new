<template>
  <div class="quy-trinh-container">
    <!-- Tiêu đề -->
    <div class="header-section fade-up">
      <h1 class="main-title">Quy trình</h1> <br>
      <div class="subtitle-section">
        <h2 class="subtitle">7 BƯỚC ĐỊNH GIÁ SƠ BỘ BẤT ĐỘNG SẢN</h2>
        <div class="underline"></div>
      </div>
    </div>

    <!-- Nội dung chính - 2 cột -->
    <div class="content-wrapper">
      <!-- Cột trái - Danh sách quy trình -->
      <div class="left-column">
        <ProcessStep
            v-for="step in quyTrinhDinhGia"
            :key="step.sothutu"
            :number="step.sothutu"
            :title="step.tieude"
            :content="step.noidung"
            :icon="step.icon"
        />
      </div>

      <!-- Cột phải - Ảnh -->
      <div class="right-column">
        <img
            src="/imgs/bg-quy-trinh-7.png"
            alt="Quy trình định giá bất động sản"
            class="process-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProcessStep from './ProcessStep.vue'

const quyTrinhDinhGia = ref([
  {
    sothutu: 1,
    icon: "fas fa-user-plus",
    tieude: "Khách hàng đăng ký tài khoản",
    noidung: "Khách hàng bắt đầu bằng việc tạo tài khoản trên hệ thống. Việc này giúp quản lý thông tin, lịch sử định giá và hỗ trợ quá trình thanh toán nhanh và tiện lợi. Đây là bước đầu tiên để đảm bảo mọi giao dịch đều minh bạch, chuyên nghiệp."
  },
  {
    sothutu: 2,
    icon: "fas fa-building",
    tieude: "Nhập thông tin bất động sản",
    noidung: "Khách hàng cung cấp các thông tin cơ bản về bất động sản như địa chỉ, diện tích, loại hình (đất nền, căn hộ, nhà phố, biệt thự...), hình trong thực tế và hiện trạng. Các dữ liệu này giúp đội ngũ định giá có cơ sở để tiến hành phân tích và đánh giá chính xác."
  },
  {
    sothutu: 3,
    icon: "fas fa-scale-balanced",
    tieude: "Định giá sơ bộ",
    noidung: "Sau khi nhận được kết quả định giá, khách hàng và chuyên viên thống nhất mức giá đề xuất. Việc đồng thuận này giúp toàn bộ kế hoạch triển khai bán hàng sau đó được xây dựng trên cơ sở chính xác, phù hợp với thị trường."
  },
  {
    sothutu: 4,
    icon: "fas fa-credit-card",
    tieude: "Thanh toán phí",
    noidung: "Khách hàng tiến hành thanh toán chi phí định giá theo quy định. Quy trình thanh toán được bảo mật tuyệt đối và hỗ trợ nhiều hình thức khác nhau, đảm bảo thuận tiện – nhanh chóng – an toàn."
  },
  {
    sothutu: 5,
    icon: "fas fa-file-download",
    tieude: "Nhận file trên tài khoản",
    noidung: "Khách hàng tiến hành thanh toán chi phí định giá theo quy định. Quy trình thanh toán được bảo mật tuyệt đối và hỗ trợ nhiều hình thức khác nhau, đảm bảo thuận tiện – nhanh chóng – an toàn."
  },
  {
    sothutu: 6,
    icon: "fas fa-comment-dots",
    tieude: "Nhận file qua Zalo",
    noidung: "Để thuận tiện hơn, khách hàng sẽ được gửi thêm bản báo cáo định giá qua Zalo. Hình thức này giúp người dùng dễ dàng lưu trữ, tra cứu và theo dõi thông tin chuyển đến ở bất cứ đâu."
  },
  {
    sothutu: 7,
    icon: "fas fa-bolt",
    tieude: "Đăng ký bán nhanh 30 ngày",
    noidung: "Khi đã có giá trị định hướng rõ ràng, khách hàng có thể chọn gói dịch vụ \"Đăng ký gói Định giá và Bán Nhanh Bất Động Sản Trong 30 Ngày\". Đây là chương trình hỗ trợ toàn diện giúp khách hàng tiếp cận đúng đối tượng và chốt giao dịch nhanh chóng."
  }
])
</script>

<style scoped>
.quy-trinh-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header Section */
.header-section {
  text-align: center;
  font-family: "Ubuntu", sans-serif;
  margin-bottom: 30px;
}

.main-title {
  display: inline-block;
  font-size: 13px;
  color: #fff;
  background: linear-gradient(90deg, #031358, #000a85);
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle-section {
  display: inline-block;
  text-align: center;
}

.subtitle {
  font-size: 40px;
  color: #031358;
  font-weight: 700;
  margin: 0;
}

.underline {
  width: 60px;
  height: 3px;
  margin: 6px auto 0;
  border-radius: 5px;
  background: linear-gradient(90deg, #031358, #000a85);
}

/* Content Layout */
.content-wrapper {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

/* Left Column - Process Steps */
.left-column {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.left-column::before {
  content: "";
  width: 2px;
  height: 87%;
  border-left: 2px dashed #002FFF;
  position: absolute;
  left: 30px;
  top: 40px;
  z-index: -1;
}

/* Right Column - Image */
.right-column {
  flex: 1;
  position: sticky;
  top: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.process-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Responsive Design - Tablet */
@media (max-width: 1024px) {
  .content-wrapper {
    gap: 40px;
  }

  .process-image {
    max-width: 400px;
  }
}

@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column-reverse;
    gap: 40px;
  }

  .right-column {
    position: relative;
    top: 0;
  }

  .process-image {
    max-width: 450px;
  }

  .left-column::before {
    left: 25px;
  }
}

/* Responsive Design - Mobile */
@media (max-width: 768px) {
  .quy-trinh-container {
    padding: 30px 15px;
  }

  .subtitle {
    font-size: 32px;
  }

  .header-section {
    margin-bottom: 40px;
  }

  .content-wrapper {
    gap: 30px;
  }

  .process-image {
    max-width: 100%;
  }

  .left-column::before {
    left: 20px;
  }
}

@media (max-width: 480px) {
  .quy-trinh-container {
    padding: 20px 12px;
  }

  .main-title {
    font-size: 12px;
    padding: 3px 8px;
  }

  .subtitle {
    font-size: 24px;
  }

  .underline {
    width: 50px;
  }

  .content-wrapper {
    gap: 25px;
  }


  .left-column {
    gap: 15px;
  }

  .left-column::before {
    left: 18px;
    top: 30px;
  }
}

@media (max-width: 478px) {
  .subtitle {
    font-size: 22px;
  }


  .left-column::before {
    height: 86%;
  }



}
</style>