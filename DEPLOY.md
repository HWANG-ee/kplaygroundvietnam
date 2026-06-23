# 🚀 배포 가이드 — Vercel + Neon (무료)

이 프로젝트를 무료로 인터넷에 공개하는 방법입니다.
**Vercel**(웹사이트 호스팅) + **Neon**(PostgreSQL DB) + **GitHub**(코드 저장) 조합을 사용합니다.

> 왜 DB를 바꾸나요? Vercel은 서버리스라 파일(SQLite)이 유지되지 않습니다.
> 그래서 데이터(회원/주문/상품)는 Neon Postgres에 저장합니다. 코드 변경은 이미 준비돼 있습니다.

---

## ✅ 당신이 할 일 (계정 3개 — 모두 무료, 카드 불필요)

### 1. Neon 데이터베이스 만들기
1. https://neon.tech → GitHub/Google로 가입
2. **Create project** (이름 아무거나, 리전은 `Singapore` 권장 — 베트남/한국과 가까움)
3. 생성 후 **Connection string** 화면에서 두 가지를 복사:
   - **Pooled connection** (`...-pooler...`) → `DATABASE_URL` 로 사용
   - **Direct connection** (pooler 없는 것) → `DIRECT_URL` 로 사용
   - 형식 예: `postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

### 2. GitHub 빈 저장소 만들기
1. https://github.com/new
2. 이름: `k-playground` (Public/Private 아무거나), **README 체크 해제** (빈 저장소로)
3. 만든 뒤 나오는 저장소 URL 복사 (예: `https://github.com/내아이디/k-playground.git`)

### 3. 위 정보를 저에게 전달
- Neon **DATABASE_URL**, **DIRECT_URL**
- GitHub 저장소 **URL**

→ 그러면 제가 **DB 전환 + 시드 + 커밋**을 하고, 푸시/배포 단계를 함께 진행합니다.

---

## 🤖 제가 할 일 (당신이 위 정보를 주면)
1. Prisma를 SQLite → PostgreSQL로 전환 (schema.prisma)
2. Neon에 테이블 생성(`prisma db push`) + 시드 데이터 주입(상품/계정)
3. 연결 정상 동작 확인
4. GitHub에 푸시

## 🌐 Vercel 배포 (마지막, 함께)
1. https://vercel.com → GitHub로 가입 → **Add New → Project** → 방금 만든 repo **Import**
2. **Environment Variables** 에 입력:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled 연결문자열 |
   | `DIRECT_URL` | Neon direct 연결문자열 |
   | `AUTH_SECRET` | 아무 긴 랜덤 문자열 (32자 이상) |
   | `VNP_TMN_CODE` | (선택) VNPay 코드 |
   | `VNP_HASH_SECRET` | (선택) VNPay 시크릿 |
   | `VNP_URL` | (선택) `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` |
3. **Deploy** 클릭 → 1~2분 후 `https://k-playground-xxxx.vercel.app` 주소 발급 🎉

---

## 참고 사항
- 메인 배너 BTS 사진(`public/hero-bg.jpg`)은 코드에 포함돼 **그대로 표시됩니다.**
- 관리자 **실시간 사진 업로드**는 운영(서버리스)에서 비활성화됩니다 → 상품 이미지는 **URL 붙여넣기** 또는 자동 커버 사용. (영구 업로드가 필요하면 추후 Vercel Blob 연결)
- 데모 계정 — 관리자 `admin@kplayground.co.kr` / `admin1234`, 일반 `user@test.com` / `user1234`
- `git push` 시 GitHub 로그인(토큰)이 필요합니다 — 이 환경엔 GitHub CLI가 없어, 푸시는 당신 PC의 인증으로 진행합니다(안내해 드림).
