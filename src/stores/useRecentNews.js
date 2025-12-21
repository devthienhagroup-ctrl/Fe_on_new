// utils/useRecentNews.js
export function useRecentNews() {
    const MAX_RECENT = 6;
    const STORAGE_KEY = 'recentlyViewedNews';

    // Lấy danh sách tin đã xem
    const getRecentNews = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    };

    // Thêm tin mới vào danh sách
    const addRecentNews = (newsItem) => {
        console.log("CHuẩn bị lưu:", newsItem)
        if (!newsItem || !newsItem.id) return;

        const recentNews = getRecentNews();

        // Loại bỏ nếu đã tồn tại (tránh trùng lặp)
        const filteredNews = recentNews.filter(item => item.id !== newsItem.id);

        // Chuẩn bị dữ liệu thu gọn
        const simplifiedItem = {
            id: newsItem.id,
            slug: newsItem.slug,
            title: newsItem.title || '',
            thumbnail: newsItem.thumbnail || newsItem.image || '',
            viewedAt: new Date().toISOString() // Thêm thời gian xem
        };

        console.log("Đã lưu", simplifiedItem)

        // Thêm vào đầu mảng
        filteredNews.unshift(simplifiedItem);

        // Giới hạn tối đa 6 tin
        if (filteredNews.length > MAX_RECENT) {
            filteredNews.length = MAX_RECENT;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNews));
        return filteredNews;
    };

    // Xóa tin đã xem (tùy chọn)
    const clearRecentNews = () => {
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        getRecentNews,
        addRecentNews,
        clearRecentNews
    };
}