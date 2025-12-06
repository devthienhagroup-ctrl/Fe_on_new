import Swal from "sweetalert2";

/**
 * ✅ Thông báo thành công
 * @param {string} title - Tiêu đề
 * @param {string} text - Nội dung chi tiết
 */
export function showSuccess(title, text = "") {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 2000,
    });
}

/**
 * ❌ Thông báo lỗi
 * @param {string} title - Tiêu đề
 * @param {string} text - Nội dung chi tiết
 */
export function showError(title, text = "") {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 2500,
    });
}

/**
 * ⚠️ Thông báo cảnh báo
 * @param {string} title - Tiêu đề
 * @param {string} text - Nội dung chi tiết
 */
export function showWarning(title, text = "") {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 2500,
    });
}

// 🌀 Hiển thị alert xoay xoay (khi đang chờ BE)
// ✅ Giữ loading ít nhất 2s và đợi API hoàn tất
export async function showLoading(promise) {
    Swal.fire({
        title: "Đang xử lý...",
        text: "Vui lòng chờ trong giây lát...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
    });

    const start = Date.now();

    const result = await promise; // 🔥 Đợi API thực sự hoàn tất

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, 500 - elapsed);
    await new Promise(resolve => setTimeout(resolve, remaining));

    return result;

}


// ✅ Khi thành công → cho phép click ra ngoài + tự tắt sau 2s
export function updateAlertSuccess(title, text = "") {
    Swal.update({
        icon: "success",
        title,
        text,
        allowOutsideClick: true,   // ✅ Cho phép tắt khi click ra ngoài
        allowEscapeKey: true,
        showConfirmButton: false,
    });

    setTimeout(() => {
        Swal.close(); // Tự tắt sau 2 giây
    }, 1200);
}

// ❌ Khi lỗi → cho phép click ra ngoài hoặc bấm ESC để đóng
export function updateAlertError(title, text = "") {

    Swal.update({
        icon: "error",
        title,
        text,
        allowOutsideClick: true,   // ✅ Cho phép click ra ngoài
        allowEscapeKey: true,
        showConfirmButton: false,   // Có nút OK
    });

    setTimeout(() => {
        Swal.close(); // Tự tắt sau 2 giây
    }, 1200);
}

/**
 * Hiển thị popup yêu cầu người dùng nhập dữ liệu để xác nhận hành động
 *
 * @param {string} title - Tiêu đề hiển thị ở popup (VD: "Xác nhận xóa nhóm")
 * @param {string} text - Nội dung hướng dẫn (VD: 'Nhập "LALALA team" để xác nhận')
 * @param {string} expectedText - Chuỗi mà người dùng phải nhập chính xác
 * @param {function} onConfirm - Hàm thực thi khi nhập đúng
 */
export async function confirmWithInput(title, text, expectedText, onConfirm) {
    const { value: userInput } = await Swal.fire({
        title: title,
        text: text,
        input: "text",
        inputPlaceholder: expectedText,
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        inputValidator: (value) => {
            if (!value) return "⚠️ Bạn chưa nhập gì!";
            if (value.trim() !== expectedText)
                return "❌ Nội dung không khớp, vui lòng nhập lại!";
        },
    });

    if (userInput && userInput.trim() === expectedText) {
        // ✅ Thành công
        await Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Xác nhận đúng, đang thực hiện hành động...",
            showConfirmButton: false,
            timer: 1200,
        });

        // Gọi callback nếu có
        if (typeof onConfirm === "function") onConfirm();
    }
}


export async function confirmDeleteMember(memberName, onConfirm) {
    const { isConfirmed } = await Swal.fire({
        title: "Xóa thành viên?",
        html: `
            Bạn có chắc muốn <b>xóa ${memberName}</b> khỏi nhóm không?<br>
            <span class="text-danger">Hành động này không thể hoàn tác!</span>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#d33",
    });

    if (isConfirmed) {
        // Thông báo thành công
        Swal.fire({
            icon: "success",
            title: "Đã xóa thành viên!",
            timer: 1000,
            showConfirmButton: false,
        });

        if (typeof onConfirm === "function") onConfirm();
    }
}


export function showAlert(title, text = "") {
    Swal.fire({
        icon: "warning",
        title: title,
        text: text,
        confirmButtonText: "Tôi hiểu rồi",
        confirmButtonColor: "#e53935", // đỏ nhẹ, nghiêm túc
        background: "rgba(25, 25, 25, 0.95)", // nền tối
        color: "#fff",
        backdrop: "rgba(0, 0, 0, 0.6)", // nền mờ toàn màn
        customClass: {
            popup: "rounded-4 shadow-lg border border-danger-subtle",
            title: "fw-bold text-warning fs-5",
            confirmButton: "px-4 py-2 fw-semibold",
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showClass: {
            popup: "animate__animated animate__zoomIn animate__faster",
        },
        hideClass: {
            popup: "animate__animated animate__fadeOut animate__faster",
        },
    });
}

export async function confirmYesNo(title, message, onConfirm) {
    const { isConfirmed } = await Swal.fire({
        title: title,
        html: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
    });

    if (isConfirmed && typeof onConfirm === "function") {
        onConfirm();
    }
}
