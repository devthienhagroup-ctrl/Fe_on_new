<template>
  <div class="valuation-wrap">
    <h1>📄 BẢNG KẾT QUẢ ĐỊNH GIÁ SƠ BỘ</h1>

    <form class="valuation-form" @submit.prevent="generatePdf">
      <!-- Thông tin khách hàng -->
      <fieldset>
        <legend>THÔNG TIN KHÁCH HÀNG</legend>
        <div class="grid-2">
          <label>Họ tên
            <input v-model="form.customerName" placeholder="Nhập họ tên khách hàng" />
          </label>
          <label>Số điện thoại
            <input v-model="form.phone" placeholder="0909xxxxxx" />
          </label>
          <label>Email
            <input v-model="form.email" type="email" placeholder="abc@gmail.com" />
          </label>
          <label>Địa chỉ
            <input v-model="form.customerAddress" placeholder="Quận, Tỉnh..." />
          </label>
        </div>
      </fieldset>

      <!-- Thông tin tài sản -->
      <fieldset>
        <legend>THÔNG TIN TÀI SẢN</legend>
        <div class="grid-2">
          <label>Địa chỉ tài sản
            <input v-model="form.assetAddress" />
          </label>
          <label>Số tờ
            <input v-model="form.soTo" />
          </label>
          <label>Số thửa
            <input v-model="form.soThua" />
          </label>
          <label>Diện tích tổng (m²)
            <input v-model.number="form.dienTichTong" type="number" />
          </label>
        </div>
      </fieldset>

      <!-- Bảng giá -->
      <fieldset>
        <legend>KẾT QUẢ ĐỊNH GIÁ</legend>
        <table>
          <thead>
          <tr>
            <th>Loại đất</th>
            <th>Diện tích (m²)</th>
            <th>Đơn giá (VNĐ/m²)</th>
            <th>Giá trị (VNĐ)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td>
              <select v-model="row.type">
                <option>Đất ở tại đô thị</option>
                <option>Đất ở tại nông thôn</option>
                <option>Đất trồng cây lâu năm</option>
                <option>Đất trồng cây hàng năm</option>
                <option>Đất trồng lúa nước</option>
              </select>
            </td>
            <td><input v-model.number="row.area" type="number" /></td>
            <td><input v-model.number="row.unitPrice" type="number" /></td>
            <td><input :value="formatNumber(row.area * row.unitPrice)" readonly /></td>
          </tr>
          </tbody>
        </table>

        <div class="summary">
          <div>Tổng giá trị: <strong>{{ formatNumber(totalPrice) }}</strong> VNĐ</div>
          <div>
            Làm tròn cao nhất:
            <input v-model.number="roundHigh" type="number" class="inline" />
          </div>
          <div>
            Làm tròn thấp nhất:
            <input v-model.number="roundLow" type="number" class="inline" />
          </div>
          <div>
            Bằng chữ:
            <input v-model="inWords" class="inline" />
          </div>
        </div>
      </fieldset>

      <div class="actions">
        <button type="button" @click="autoFillExample">Điền mẫu thử</button>
        <button type="submit" class="primary">Xuất PDF</button>
      </div>
    </form>

    <p class="msg" v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { PDFDocument, rgb } from "pdf-lib";
import logoImg from "../../imgs/logo.png";

// Font Times New Roman (Unicode)
import fontRegular from "/font-times-new-roman/SVN-Times New Roman.ttf";
import fontBold from "/assets/font-times-new-roman/SVN-Times New Roman Bold.ttf";
import fontItalic from "/assets/font-times-new-roman/SVN-Times New Roman Italic.ttf";

// Form dữ liệu
const form = reactive({
  customerName: "",
  phone: "",
  email: "",
  customerAddress: "",
  assetAddress: "",
  soTo: "",
  soThua: "",
  dienTichTong: "",
});

const rows = reactive([
  { type: "Đất ở tại đô thị", area: 0, unitPrice: 0 },
  { type: "Đất ở tại nông thôn", area: 0, unitPrice: 0 },
  { type: "Đất trồng cây lâu năm", area: 0, unitPrice: 0 },
]);

const roundHigh = ref(0);
const roundLow = ref(0);
const inWords = ref("");
const message = ref("");

const totalPrice = computed(() =>
    Math.round(rows.reduce((s, r) => s + (r.area * r.unitPrice || 0), 0))
);

function formatNumber(n) {
  if (!n && n !== 0) return "";
  return n.toLocaleString("vi-VN");
}

function autoFillExample() {
  form.customerName = "Nguyễn Văn A";
  form.phone = "0909123456";
  form.email = "a@gmail.com";
  form.customerAddress = "Quận 1, TP. HCM";
  form.assetAddress = "Phường Bình Thạnh, TP. HCM";
  form.soTo = "12";
  form.soThua = "34";
  form.dienTichTong = 1212.1;
  rows[0] = { type: "Đất ở tại đô thị", area: 162.1, unitPrice: 2350000 };
  rows[1] = { type: "Đất ở tại nông thôn", area: 1050, unitPrice: 1645000 };
  rows[2] = { type: "Đất trồng cây lâu năm", area: 0, unitPrice: 0 };
  roundHigh.value = 2100000000;
  roundLow.value = 1800000000;
  inWords.value = "Hai tỷ một trăm triệu đồng chẵn";
}

