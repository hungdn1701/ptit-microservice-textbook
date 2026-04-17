# Hướng dẫn Đóng góp (Contributing Guidelines)

Cảm ơn bạn đã quan tâm đến việc đóng góp cho giáo trình! Mọi đóng góp — từ sửa lỗi chính tả nhỏ đến bổ sung nội dung lớn — đều được trân trọng.

---

## 📋 Mục lục

- [Quy tắc ứng xử](#-quy-tắc-ứng-xử)
- [Cách đóng góp](#-cách-đóng-góp)
- [Quy trình Pull Request](#-quy-trình-pull-request)
- [Quy ước viết bài](#-quy-ước-viết-bài)
- [Commit Messages](#-commit-messages)
- [Review Process](#-review-process)

---

## 🤝 Quy tắc ứng xử

Dự án tuân theo [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Bằng việc tham gia, bạn đồng ý tuân thủ các quy tắc này.

---

## 🚀 Cách đóng góp

### 1. Báo lỗi hoặc đề xuất

Nếu bạn phát hiện lỗi hoặc có ý tưởng cải thiện, [tạo một Issue mới](../../issues/new/choose) và chọn template phù hợp:

- 🐛 **Báo lỗi nội dung** — Sai sót kỹ thuật, thông tin không chính xác
- 💡 **Đề xuất nội dung** — Bổ sung ví dụ, mở rộng topic
- ✏️ **Sửa lỗi chính tả** — Typo, ngữ pháp, formatting

### 2. Đóng góp trực tiếp (Pull Request)

#### Bước 1: Fork & Clone

```bash
# Fork repo trên GitHub, sau đó clone (Sử dụng --recurse-submodules nếu bạn là Co-author cần lấy internal references)
git clone --recurse-submodules https://github.com/<your-username>/ptit-microservice-textbook.git
cd ptit-microservice-textbook
```

#### Bước 2: Tạo branch

Đặt tên branch theo convention:

```bash
# Sửa nội dung
git checkout -b docs/ch04-add-grpc-example

# Sửa lỗi
git checkout -b fix/ch03-typo-api-versioning

# Thêm hình/code
git checkout -b feat/ch05-kafka-diagram
```

#### Bước 3: Thực hiện thay đổi

- Đọc [Quy ước viết bài](#-quy-ước-viết-bài) trước khi viết
- Tham khảo `manuscript/style-guide.md` cho voice & tone
- Test build nếu có thể

#### Bước 4: Commit & Push

```bash
git add .
git commit -m "docs(ch04): add gRPC streaming example"
git push origin docs/ch04-add-grpc-example
```

#### Bước 5: Tạo Pull Request

- Vào repo gốc trên GitHub
- Click **"New Pull Request"**
- Điền đầy đủ thông tin theo PR template
- Chờ review

---

## ✍️ Quy ước viết bài

### Ngôn ngữ & Thuật ngữ

- Nội dung chính bằng **tiếng Việt**
- Giữ nguyên tiếng Anh cho các **pattern** và **thuật ngữ kỹ thuật quốc tế**: Saga, Bounded Context, CQRS, Strangler Fig, API Gateway, Event Sourcing, Circuit Breaker, v.v.
- Khi giới thiệu thuật ngữ lần đầu, viết kèm giải thích tiếng Việt trong ngoặc

### Cấu trúc chương

Mỗi file chương (`chapter-XX.md`) tuân theo template:

```markdown
# Chương N: Tiêu đề

> *Opening quote (optional)*

## Mục tiêu chương
- Sau khi đọc xong chương này, bạn sẽ...

## [Nội dung chính]
### Section
### Section

## Case Study: [Tình huống trong LMS]
> Phần minh họa thực tế từ hệ thống LMS

## Tổng kết
- Bullet points tóm tắt

## Câu hỏi ôn tập

## Đọc thêm
- Danh sách tài liệu bổ sung
```

### Nguyên tắc biên soạn

1. **Logic "Nỗi đau → Giải pháp"**: Mỗi pattern/concept bắt đầu bằng vấn đề thực tế trước khi trình bày giải pháp
2. **Bám sát nguồn cốt lõi**: Mỗi chương lấy 1 cuốn sách tham khảo làm kim chỉ nam
3. **Case study LMS**: Mọi lý thuyết phải ánh xạ vào hệ thống LMS thực tế
4. **Code examples**: Đặt trong `code/chXX/`, reference từ manuscript bằng relative path
5. **Figures**: Đặt trong `figures/chXX/`, sử dụng PNG hoặc SVG

### Các loại đóng góp được hoan nghênh

| Loại | Mô tả | Ví dụ |
|---|---|---|
| 📝 Nội dung | Cải thiện diễn đạt, bổ sung giải thích | Làm rõ khái niệm Eventually Consistent |
| 💡 Ví dụ | Thêm ví dụ minh họa thực tế | Thêm sequence diagram cho Saga flow |
| 🖼️ Hình ảnh | Tạo/cải thiện diagram | Vẽ lại architecture diagram bằng draw.io |
| 💻 Code | Code examples chạy được | Spring Boot gRPC example |
| 🌐 Dịch thuật | Dịch sang ngôn ngữ khác | Bản tiếng Anh |
| 🐛 Sửa lỗi | Phát hiện sai sót kỹ thuật | Sửa formula tính availability |
| ⚠️ Anti-pattern | Bổ sung cảnh báo sai lầm | Thêm "sai lầm phổ biến" vào section |

---

## 💬 Commit Messages

Tuân theo [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

### Types

| Type | Mô tả | Ví dụ |
|---|---|---|
| `docs` | Thay đổi nội dung sách | `docs(ch04): add gRPC architecture section` |
| `fix` | Sửa lỗi nội dung | `fix(ch06): correct saga isolation formula` |
| `feat` | Nội dung mới đáng kể | `feat(ch10): add migration decision framework` |
| `code` | Code examples | `code(ch05): add Kafka producer example` |
| `fig` | Hình ảnh / diagram | `fig(ch02): add bounded context diagram` |
| `style` | Formatting, không đổi nội dung | `style(ch03): fix table alignment` |
| `chore` | Build, config, meta | `chore: update build script` |

### Scope

- `chXX` — Chương cụ thể (ví dụ: `ch04`, `ch11`)
- `appendix` — Phụ lục
- Bỏ trống nếu thay đổi chung

---

## 🔍 Review Process

1. **Tự động**: PR template checklist — kiểm tra format, style, file placement
2. **Maintainer review**: Nội dung kỹ thuật và style guide compliance
3. **Merge**: Squash merge vào `master` branch

### Tiêu chí merge

- [ ] Tuân theo style guide
- [ ] Nội dung kỹ thuật chính xác
- [ ] Có nguồn tham khảo (nếu bổ sung kiến thức mới)
- [ ] Không break build
- [ ] Đã được ít nhất 1 maintainer approve

---

## ❓ Có câu hỏi?

- Mở một [Discussion](../../discussions) nếu cần trao đổi trước khi đóng góp
- Tag `@maintainers` trong issue nếu cần hỗ trợ

**Cảm ơn bạn đã giúp cải thiện giáo trình!** 🎉
