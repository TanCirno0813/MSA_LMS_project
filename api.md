# LMS API 문서

## 1. Gateway Service API

### User API (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | 전체 사용자 목록 조회 |
| GET | `/api/users/{id}` | 특정 사용자 정보 조회 |
| POST | `/api/users` | 사용자 생성 |
| PUT | `/api/users/{id}` | 사용자 정보 수정 |
| DELETE | `/api/users/{id}` | 사용자 삭제 |
| GET | `/api/users/check-username/{username}` | 사용자명 중복 체크 |
| POST | `/api/users/register` | 회원가입 (비밀번호 암호화, 기본 역할: USER) |
| POST | `/api/users/login` | 로그인 (JWT 토큰 발급) |
| GET | `/api/users/me` | 내 정보 조회 (JWT 토큰 필요) |
| PUT | `/api/users/me` | 내 정보 수정 (JWT 토큰 필요, 비밀번호 변경 가능) |

### Completion API (`/api/completions`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/completions` | 수강 완료 목록 조회 |
| POST | `/api/completions` | 수강 완료 등록 |

### SMS API (`/api/sms`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sms/send` | SMS 발송 |

## 2. Lecture Service API

### Lecture API (`/api/lectures`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lectures` | 강의 목록 조회 (페이징, 검색, 필터링)<br>- simple: 간단한 목록 조회 (이름, ID, 설명만)<br>- page: 페이지 번호 (기본값: 1)<br>- limit: 페이지당 항목 수 (기본값: 9)<br>- category: 카테고리 필터링<br>- keyword: 제목 검색 |
| GET | `/api/lectures/{id}` | 강의 상세 정보 조회 (제목, 작성자, 설명, 콘텐츠 목록 포함) |
| POST | `/api/lectures` | 강의 생성 (제목, 작성자, 설명, 썸네일, 카테고리) |
| PUT | `/api/lectures/{id}` | 강의 정보 수정 (제목, 작성자, 설명, 썸네일, 카테고리) |
| DELETE | `/api/lectures/{id}` | 강의 삭제 |

### Content API (`/api/contents`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contents/lecture/{lectureId}` | 특정 강의의 모든 콘텐츠 조회 |
| GET | `/api/contents/{id}` | 특정 콘텐츠 상세 조회 |
| POST | `/api/contents` | 새 콘텐츠 생성 (제목, 타입, URL, 강의 ID) |
| PUT | `/api/contents/{id}` | 콘텐츠 수정 (제목, 타입, URL, 강의 ID) |
| DELETE | `/api/contents/{id}` | 콘텐츠 삭제 |

### Lecture Notice API (`/api/lectures/{lectureId}/notices`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lectures/{lectureId}/notices` | 강의 공지사항 목록 조회 (생성일 기준 내림차순) |
| POST | `/api/lectures/{lectureId}/notices` | 강의 공지사항 작성 (관리자만) |
| PUT | `/api/lectures/{lectureId}/notices/{noticeId}` | 강의 공지사항 수정 (제목, 내용, 수정 시각 갱신) |
| DELETE | `/api/lectures/{lectureId}/notices/{noticeId}` | 강의 공지사항 삭제 |

### Lecture QnA API (`/api/lectures/{lectureId}/qna`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lectures/{lectureId}/qna` | 강의 QnA 목록 조회 (생성일 기준 내림차순) |
| POST | `/api/lectures/{lectureId}/qna` | 강의 QnA 질문 작성 |
| PUT | `/api/lectures/{lectureId}/qna/{qnaId}/answer` | 강의 QnA 답변 작성 (답변 시각 자동 기록) |
| DELETE | `/api/lectures/{lectureId}/qna/{qnaId}` | 강의 QnA 삭제 |

### Lecture Review API (`/api/lectures/{lectureId}/reviews`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lectures/{lectureId}/reviews` | 강의 리뷰 목록 조회 (생성일 기준 내림차순) |
| POST | `/api/lectures/{lectureId}/reviews` | 강의 리뷰 작성 |
| PUT | `/api/lectures/{lectureId}/reviews/{reviewId}` | 강의 리뷰 수정 (제목, 내용, 수정 시각 갱신, 작성자/관리자만) |
| DELETE | `/api/lectures/{lectureId}/reviews/{reviewId}` | 강의 리뷰 삭제 (작성자/관리자만) |

