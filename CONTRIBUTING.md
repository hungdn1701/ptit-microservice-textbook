# Contributing Guidelines

## Quy ước viết bài

### Ngôn ngữ & Thuật ngữ
- Nội dung chính bằng **tiếng Việt**
- Giữ nguyên tiếng Anh cho các **pattern** và **thuật ngữ kỹ thuật toàn cầu**: Saga, Bounded Context, CQRS, Strangler Fig, API Gateway, Event Sourcing, v.v.
- Khi giới thiệu thuật ngữ lần đầu, viết kèm giải thích tiếng Việt trong ngoặc

### Cấu trúc chương
Mỗi file chương (`.md`) tuân theo template:

```markdown
# Chương N: Tiêu đề

> *Opening quote (optional)*

## Mục tiêu chương
- Sau khi đọc xong chương này, bạn sẽ...

## [Nội dung chính]
### Section
### Section

## Case Study: [Tên tình huống trong LMS]
> Phần minh họa từ case study

## Tổng kết
- Bullet points tóm tắt

## Đọc thêm
- Danh sách tài liệu bổ sung
```

### Nguyên tắc biên soạn
1. **Bám sát nguồn cốt lõi**: Mỗi chương lấy 1 cuốn sách làm kim chỉ nam
2. **Logic "Nỗi đau → Giải pháp"**: Luôn bắt đầu bằng vấn đề thực tế
3. **Code examples**: Đặt trong `code/chXX/`, reference từ manuscript bằng relative path
4. **Figures**: Đặt trong `figures/chXX/`, sử dụng PNG hoặc SVG

### Commit Messages
```
docs(ch04): add synchronous communication patterns
code(ch05): add Kafka producer example
fig(ch02): add bounded context diagram
```
