<template>
  <div class="page-404">
    <div class="container">
      <img class="logo" src="/imgs/logoTHG.png" alt="logo-THG">

      <!-- Hiển thị ảnh SVG từ đường dẫn -->
      <div class="image-container">
        <img
            src="/imgs/oops-404.svg"
            alt="404 - Không tìm thấy trang"
            class="oops-image"
            @error="handleImageError"
        />
      </div>

      <div class="content">
        <h1 class="title">Oops! Trang không tìm thấy</h1>
        <p class="subtitle">Có vẻ như trang bạn đang tìm kiếm đã bị xóa, đổi tên hoặc tạm thời không có sẵn.</p>

        <div class="actions">
          <button @click="goBack" class="back-button">
            <i class="fas fa-arrow-left"></i>
            Quay lại trang trước
          </button>
          <button @click="goHome" class="home-button">
            <i class="fas fa-home"></i>
            Về trang chủ
          </button>
        </div>

<!--        <div class="search-container" v-if="showSearch">-->
<!--          <p class="search-title">Hoặc tìm kiếm nội dung:</p>-->
<!--          <div class="search-box">-->
<!--            <input-->
<!--                type="text"-->
<!--                v-model="searchQuery"-->
<!--                placeholder="Nhập từ khóa tìm kiếm..."-->
<!--                @keyup.enter="performSearch"-->
<!--                class="search-input"-->
<!--            />-->
<!--            <button @click="performSearch" class="search-button">-->
<!--              <i class="fas fa-search"></i>-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound404',
  data() {
    return {
      searchQuery: '',
      showSearch: true,
      // Fallback image nếu ảnh SVG gốc không tải được
      fallbackImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjBGNUZBIi8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjMwMCIgcj0iMjUwIiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNFOUVDQUYiIHN0cm9rZS13aWR0aD0iMyIvPgo8Y2lyY2xlIGN4PSIzNTAiIGN5PSIyNTAiIHI9IjMwIiBmaWxsPSIjMzQzQTQwIi8+CjxjaXJjbGUgY3g9IjQ1MCIgY3k9IjI1MCIgcj0iMzAiIGZpbGw9IiMzNDNBNDAiLz4KPHBhdGggZD0iTTM1MCwzNTAgUTQwMCw0MDAgNDUwLDM1MCIgc3Ryb2tlPSIjMzQzQTQwIiBzdHJva2Utd2lkdGg9IjEwIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTMwMCwxODAgTDI4MCwxNTAiIHN0cm9rZT0iIzM0M0E0MCIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTUwMCwxODAgTDUyMCwxNTAiIHN0cm9rZT0iIzM0M0E0MCIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHRleHQgeD0iNDAwIiB5PSI0ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgaGVhdml5PSJ0cnVlIiBmaWxsPSIjMzQzQTQwIj40MDQ8L3RleHQ+Cjwvc3ZnPg=='
    }
  },
  methods: {
    // Quay lại trang trước
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push('/');
      }
    },

    // Về trang chủ
    goHome() {
      this.$router.push('/');
    },

    // Xử lý khi ảnh không tải được
    handleImageError(event) {
      console.log('Không thể tải ảnh SVG, sử dụng ảnh fallback');
      event.target.src = this.fallbackImage;
    },

    // Thực hiện tìm kiếm
    performSearch() {
      if (this.searchQuery.trim()) {
        // Ở đây bạn có thể tích hợp với chức năng tìm kiếm của ứng dụng
        console.log('Tìm kiếm:', this.searchQuery);
        alert(`Đang tìm kiếm: ${this.searchQuery}`);
        // Ví dụ: this.$router.push(`/search?q=${encodeURIComponent(this.searchQuery)}`);
      }
    }
  },
  mounted() {
    // Thêm class cho body để dễ style
    document.body.classList.add('page-not-found');
  },
  beforeUnmount() {
    // Xóa class khi component bị hủy
    document.body.classList.remove('page-not-found');
  }
}
</script>

<style scoped>
.page-404 .logo {
  width: 100px;
  height: auto;
  position: absolute;
  top: 10px;
  left: 10px;
}


.page-404 {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

}

.container {
  max-width: 1000px;
  width: 100%;
  text-align: center;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.image-container {
  margin-bottom: 30px;
  max-width: 600px;
  width: 100%;
}

.oops-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
}

.content {
  max-width: 700px;
  width: 100%;
}

.title {
  font-size: 2.5rem;
  color: #2d3436;
  margin-bottom: 15px;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  color: #636e72;
  line-height: 1.6;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.back-button, .home-button {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.back-button {
  background-color: #0984e3;
  color: white;
}

.back-button:hover {
  background-color: #0770c4;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(9, 132, 227, 0.3);
}

.home-button {
  background-color: #00b894;
  color: white;
}

.home-button:hover {
  background-color: #00a085;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 184, 148, 0.3);
}

.search-container {
  margin-top: 20px;
  padding-top: 30px;
  border-top: 1px solid #dfe6e9;
}

.search-title {
  font-size: 1.1rem;
  color: #636e72;
  margin-bottom: 15px;
}

.search-box {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 15px 25px;
  border: none;
  font-size: 1rem;
  background-color: #f8f9fa;
}

.search-input:focus {
  outline: none;
  background-color: white;
}

.search-button {
  background-color: #6c5ce7;
  color: white;
  border: none;
  padding: 0 25px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #5b4fcf;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 30px 20px;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .actions {
    flex-direction: column;
    align-items: center;
  }

  .back-button, .home-button {
    width: 100%;
    max-width: 300px;
  }

  .search-box {
    flex-direction: column;
    border-radius: 15px;
  }

  .search-input {
    border-radius: 15px 15px 0 0;
  }

  .search-button {
    border-radius: 0 0 15px 15px;
    padding: 15px;
  }
}
</style>

<style>
/* Style toàn cục cho trang 404 */
.page-not-found {
  margin: 0;
  overflow-x: hidden;
}
</style>