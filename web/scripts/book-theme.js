// Chế độ sáng/tối cho trang đọc sách (web/styles/book-reader.css).
// Lớp "light" trên <html> = sáng; không có = tối. Theo lựa chọn đã lưu của cổng web
// (localStorage "ide-theme"), nếu chưa có thì theo hệ điều hành; cổng web gửi
// SET_THEME khi người dùng đổi chế độ lúc trang đang mở trong khung xem.
(function () {
  try {
    const saved = localStorage.getItem('ide-theme');
    const isLight = saved === 'light' || (!saved && window.matchMedia('(prefers-color-scheme: light)').matches);
    document.documentElement.classList.toggle('light', isLight);
  } catch (e) {
    document.documentElement.classList.add('light');
  }

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'SET_THEME' && typeof e.data.isLight !== 'undefined') {
      document.documentElement.classList.toggle('light', e.data.isLight);
    }
  });
})();
