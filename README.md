# MSA 기반 LMS 프로젝트

## 프로젝트 개요
이 프로젝트는 마이크로서비스 아키텍처(MSA) 기반의 학습 관리 시스템(LMS)입니다. 각 도메인별로 독립적인 서비스를 구현하여 확장성과 유지보수성을 높였습니다.

## 개발 기간
- 2024.04.15 ~ 2024.05.

## 기술 스택

### Backend
- Java 17, Spring Boot, Spring Cloud
- Gradle, JPA, MySQL
- Redis
- Eureka, Spring Cloud Gateway

### Frontend
- React 18, TypeScript
- Vite
- Material-UI (MUI)
- Redux Toolkit, React Router

### DevOps
- Docker, Kubernetes, Helm (예정)
- Minikube, kubectl

## 서비스 구성도

```
.
├── eureka-server/
├── gateway/
├── admin-service/
├── lecture-service/
├── exam-service/
├── review-service/
├── notice-service/
├── chat-service/
├── frontend/
└── helm/
```

## 로컬 개발 및 실행 방법

### 공통
```bash
./gradlew build
```

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```

### 각 서비스 실행
```bash
cd <service>
./gradlew bootRun
```

## 서비스별 역할

- **eureka-server**: 서비스 디스커버리
- **gateway**: API Gateway, 인증/라우팅
- **admin-service**: 관리자 기능
- **lecture-service**: 강의 관리
- **exam-service**: 시험 관리
- **review-service**: 리뷰 관리
- **notice-service**: 공지사항 관리
- **chat-service**: 실시간 채팅 (REST API 기반)
- **frontend**: 사용자 웹 프론트엔드

## 주요 API 명세

### 강의 서비스 (`/api/lectures`)
- `GET /api/lectures` : 강의 목록 조회
- `GET /api/lectures/{id}` : 강의 상세 조회
- `POST /api/lectures` : 강의 등록

### 시험 서비스 (`/api/exams`)
- `GET /api/exams` : 모든 시험 목록 조회
- `GET /api/exams/{id}` : 시험 상세 조회
- `GET /api/exams/lecture/{lectureId}` : 특정 강의의 시험 목록 조회
- `POST /api/exams` : 시험 생성
- `PUT /api/exams/{id}` : 시험 정보 수정
- `GET /api/exams/latest` : 최근 시험 결과 조회

### 채팅 서비스 (`/api/chat`)
- `GET /api/chat/{userId}` : 사용자의 채팅 메시지 조회
- `POST /api/chat/{userId}` : 메시지 전송

### 공지사항 서비스 (`/api/notices`)
- `GET /api/notices` : 공지사항 목록 조회
- `GET /api/notices/{id}` : 공지사항 상세 조회
- `POST /api/notices` : 공지사항 등록
- `PUT /api/notices/{id}` : 공지사항 수정

### 리뷰 서비스 (`/api/reviews`)
- `GET /api/reviews` : 모든 리뷰 조회

### 관리자 서비스 (`/api/admins`)
- `GET /api/admins/lectures` : 관리자용 강의 목록 조회
- `GET /api/admins/exams/lecture/{lectureId}` : 관리자용 특정 강의의 시험 목록 조회
- `GET /api/admins/contents/lecture/{lectureId}` : 관리자용 특정 강의의 콘텐츠 목록 조회

### 사용자 관리 (`/api/users`)
- `GET /api/users` : 사용자 목록 조회
- `GET /api/users/{id}` : 사용자 상세 정보 조회
- `POST /api/users` : 사용자 등록
- `PUT /api/users/{id}` : 사용자 정보 수정
- `DELETE /api/users/{id}` : 사용자 삭제
- `GET /api/users/me` : 현재 로그인한 사용자 정보 조회

## 폴더 구조
