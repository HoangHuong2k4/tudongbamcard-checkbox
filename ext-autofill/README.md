# Auto Click Card & Checkbox Extension

Extension Chrome tự động điền dữ liệu, bấm mở card form và check checkbox trên trang thanh toán OpenAI ChatGPT.

## Tính năng

- 📝 **Tự động điền dữ liệu**: Luôn luôn điền email, thẻ và địa chỉ vào form (hiển thị số 0)
- 🎯 **Sinh số thẻ tự động**: Tạo số thẻ ngẫu nhiên từ pattern đã thiết lập
- 🚀 **Tự động bấm mở Card Form**: Luôn luôn click vào nút mở form thẻ thanh toán
- ✅ **Tự động check Checkbox**: Luôn luôn check "Terms of Service" checkbox
- 🌍 **Hỗ trợ đa quốc gia**: Tự động điền địa chỉ theo quốc gia đã chọn
- 🎨 **Tùy chỉnh giao diện**: Điều chỉnh độ trong suốt của Contact Information và Billing Address
- ⚙️ **Settings Tab**: Giao diện cài đặt chi tiết cho từng tính năng
- 🔄 **Manual Trigger**: Nút "Chạy ngay bây giờ" để kích hoạt thủ công

## Cài đặt

1. Mở Chrome và vào `chrome://extensions/`
2. Bật "Developer mode" ở góc phải trên
3. Click "Load unpacked" và chọn thư mục `tudongbamcard-checkbox`
4. Extension sẽ xuất hiện trong danh sách

## Cách sử dụng

1. **Tự động**: Extension sẽ tự động chạy khi bạn vào trang thanh toán OpenAI
2. **Cài đặt**: Click vào icon extension để mở settings tab để tùy chỉnh dữ liệu và giao diện
3. **Thủ công**: Trong settings tab, click "🚀 Chạy ngay bây giờ" để chạy lại

## Settings

### Cài đặt dữ liệu tự động điền
- **Email**: Địa chỉ email cho thanh toán (tự động theo quốc gia đã chọn)
- **Quốc gia**: Chọn giữa Hàn Quốc 🇰🇷 (KR) và Ấn Độ 🇮🇳 (IN) - data sẽ tự động cập nhật theo quốc gia
- **Độ trong suốt input**: Điều chỉnh độ trong suốt của các input fields (0.0-1.0)
  - 1.0: Hiển thị đầy đủ
  - 0.8: Hơi trong suốt
  - 0.5: Nửa trong suốt
  - 0.3: Rất trong suốt
  - 0.1: Gần như ẩn
  - 0.0: Hoàn toàn ẩn
- **💾 Lưu cài đặt**: Lưu tất cả cài đặt hiện tại
- **Pattern thẻ**: Số đầu thẻ (ví dụ: 0000000), hệ thống tự sinh số cuối
- **Tháng/Năm hết hạn**: Tháng và năm hết hạn thẻ (mặc định 02/29)
- **CVC**: Mã CVC của thẻ (mặc định 004)
- **Tên trên thẻ**: Tên hiển thị trên thẻ tín dụng
- **Địa chỉ**: Các trường địa chỉ billing (tự động theo quốc gia)
- **Quận/Huyện**: District/Locality (tự động theo quốc gia)
- **Mã bưu chính**: Postal code
- **Tỉnh/Bang**: State/Province theo quốc gia

**Lưu ý**:
- Extension tự động điền form với dữ liệu từ settings.
- **Hàn Quốc (KR)**: Email `huong@gmail.com`, địa chỉ Hàn Quốc (HUONG MMO, 경상북도, v.v.)
- **Ấn Độ (IN)**: Email `apppowerfultracker8298@missypowell.net`, địa chỉ Ấn Độ (Copernicus Marg, New Delhi, v.v.)
- Tất cả tính năng tự động (bấm card, check checkbox, điền dữ liệu) luôn luôn được bật
- Có thể chuyển đổi giữa 2 quốc gia bất kỳ lúc nào trong settings

## URL hỗ trợ

Extension chỉ hoạt động trên URL thanh toán OpenAI:
```
https://pay.openai.com/c/pay/cs_live_a1825jOsdYOezUak1bV2w1viVeXrHgr32uQjZ0ycchGlRiYsuBUD313x9S*
```

## Files

- `manifest.json` - Cấu hình extension
- `background.js` - Service worker
- `content.js` - Logic chính chạy trên trang web
- `config.js` - Dữ liệu cấu hình quốc gia và mặc định
- `custom.css` - CSS tùy chỉnh cho giao diện
- `settings.html` - Giao diện cài đặt
- `settings.js` - Xử lý logic settings
- `icon*.png` - Icon extension (4 kích thước)

## Lưu ý

- Extension chỉ hoạt động trên trang thanh toán OpenAI ChatGPT
- Đảm bảo bạn đã bật extension trước khi sử dụng
- Tất cả tính năng tự động luôn luôn được bật
- **Quan trọng**: Chỉ sử dụng cho mục đích hợp pháp, tuân thủ điều khoản dịch vụ của OpenAI
- Dữ liệu thanh toán được lưu cục bộ trên máy của bạn

## Troubleshooting

- Nếu không hoạt động: Kiểm tra lại URL và đảm bảo extension đã bật
- Nếu checkbox không được check: Extension sẽ thử nhiều phương pháp khác nhau
- Xem console log để debug: F12 > Console