# Trích xuất và Kiểm tra Thuật ngữ: DDD & Bounded Contexts (Chương 2)

**Lưu ý**: Tài liệu này chứa các văn bản được cào (extract) trực tiếp bằng Python/PyMuPDF từ các tệp `.pdf` gốc của sách tham chiếu để chứng minh tính học thuật.

## 1. Conway's Law (Định luật Conway)
*   **Nguồn**: Sam Newman - *Monolith to Microservices*, Trang 21.
*   **Trích xuất vật lý gốc**: *"Any organization that designs a system…will inevitably produce a design whose structure is a copy of the organization’s communication structure. —Melvin Conway, How Do Committees Invent?"*
*   **Đối chiếu bản thảo**: Bản thảo dịch chuẩn xác ý tưởng của Melvin Conway (được Sam Newman trích lại), giữ lại được thuật ngữ "Inverse Conway Maneuver".

## 2. Bounded Context (Ngữ cảnh Giới hạn)
*   **Nguồn**: Eric Evans - *Domain-Driven Design*, Trang 208.
*   **Trích xuất vật lý gốc**: *"A BOUNDED CONTEXT delimits the applicability of a particular model so that team members have a clear and shared understanding of what has to be consistent and how it relates to other CONTEXTS. Within that CONTEXT, work to keep the model logically unified..."*
*   **Đối chiếu bản thảo**: Khái niệm Bounded Context trong hệ thống LMS được áp dụng đúng như "ranh giới mà thuật ngữ mang ý nghĩa nhất quán".

## 3. Ubiquitous Language (Ngôn ngữ Chung)
*   **Nguồn**: Eric Evans - *Domain-Driven Design*, Trang 13.
*   **Trích xuất vật lý gốc**: *"A project needs a common language that is more robust than the lowest common denominator. With a conscious effort by the team, the domain model can provide the backbone for that common language... The vocabulary of that UBIQUITOUS LANGUAGE includes the names of classes..."*
*   **Đối chiếu bản thảo**: Chuẩn hóa thành "Ngôn ngữ chung" (Ubiquitous Language) hoàn toàn chính xác theo nguyên tác.

## 4. Aggregate
*   **Nguồn**: Eric Evans - *Domain-Driven Design*, Trang 70.
*   **Trích xuất vật lý gốc**: *"AGGREGATES tighten up the model itself by defining clear ownership and boundaries, avoiding a chaotic, tangled web of objects. This pattern is crucial to maintaining integrity..."*
*   **Đối chiếu bản thảo**: Việc giới hạn ghi đè transaction trong một Aggregate duy nhất tuân thủ chính xác quy luật này.

## 5. Shared Kernel (Lõi chia sẻ)
*   **Nguồn**: Eric Evans - *Domain-Driven Design*, Trang 209.
*   **Trích xuất vật lý gốc**: *"This BOUNDED CONTEXT is made up of all those aspects of the system that are driven by this particular model... (The SHARED KERNEL, discussed later in this chapter, might be a good choice.)"*
*   **Đối chiếu bản thảo**: Dùng đúng khái niệm để cảnh báo nguy cơ Coupling.

**Kết luận Physical Extraction**: Các trích đoạn nguyên bản từ Eric Evans và Sam Newman khẳng định nền tảng lý thuyết của Chương 2 đã được áp dụng đúng văn phong học thuật.
