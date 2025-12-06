# 🛠️ Sorison Admin Panel  
시민 민원 접수 시스템 내부 관리자 전용 대시보드

Sorison Admin Panel은 실시간으로 접수된 민원을 조회하고,  
처리 상태를 관리하며, STT 기반 분석 결과를 확인할 수 있는  
**내부 관리자용 웹 어드민 서비스**입니다.

본 레포는 키오스크 민원 접수 서비스와 별도로 관리되는  
**독립된 관리자 프론트엔드 레포지토리**입니다.

---

## 🚀 Features

### ✔ 관리자 로그인 (JWT 인증)
- FastAPI 백엔드 인증 API 연동
- 토큰 기반 보호 라우팅 처리

### ✔ 민원 목록 조회
- 실제 DB에 적재된 민원 데이터 실시간 조회
- 최신순 정렬, 페이징, 필터링 확장 가능

### ✔ 민원 상세 정보 열람
- 접수 음성 → STT 결과
- AI 파이프라인 분석 결과(요약/카테고리/위험도/요청사항)
- 내부 직원용 memo 데이터까지 확인 가능

### ✔ 백오피스 기능 확장 가능
- 관리자 권한(Role) 구조 확장 준비됨
- 운영 통계 대시보드 예정
- Excel 다운로드 / 검색 기능 추가 예정
- 문자 전송 확장 가능

---

## 🏗️ Project Structure

sorison_admin/
├── public/
└── src/
├── components/ # UI 컴포넌트
├── pages/ # 화면 페이지
├── router/ # 라우팅 설정
└── api/ # axios API 클라이언트
 
---

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- React Router
- Axios

### Backend (별도 레포)
- FastAPI (Python)
- JWT 기반 인증
- 민원 데이터 CRUD API 제공  
👉 Admin API Repo: https://github.com/leemis825/aischool-project

---

## 🔗 API Connection

`.env` 파일에서 API 서버 주소를 관리합니다.

## 🧪 Local Development
```bash
git clone https://github.com/ChoeunKim/sorison_admin.git
cd sorison_admin
npm install
npm run dev
브라우저에서 열기
👉 http://localhost:5174
```
⚠ 백엔드(FastAPI) 서버가 실행 중이어야 로그인 기능이 정상 동작합니다.

## 📦 Production Build
Nginx (HTTPS Reverse Proxy)

Ncloud Load Balancer + Object Storage

Docker Container 기반 정적 호스팅