## 3. Notice Service API

### Notice API (`/api/notices`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notices` | 공지사항 목록 조회 (생성일 기준 내림차순) |
| GET | `/api/notices/{id}` | 공지사항 상세 조회 |
| POST | `/api/notices` | 공지사항 작성 (생성 시각 자동 기록) |
| PUT | `/api/notices/{id}` | 공지사항 수정 (제목, 내용) |
| DELETE | `/api/notices/{id}` | 공지사항 삭제 |

## 4. Exam Service API

### Exam API (`/api/exams`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exams` | 전체 시험 목록 조회 |
| GET | `/api/exams/{id}` | 특정 시험 상세 조회 |
| GET | `/api/exams/lecture/{lectureId}` | 특정 강의의 시험 목록 조회 |
| GET | `/api/exams/latest` | 최근 시험 결과 목록 조회 |
| POST | `/api/exams` | 새 시험 생성 |
| PUT | `/api/exams/{id}` | 시험 정보 수정 |

### Exam Result API (`/api/exam-results`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exam-results` | 시험 결과 목록 조회 |
| POST | `/api/exam-results` | 시험 결과 제출 |
| GET | `/api/exam-results/{id}` | 시험 결과 상세 조회 |

### Grading API (`/api/grading`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/grading/submit` | 여러 시험 결과 일괄 제출 및 채점 |

## 5. Chat Service API

### Chat API (`/api/chat`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/{userId}` | 사용자의 최근 채팅 메시지 조회 |
| POST | `/api/chat/{userId}` | 사용자의 채팅 메시지 전송 및 AI 응답 |

## 6. Admin Service API

### Content Admin API (`/api/admins/contents`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admins/contents/lecture/{lectureId}` | 특정 강의의 콘텐츠 목록 조회 |
| GET | `/api/admins/contents/{id}` | 특정 콘텐츠 상세 조회 |
| POST | `/api/admins/contents` | 새 콘텐츠 생성 |
| PUT | `/api/admins/contents/{id}` | 콘텐츠 정보 수정 |
| DELETE | `/api/admins/contents/{id}` | 콘텐츠 삭제 |

### Exam Admin API (`/api/admins/exams`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admins/exams/lecture/{lectureId}` | 특정 강의의 시험 목록 조회 |
| GET | `/api/admins/exams/{id}` | 특정 시험 상세 조회 |
| GET | `/api/admins/exams/quiz/{id}` | 특정 시험 상세 조회 (하위 호환성) |
| POST | `/api/admins/exams` | 새 시험 생성 |
| PUT | `/api/admins/exams/{id}` | 시험 정보 수정 |
| PUT | `/api/admins/exams/{id}/questions` | 시험 문제 목록 수정 |
| DELETE | `/api/admins/exams/{id}` | 시험 삭제 |

### Lecture Admin API (`/api/admins/lectures`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admins/lectures` | 전체 강의 목록 조회 (페이징 없음) |
| GET | `/api/admins/lectures/{id}` | 특정 강의 상세 조회 |
| POST | `/api/admins/lectures` | 새 강의 생성 |
| PUT | `/api/admins/lectures/{id}` | 강의 정보 수정 |
| DELETE | `/api/admins/lectures/{id}` | 강의 삭제 |

## API 공통 사항

### 인증/인가
- 대부분의 API는 JWT 토큰 기반 인증 필요
- 관리자 API는 추가적인 권한 검사 필요

### 데이터 검증
- Request Body에 대한 유효성 검사
- Path Variable, Query Parameter 검증

### 응답 형식
- 성공: 200 OK, 201 Created
- 실패: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- 에러 응답에 대한 일관된 형식 사용

### 페이징/정렬
- 목록 조회 API는 페이징과 정렬 지원
- 검색과 필터링 기능 제공