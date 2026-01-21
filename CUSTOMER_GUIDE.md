# Hướng dẫn thêm quốc gia mới

## Bước 1: Thêm dữ liệu quốc gia vào config.js

Mở file `config.js` và thêm quốc gia mới vào object `COUNTRY_DATA`:

```javascript
const COUNTRY_DATA = {
  KR: { // Korea
    name: 'Hàn Quốc',
    email: 'huongmmo@example.com',
    billingName: 'HUONG MMO',
    billingAddressLine1: 'HUONG MMO',
    billingAddressLine2: 'HUONG MMO, HUONG MMO',
    billingCity: 'HUONG MMO',
    billingDependentLocality: 'HUONGMMO',
    billingPostalCode: '11004',
    billingState: '경상북도'
  },
  IN: { // India
    name: 'Ấn Độ',
    email: 'huongmmo@example.com',
    billingName: 'HUONG MMO',
    billingAddressLine1: 'Copernicus Marg',
    billingAddressLine2: '',
    billingCity: 'New Delhi',
    billingPostalCode: '110001',
    billingState: 'DL'
  },
  // THÊM QUỐC GIA MỚI Ở ĐÂY
  US: { // United States
    name: 'Hoa Kỳ',
    email: 'example@gmail.com',
    billingName: 'John Doe',
    billingAddressLine1: '123 Main Street',
    billingAddressLine2: 'Apt 4B',
    billingCity: 'New York',
    billingDependentLocality: '',
    billingPostalCode: '10001',
    billingState: 'NY'
  }
};
```

Sau đó thêm mã quốc gia vào mảng `AVAILABLE_COUNTRIES`:

```javascript
const AVAILABLE_COUNTRIES = ['KR', 'IN', 'US']; // Thêm 'US' vào đây
```

## Bước 2: Thêm option vào settings.html

Mở file `settings.html` và tìm phần country select (khoảng dòng 95-100):

```html
<select id="country" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
    <option value="KR">🇰🇷 Hàn Quốc</option>
    <option value="IN">🇮🇳 Ấn Độ</option>
    <!-- THÊM QUỐC GIA MỚI Ở ĐÂY -->
    <option value="US">🇺🇸 Hoa Kỳ</option>
</select>
```

## Lưu ý quan trọng

- **Mã quốc gia** (VD: KR, IN, US) phải giống nhau ở cả `config.js` và `settings.html`
- **Mã quốc gia** phải là 2 ký tự viết hoa theo chuẩn ISO 3166-1 alpha-2
- Các trường bắt buộc:
  - `name`: Tên quốc gia (hiển thị)
  - `email`: Email mặc định
  - `billingName`: Tên người nhận
  - `billingAddressLine1`: Địa chỉ dòng 1
  - `billingCity`: Thành phố
  - `billingPostalCode`: Mã bưu điện
  - `billingState`: Tỉnh/Bang

- Các trường tùy chọn (có thể để trống `''`):
  - `billingAddressLine2`: Địa chỉ dòng 2
  - `billingDependentLocality`: Quận/Huyện

## Ví dụ thêm nhiều quốc gia

```javascript
const COUNTRY_DATA = {
  KR: { /* ... */ },
  IN: { /* ... */ },
  US: {
    name: 'Hoa Kỳ',
    email: 'us@example.com',
    billingName: 'John Doe',
    billingAddressLine1: '123 Main St',
    billingAddressLine2: '',
    billingCity: 'New York',
    billingDependentLocality: '',
    billingPostalCode: '10001',
    billingState: 'NY'
  },
  GB: {
    name: 'Vương Quốc Anh',
    email: 'uk@example.com',
    billingName: 'Jane Smith',
    billingAddressLine1: '10 Downing Street',
    billingAddressLine2: '',
    billingCity: 'London',
    billingDependentLocality: '',
    billingPostalCode: 'SW1A 2AA',
    billingState: 'England'
  },
  JP: {
    name: 'Nhật Bản',
    email: 'jp@example.com',
    billingName: 'Tanaka Taro',
    billingAddressLine1: '1-1-1 Chiyoda',
    billingAddressLine2: '',
    billingCity: 'Tokyo',
    billingDependentLocality: 'Chiyoda-ku',
    billingPostalCode: '100-0001',
    billingState: 'Tokyo'
  }
};

const AVAILABLE_COUNTRIES = ['KR', 'IN', 'US', 'GB', 'JP'];
```

Và trong `settings.html`:

```html
<select id="country">
    <option value="KR">🇰🇷 Hàn Quốc</option>
    <option value="IN">🇮🇳 Ấn Độ</option>
    <option value="US">🇺🇸 Hoa Kỳ</option>
    <option value="GB">🇬🇧 Vương Quốc Anh</option>
    <option value="JP">🇯🇵 Nhật Bản</option>
</select>
```

## Sau khi chỉnh sửa

1. Lưu cả 2 file `config.js` và `settings.html`
2. Reload extension trong Chrome:
   - Vào `chrome://extensions/`
   - Bấm nút reload (🔄) ở extension
3. Mở settings và kiểm tra quốc gia mới đã xuất hiện chưa
