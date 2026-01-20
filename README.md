# Auto Click Card & Checkbox Extension

Extension Chrome tự động bấm mở card form và check checkbox "Terms of Service" trên trang thanh toán OpenAI ChatGPT.

## Tính năng

- 🚀 **Tự động bấm mở Card Form**: Tự động click vào nút mở form thẻ thanh toán
- ✅ **Tự động check Checkbox**: Tự động check "Terms of Service" checkbox
- ⚙️ **Settings Tab**: Giao diện cài đặt dễ sử dụng để bật/tắt từng tính năng
- 🔄 **Manual Trigger**: Nút "Chạy ngay bây giờ" để kích hoạt thủ công

## Cài đặt

1. Mở Chrome và vào `chrome://extensions/`
2. Bật "Developer mode" ở góc phải trên
3. Click "Load unpacked" và chọn thư mục `tudongbamcard-checkbox`
4. Extension sẽ xuất hiện trong danh sách

## Cách sử dụng

1. **Tự động**: Extension sẽ tự động chạy khi bạn vào trang thanh toán OpenAI
2. **Cài đặt**: Click vào icon extension để mở settings tab
3. **Thủ công**: Trong settings tab, click "🚀 Chạy ngay bây giờ"

## Settings

- **Tự động bấm Card**: Bật/tắt tính năng tự động mở form thẻ
- **Tự động check Checkbox**: Bật/tắt tính năng tự động check terms

## URL hỗ trợ

Extension chỉ hoạt động trên URL thanh toán OpenAI:
```
https://pay.openai.com/c/pay/cs_live_a1825jOsdYOezUak1bV2w1viVeXrHgr32uQjZ0ycchGlRiYsuBUD313x9S*
```

## Files

- `manifest.json` - Cấu hình extension
- `background.js` - Service worker
- `content.js` - Logic chính chạy trên trang web
- `settings.html` - Giao diện cài đặt
- `settings.js` - Xử lý logic settings
- `icon*.png` - Icon extension (4 kích thước)

## Lưu ý

- Extension chỉ hoạt động trên trang thanh toán OpenAI ChatGPT
- Đảm bảo bạn đã bật extension trước khi sử dụng
- Có thể tắt từng tính năng riêng biệt trong settings

## Troubleshooting

- Nếu không hoạt động: Kiểm tra lại URL và đảm bảo extension đã bật
- Nếu checkbox không được check: Extension sẽ thử nhiều phương pháp khác nhau
- Xem console log để debug: F12 > Console