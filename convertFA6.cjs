// convertFA6.cjs
const fs = require("fs");

// ⚙️ Đường dẫn đến icons.json
const json = require("./src/assets/js/icons.json");

const FA6Json = {};

Object.keys(json).forEach(iconName => {
    const icon = json[iconName];
    if (!icon.styles) return; // bỏ qua icon lỗi
    icon.styles.forEach(style => {
        if (!FA6Json[style]) FA6Json[style] = [];
        FA6Json[style].push(`fa-${style} fa-${iconName}`);
    });
});

fs.writeFileSync("./src/assets/js/FA6icons.json", JSON.stringify(FA6Json, null, 2));
console.log("✅ Tạo thành công file: src/assets/js/FA6icons.json");