async function generatePdf() {
  message.value = "Đang tạo PDF...";
  try {
    const pdfDoc = await PDFDocument.create();

    // ✅ Import động fontkit (cách duy nhất chạy trên Vite)
    const fontkitModule = await import("fontkit");
    const fontkit = fontkitModule.default || fontkitModule;
    pdfDoc.registerFontkit(fontkit);

    // ✅ Nhúng font
    const fRegular = await pdfDoc.embedFont(await fetch(fontRegular).then(r => r.arrayBuffer()));
    const fBold = await pdfDoc.embedFont(await fetch(fontBold).then(r => r.arrayBuffer()));
    const fItalic = await pdfDoc.embedFont(await fetch(fontItalic).then(r => r.arrayBuffer()));

    // ✅ Nhúng logo
    const pngBytes = await fetch(logoImg).then(r => r.arrayBuffer());
    const logo = await pdfDoc.embedPng(pngBytes);

    const page = pdfDoc.addPage([595, 842]); // A4
    const { height } = page.getSize();
    const y = (top) => height - top;

    // --- Logo & tiêu đề ---
    page.drawImage(logo, { x: 40, y: height - 120, width: 90, height: 90 });
    page.drawText("CÔNG TY CỔ PHẦN ĐẦU TƯ BĐS THIÊN HÀ GROUP", { x: 150, y: y(65), font: fBold, size: 12 });
    page.drawText("Địa chỉ: 14 đường 15, KDC Vạn Phúc, P. Hiệp Bình Phước, TP. Thủ Đức, TP. HCM", { x: 150, y: y(80), font: fRegular, size: 10 });
    page.drawText("Chi nhánh: 01 Hoa Lài, P.7, Q.Phú Nhuận, TP. Hồ Chí Minh", { x: 150, y: y(95), font: fRegular, size: 10 });

    page.drawText("BẢNG BÁO CÁO KẾT QUẢ ĐỊNH GIÁ SƠ BỘ", { x: 160, y: y(140), font: fBold, size: 16, color: rgb(0, 0, 0) });

    // --- Thông tin khách hàng ---
    page.drawText("THÔNG TIN KHÁCH HÀNG", { x: 50, y: y(180), font: fBold, size: 12 });
    page.drawText(`Tên khách hàng: ${form.customerName}`, { x: 70, y: y(200), font: fRegular, size: 12 });
    page.drawText(`Số điện thoại: ${form.phone}`, { x: 70, y: y(220), font: fRegular, size: 12 });
    page.drawText(`Địa chỉ: ${form.customerAddress}`, { x: 70, y: y(240), font: fRegular, size: 12 });
    page.drawText(`Email: ${form.email}`, { x: 70, y: y(260), font: fRegular, size: 12 });

    // --- Thông tin tài sản ---
    page.drawText("THÔNG TIN TÀI SẢN", { x: 50, y: y(290), font: fBold, size: 12 });
    page.drawText(`Địa chỉ tài sản: ${form.assetAddress}`, { x: 70, y: y(310), font: fRegular, size: 12 });
    page.drawText(`Số tờ: ${form.soTo}`, { x: 70, y: y(330), font: fRegular, size: 12 });
    page.drawText(`Số thửa: ${form.soThua}`, { x: 200, y: y(330), font: fRegular, size: 12 });
    page.drawText(`Diện tích tổng: ${form.dienTichTong} m²`, { x: 70, y: y(350), font: fRegular, size: 12 });

    // --- Kết quả định giá ---
    page.drawText("KẾT QUẢ ĐỊNH GIÁ", { x: 50, y: y(380), font: fBold, size: 12 });

    let startY = y(400);
    rows.forEach((r, i) => {
      const offset = i * 20;
      page.drawText(r.type, { x: 70, y: startY - offset, font: fRegular, size: 12 });
      page.drawText(r.area.toString(), { x: 280, y: startY - offset, font: fRegular, size: 12 });
      page.drawText(formatNumber(r.unitPrice), { x: 380, y: startY - offset, font: fRegular, size: 12 });
      page.drawText(formatNumber(r.area * r.unitPrice), { x: 480, y: startY - offset, font: fRegular, size: 12 });
    });

    // Tổng kết
    page.drawText(`TỔNG GIÁ (VNĐ): ${formatNumber(totalPrice.value)}`, { x: 70, y: y(500), font: fBold, size: 12 });
    page.drawText(`Tổng giá trị cao nhất (Làm tròn): ${formatNumber(roundHigh.value)}`, { x: 70, y: y(520), font: fRegular, size: 12 });
    page.drawText(`Bằng chữ: ${inWords.value}`, { x: 70, y: y(540), font: fItalic, size: 12 });
    page.drawText(`Tổng giá trị thấp nhất (Làm tròn): ${formatNumber(roundLow.value)}`, { x: 70, y: y(560), font: fRegular, size: 12 });

    // --- Xuất PDF ---
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "thg_dinh_gia_so_bo.pdf";
    a.click();
    URL.revokeObjectURL(url);

    message.value = "✅ File PDF đã tạo thành công!";
  } catch (e) {
    console.error(e);
    message.value = "❌ Lỗi khi tạo PDF: " + e.message;
  }
}
</script>

<style scoped>
.valuation-wrap {
  max-width: 900px;
  margin: 30px auto;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  font-family: 'Inter', sans-serif;
}
h1 {
  font-size: 22px;
  margin-bottom: 16px;
  text-align: center;
  color: #1a237e;
}
fieldset {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #fafafa;
}
legend {
  font-weight: 600;
  color: #0b74ff;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}
label {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #333;
}
input, select {
  margin-top: 4px;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
}
button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}
button.primary {
  background: #0b74ff;
  color: white;
}
button:hover {
  opacity: 0.9;
}
.msg {
  text-align: center;
  margin-top: 16px;
  font-weight: 500;
  color: #0a5;
}
</style>
