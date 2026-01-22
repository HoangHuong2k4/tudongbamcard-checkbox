# hCaptcha Solver - Consolidated

## Nguồn gốc

Module này tổng hợp captcha solvers từ 3 extensions:

1. **DeepbypasserV2.1** - Modular approach (5 files)
2. **v2 luxury (postal bypass) fixed** - Bundle approach (1 file)
3. **dot-bypasser-4.5.1-chrome** - (không có file captcha riêng)

## Cấu trúc

```
hcaptcha-solver/
├── deepbypasser/
│   ├── captcha-detector.js      (84KB)  - Phát hiện captcha
│   ├── hcaptcha-injector.js     (36KB)  - Inject solver vào page
│   ├── hcaptcha-interceptor.js  (146KB) - Intercept captcha requests
│   ├── captcha-handler.js       (466KB) - Xử lý captcha
│   └── captcha-solver.js        (123KB) - Logic giải captcha
├── v2-luxury/
│   └── hcaptcha.bundle.js       (1MB)   - Bundle solver với AI
├── models/
│   ├── mobileone-s0.ort         (4.1MB) - ONNX model nhận dạng
│   └── nms-yolov5-det.ort       (7.4KB) - ONNX model NMS
└── README.md
```

**Tổng dung lượng**: ~6MB

## Cách hoạt động

### DeepbypasserV2.1 (Modular)

1. `captcha-detector.js` - Phát hiện khi captcha xuất hiện
2. `hcaptcha-injector.js` - Inject solver vào trang
3. `hcaptcha-interceptor.js` - Chặn và xử lý captcha requests
4. `captcha-handler.js` - Quản lý flow giải captcha
5. `captcha-solver.js` - Logic AI giải captcha

### v2-luxury (Bundle)

- `hcaptcha.bundle.js` - Tất cả trong một, sử dụng ONNX models

## Tích hợp

Cả 2 solvers được inject vào **TẤT CẢ** trang web:

- `run_at: "document_start"` - Chạy sớm nhất
- `all_frames: true` - Chạy trong tất cả frames
- ONNX models accessible cho AI

## Lưu ý

> [!WARNING]
> **Cả 2 solvers chạy đồng thời**
>
> - Có thể conflict với nhau
> - Tăng memory usage (~6MB)
> - Inject vào TẤT CẢ trang (có thể chậm)

> [!TIP]
> **Nếu gặp vấn đề**
>
> - Disable một trong hai solver trong manifest.json
> - DeepbypasserV2.1: Modular, dễ debug
> - v2-luxury: Bundle, nhanh hơn

## Testing

1. Load extension
2. Mở trang có hCaptcha (ví dụ: Discord signup)
3. Check console log
4. Verify captcha được giải tự động

## Performance

- **DeepbypasserV2.1**: 855KB scripts
- **v2-luxury**: 1MB bundle + 4.1MB models
- **Total**: ~6MB inject vào mỗi trang

## Nguồn

- DeepbypasserV2.1: `/DeepbypasserV2.1/modules/`
- v2 luxury: `/v2 luxury (postal bypass) fixed/scripts/hcaptcha/`
- Models: `/v2 luxury (postal bypass) fixed/models/`
