INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
    1,
    '비즈니스 매너 기본 평가',
    '이메일 작성, 전화 응대, 회의 매너 등 직장 내 기본 비즈니스 매너에 대한 평가입니다.',
    '2025-04-20T10:00:00',
    '2025-04-20T11:00:00',
    '[
      {
        "id": 1,
        "type": "objective",
        "question": "이메일 제목에 적절한 표현은 무엇인가요?",
        "choices": ["뭐요", "긴급", "요청 사항 드립니다", "ㅎㅇ"],
        "answer": "요청 사항 드립니다"
      },
      {
        "id": 2,
        "type": "objective",
        "question": "전화 응대 시 첫 인사로 올바른 것은?",
        "choices": ["여보세요", "누구세요", "안녕", "안녕하세요, ○○부 ○○입니다"],
        "answer": "안녕하세요, ○○부 ○○입니다"
      },
      {
        "id": 3,
        "type": "subjective",
        "question": "회의 중 휴대전화 사용이 왜 바람직하지 않은지 설명하세요.",
        "answer": "집중력 저하, 예의 부족, 회의 흐름 방해 등"
      },
      {
        "id": 4,
        "type": "subjective",
        "question": "비즈니스 이메일 작성 시 유의할 점을 두 가지 이상 서술하세요.",
        "answer": "명확한 제목, 정중한 표현, 맞춤법 검토"
      }
    ]'
    );


INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           2,
           '보고서/기획서 작성법 기본 평가',
           '직장내 보고서/기획서 작성법에 대한 시험입니다.',
           '2025-04-22T14:00:00',
           '2025-04-22T15:00:00',
           '[
      {
        "id": 1,
        "type": "objective",
        "question": "좋은 보고서의 제목으로 가장 적절한 것은?",
        "choices": ["요약 정리", "내용 많음", "보고", "2025년 2분기 마케팅 성과 분석"],
        "answer": "2025년 2분기 마케팅 성과 분석"
      },
      {
        "id": 2,
        "type": "objective",
        "question": "기획서 작성 시 가장 먼저 고려해야 할 요소는?",
        "choices": ["폰트 크기", "배경 색상", "독자의 니즈", "문서 길이"],
        "answer": "독자의 니즈"
      },
      {
        "id": 3,
        "type": "subjective",
        "question": "기획서 작성 시 논리적 구조가 중요한 이유를 서술하세요.",
        "answer": "핵심 전달력 향상, 독자의 이해도 증가, 흐름 있는 내용 전개"
      },
      {
        "id": 4,
        "type": "subjective",
        "question": "보고서 본문에 포함되어야 하는 기본 구성 요소를 두 가지 이상 서술하세요.",
        "answer": "서론, 본론, 결론, 데이터 근거"
      }
    ]'
);

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           3,
           '시간 관리 및 우선순위 설정 평가',
           '업무 시간 관리 및 우선순위 설정 능력에 대한 평가입니다.',
           '2025-04-22T15:30:00',
           '2025-04-22T16:30:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 시간 관리 매트릭스(아이젠하워 매트릭스)의 1사분면에 해당하는 업무는?",
        "choices": [
          "긴급하지 않고 중요하지 않은 업무",
          "긴급하고 중요한 업무",
          "중요하지만 긴급하지 않은 업무",
          "중요하지 않지만 긴급한 업무"
        ],
        "answer": "긴급하고 중요한 업무"
      },
      {
        "id": 2,
        "type": "objective",
        "question": "업무 우선순위를 결정할 때 가장 먼저 고려해야 할 것은?",
        "choices": [
          "개인 취향",
          "업무 양",
          "업무 마감 시간과 중요도",
          "다른 사람의 의견"
        ],
        "answer": "업무 마감 시간과 중요도"
      },
      {
        "id": 3,
        "type": "subjective",
        "question": "우선순위 설정의 중요성을 본인의 경험이나 사례를 들어 서술하세요.",
        "answer": "업무 효율성 향상, 마감 기한 준수, 스트레스 감소"
      },
      {
        "id": 4,
        "type": "subjective",
        "question": "하루 업무를 계획할 때 고려해야 할 요소를 두 가지 이상 서술하세요.",
        "answer": "중요도, 긴급성, 예상 소요 시간"
      }
    ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           4,
           '비즈니스 커뮤니케이션 기본 평가',
           '협업, 피드백, 설득력 있는 말하기 등 비즈니스 커뮤니케이션 역량에 대한 시험입니다.',
           '2025-04-23T10:00:00',
           '2025-04-23T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 효과적인 피드백의 특징으로 가장 적절한 것은?",
               "choices": [
                 "감정을 담아 강하게 전달한다",
                 "일방적으로 지시한다",
                 "구체적으로 설명하고 개선 방향을 제시한다",
                 "팀원 앞에서 비판한다"
               ],
               "answer": "구체적으로 설명하고 개선 방향을 제시한다"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "비즈니스 이메일에서 상대방을 설득하고자 할 때 가장 중요한 전략은?",
               "choices": [
                 "감정을 앞세운 표현",
                 "객관적인 근거와 이점 제시",
                 "구체적인 요청 없이 압박",
                 "친한 말투로 유도"
               ],
               "answer": "객관적인 근거와 이점 제시"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "업무 중 협업 시 경청이 중요한 이유를 두 가지 이상 서술하세요.",
        "answer": "상대방의 입장 이해, 오해 방지, 신뢰 형성"
      },
      {
        "id": 4,
        "type": "subjective",
        "question": "설득력 있는 커뮤니케이션을 위해 갖추어야 할 요소를 서술하세요.",
        "answer": "논리적 구성, 적절한 예시, 청중 분석"
      }
    ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           5,
           '조직 문화 이해 기본 평가',
           '조직의 가치, 행동 규범, 커뮤니케이션 스타일 등 조직 문화를 이해하기 위한 평가입니다.',
           '2025-04-24T09:00:00',
           '2025-04-24T10:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "조직 문화가 강한 회사의 특징으로 가장 적절한 것은?",
               "choices": [
                 "직원들이 각자 다른 방향으로 행동한다",
                 "의사소통이 단절되어 있다",
                 "공통된 가치관과 행동 기준을 공유한다",
                 "상급자 지시만 따르고 의견을 내지 않는다"
               ],
               "answer": "공통된 가치관과 행동 기준을 공유한다"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "다음 중 조직 문화의 구성 요소가 아닌 것은?",
               "choices": [
                 "비전과 미션",
                 "조직 구조도",
                 "행동 규범",
                 "공유 가치"
               ],
               "answer": "조직 구조도"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "조직 문화를 이해하는 것이 신입사원에게 왜 중요한지 서술하세요.",
               "answer": "조직 적응 속도 향상, 원활한 협업, 갈등 예방"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "당신이 속한 조직의 문화를 파악하기 위해 어떤 행동을 할 수 있는지 두 가지 이상 서술하세요.",
               "answer": "선배 관찰, 회의 분위기 파악, 사내 커뮤니케이션 방식 이해"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           6,
           '개인정보보호 기본 평가',
           '직무 수행 중 개인정보보호 원칙과 유의사항에 대한 이해도를 점검하는 평가입니다.',
           '2025-05-01T10:00:00',
           '2025-05-01T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 개인정보에 해당하는 정보는 무엇인가요?",
               "choices": [
                 "회사 전화번호",
                 "직원의 주민등록번호",
                 "공개된 기업 매출 정보",
                 "부서 내 사무실 번호"
               ],
               "answer": "직원의 주민등록번호"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "개인정보를 처리할 때 반드시 지켜야 하는 원칙은?",
               "choices": [
                 "최소한의 수집 및 목적 외 사용 금지",
                 "수집 후 무기한 보관",
                 "직원 공유용으로 자유 배포",
                 "문서에 비밀번호 안 걸기"
               ],
               "answer": "최소한의 수집 및 목적 외 사용 금지"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "개인정보 유출 사고가 조직에 미치는 영향을 서술하세요.",
               "answer": "신뢰도 하락, 법적 책임 발생, 금전적 손실"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "개인정보를 안전하게 보호하기 위한 실무적인 조치를 두 가지 이상 서술하세요.",
               "answer": "비밀번호 설정, 접근 권한 관리, 문서 암호화"
             }
           ]'
       );


INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           7,
           'PC 보안 기본 평가',
           '업무용 PC에서 발생할 수 있는 보안 위협을 예방하고 안전한 사용 습관을 점검하기 위한 평가입니다.',
           '2025-05-03T10:00:00',
           '2025-05-03T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "업무용 PC를 안전하게 사용하는 방법으로 적절한 것은?",
               "choices": [
                 "비밀번호를 메모장에 저장",
                 "외부인이 사용할 수 있게 열어두기",
                 "출근 시 자동 로그인 설정",
                 "정기적으로 백신 프로그램 업데이트"
               ],
               "answer": "정기적으로 백신 프로그램 업데이트"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "PC에 대한 악성 코드 감염 예방 수단으로 적절하지 않은 것은?",
               "choices": [
                 "불필요한 파일 다운로드",
                 "정기적인 보안 점검",
                 "이메일 첨부파일 확인",
                 "운영체제 최신 업데이트"
               ],
               "answer": "불필요한 파일 다운로드"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "업무 중 PC를 잠금 상태로 유지해야 하는 이유를 서술하세요.",
               "answer": "무단 접근 방지, 정보 유출 차단, 보안 유지"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "PC 보안을 위해 개인이 실천할 수 있는 행동 두 가지 이상을 서술하세요.",
               "answer": "비밀번호 주기적 변경, 공공장소에서 화면 보호기 설정, 외부 저장 장치 사용 자제"
             }
           ]'
       );


INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           8,
           '엑셀 고급 사용법 평가',
           '엑셀의 함수 활용, 피벗 테이블, 자동화 기능 등 실무에서 필요한 고급 기능을 평가하는 시험입니다.',
           '2025-05-06T10:00:00',
           '2025-05-06T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 VLOOKUP 함수의 주요 용도는 무엇인가요?",
               "choices": [
                 "데이터 정렬",
                 "값 비교",
                 "특정 값을 기준으로 다른 값을 참조",
                 "그래프 작성"
               ],
               "answer": "특정 값을 기준으로 다른 값을 참조"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "피벗 테이블의 주된 기능은 무엇인가요?",
               "choices": [
                 "조건부 서식 설정",
                 "데이터 요약 및 분석",
                 "셀 병합",
                 "시트 이동"
               ],
               "answer": "데이터 요약 및 분석"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "엑셀 자동화 기능 중 매크로(Macro)의 활용 예를 두 가지 서술하세요.",
               "answer": "반복 업무 자동화, 동일한 보고서 포맷 자동 작성"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "IF 함수와 함께 사용되는 AND 함수의 활용 사례를 설명하세요.",
               "answer": "여러 조건이 모두 참일 때 특정 값을 출력하는 논리 판단"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           9,
           'AI 기반 업무 자동화 평가',
           'AI 도구를 활용한 반복 업무 자동화와 효율 향상에 대한 이해를 평가합니다.',
           '2025-04-25T10:00:00',
           '2025-04-25T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 AI를 활용한 업무 자동화의 장점으로 가장 적절한 것은?",
               "choices": [
                 "사람의 개입을 늘림",
                 "수작업 증가",
                 "업무 오류 가능성 증가",
                 "반복 업무의 효율적 처리"
               ],
               "answer": "반복 업무의 효율적 처리"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "AI 자동화 도구 중 이메일 자동 분류에 가장 적합한 기술은?",
               "choices": [
                 "OCR",
                 "이미지 생성",
                 "자연어 처리(NLP)",
                 "3D 렌더링"
               ],
               "answer": "자연어 처리(NLP)"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "AI를 활용하여 회의록을 자동으로 정리할 수 있는 방법을 설명하세요.",
               "answer": "음성 인식 기술을 활용해 발언을 텍스트로 변환하고, 자연어 처리로 요약한다."
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "AI 도구를 업무에 도입할 때 고려해야 할 점 두 가지를 서술하세요.",
               "answer": "데이터 보안, 사용자 교육 필요성"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (

           10,
           '프로젝트 관리 기본 평가',
           '일정 수립, 리스크 관리, 협업 도구 사용 등 프로젝트 관리 역량에 대한 이해를 평가합니다.',
           '2025-04-26T10:00:00',
           '2025-04-26T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 프로젝트 일정 계획에 가장 효과적인 도구는?",
               "choices": [
                 "파워포인트",
                 "워드프로세서",
                 "간트 차트",
                 "이미지 뷰어"
               ],
               "answer": "간트 차트"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "리스크 관리의 주요 단계에 해당하지 않는 것은?",
               "choices": [
                 "리스크 식별",
                 "리스크 분석",
                 "리스크 무시",
                 "대응 계획 수립"
               ],
               "answer": "리스크 무시"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "프로젝트에서 협업 도구(Jira, Trello 등)를 사용하는 이유를 서술하세요.",
               "answer": "업무 분담 관리, 실시간 피드백, 일정 추적 등의 효율성을 위해 사용한다."
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "프로젝트 성공을 위한 핵심 요소 두 가지를 서술하세요.",
               "answer": "명확한 목표 설정, 팀원 간 원활한 커뮤니케이션"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           11,
           '코칭 & 피드백 스킬 기본 평가',
           '팀원 성장을 위한 코칭 기법과 효과적인 피드백 전달법에 대한 이해를 평가합니다.',
           '2025-04-27T10:00:00',
           '2025-04-27T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "코칭 대화에서 가장 중요한 리더의 역할은 무엇인가?",
               "choices": [
                 "결과만 지시한다",
                 "지속적으로 질문하고 경청한다",
                 "지시만 내린다",
                 "의견을 강하게 주장한다"
               ],
               "answer": "지속적으로 질문하고 경청한다"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "다음 중 효과적인 피드백의 조건으로 적절하지 않은 것은?",
               "choices": [
                 "구체적이고 명확해야 한다",
                 "즉시 전달하는 것이 좋다",
                 "감정을 중심으로 표현해야 한다",
                 "개선 방향을 포함해야 한다"
               ],
               "answer": "감정을 중심으로 표현해야 한다"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "성장을 유도하는 코칭의 핵심 요소를 두 가지 이상 서술하세요.",
               "answer": "신뢰 관계 형성, 열린 질문, 자기 주도적 문제 해결 유도"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "피드백을 줄 때 유의해야 할 점을 두 가지 이상 서술하세요.",
               "answer": "비난이 아닌 개선 중심, 구체적 사례 제시"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (

           12,
           '직원 간 갈등 해결법 기본 평가',
           '직장 내 구성원 간 갈등 상황에서의 효과적인 대응 및 중재 역량을 평가합니다.',
           '2025-04-28T10:00:00',
           '2025-04-28T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 갈등 상황에서 효과적인 중재자가 가져야 할 태도는?",
               "choices": [
                 "한쪽 편을 든다",
                 "조용히 넘어간다",
                 "공정하고 중립적인 입장을 유지한다",
                 "강하게 훈계한다"
               ],
               "answer": "공정하고 중립적인 입장을 유지한다"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "갈등 상황에서 가장 먼저 해야 할 적절한 행동은?",
               "choices": [
                 "문제의 책임자를 징계한다",
                 "갈등 원인을 분석하고 경청한다",
                 "문제를 무시한다",
                 "즉시 부서 변경을 지시한다"
               ],
               "answer": "갈등 원인을 분석하고 경청한다"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "갈등 상황에서 효과적인 커뮤니케이션이 중요한 이유를 두 가지 이상 서술하세요.",
               "answer": "오해 해소, 감정 완화, 신뢰 회복, 합리적 해결 도출"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "조직에서 갈등을 예방하기 위한 사전적 노력을 두 가지 이상 서술하세요.",
               "answer": "명확한 역할 분담, 정기적인 피드백 문화, 팀워크 강화 활동"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (

           13,
           '회의 운영 & 퍼실리테이션 기본 평가',
           '효과적인 회의 운영 능력과 퍼실리테이션 스킬을 평가합니다.',
           '2025-04-29T10:00:00',
           '2025-04-29T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 생산적인 회의 운영을 위한 필수 요소는?",
               "choices": [
                 "참석자 전원에게 발언 기회를 주지 않는다",
                 "명확한 아젠다와 시간 계획을 마련한다",
                 "무작위로 회의를 시작한다",
                 "기록 없이 구두로만 진행한다"
               ],
               "answer": "명확한 아젠다와 시간 계획을 마련한다"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "퍼실리테이터의 역할로 가장 적절한 것은?",
               "choices": [
                 "모든 결정을 혼자 내린다",
                 "의견 충돌을 방치한다",
                 "참여자 간 소통을 유도하고 균형 잡힌 참여를 이끈다",
                 "주제를 벗어난 논의를 유도한다"
               ],
               "answer": "참여자 간 소통을 유도하고 균형 잡힌 참여를 이끈다"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "회의록 작성의 필요성과 포함되어야 할 기본 요소를 서술하세요.",
               "answer": "결정 사항 정리, 책임자 명시, 후속 조치 관리 / 회의 주제, 참석자, 내용 요약, 결정사항 포함"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "효과적인 퍼실리테이션을 위한 진행자의 태도나 기술을 두 가지 이상 서술하세요.",
               "answer": "중립성 유지, 경청과 요약 능력, 질문 유도, 시간 관리 능력"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (

           14,
           '뇌과학 기반 학습법 기본 평가',
           '뇌과학 이론에 기반한 집중력, 기억력 향상 전략 등을 평가합니다.',
           '2025-04-30T10:00:00',
           '2025-04-30T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 장기기억으로 전환되는 데 가장 중요한 요소는?",
               "choices": [
                 "수면 부족",
                 "반복 학습과 휴식의 균형",
                 "불안한 감정 상태",
                 "정보를 암기 없이 외우기"
               ],
               "answer": "반복 학습과 휴식의 균형"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "학습 시 집중력을 향상시키는 과학적 방법으로 적절한 것은?",
               "choices": [
                 "긴 시간 동안 쉬지 않고 공부하기",
                 "여러 과목을 동시에 멀티태스킹",
                 "학습 환경에서 방해 요소 제거",
                 "중간에 SNS 확인하기"
               ],
               "answer": "학습 환경에서 방해 요소 제거"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "포모도로(Pomodoro) 기법의 원리와 뇌과학적 효과를 서술하세요.",
               "answer": "25분 집중 후 5분 휴식을 반복하여 집중력을 유지하고 뇌의 피로를 줄임"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "기억력을 높이기 위한 뇌 자극 전략을 두 가지 이상 서술하세요.",
               "answer": "연관된 이야기로 기억하기, 시각적 이미지 사용, 충분한 수면"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (

           15,
           '비즈니스 영어 실무 기본 평가',
           '이메일, 전화, 회의 등 실무 상황에서 활용되는 영어 표현 능력을 평가합니다.',
           '2025-05-01T10:00:00',
           '2025-05-01T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 이메일에서 요청을 정중하게 표현한 문장은?",
               "choices": [
                 "Send me the report now.",
                 "I need the report today.",
                 "Please give me the report.",
                 "Could you please send me the report by EOD?"
               ],
               "answer": "Could you please send me the report by EOD?"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "전화 응대 시 상대방이 자신을 알아들을 수 있도록 하는 소개 문장은?",
               "choices": [
                 "Who is this?",
                 "Hi, this is Marketing.",
                 "Hello, this is Sarah Kim from the HR department.",
                 "I called you earlier."
               ],
               "answer": "Hello, this is Sarah Kim from the HR department."
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "회의 중 동의를 표현할 때 사용할 수 있는 영어 표현을 두 가지 이상 서술하세요.",
               "answer": "I agree with you, That makes sense"
            },
            {
              "id": 4,
              "type": "subjective",
              "question": "비즈니스 영어 이메일에서 자주 쓰이는 마무리 문구를 두 가지 이상 서술하세요.",
              "answer": "Best regards, Sincerely, Looking forward to your response"
            }
          ]'
        );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (

           16,
           '마인드셋 코칭법 기본 평가',
           '성장형 사고방식(Growth Mindset) 및 긍정적 마인드셋 형성을 위한 코칭 기법에 대해 평가합니다.',
           '2025-05-02T10:00:00',
           '2025-05-02T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "성장형 마인드셋(Growth Mindset)을 가장 잘 설명한 것은?",
               "choices": [
                 "능력은 타고난 것이며 변하지 않는다.",
                 "실패는 끝을 의미한다.",
                 "노력과 학습을 통해 역량이 향상될 수 있다.",
                 "실패를 피해야 한다."
               ],
               "answer": "노력과 학습을 통해 역량이 향상될 수 있다."
             },
             {
               "id": 2,
               "type": "objective",
               "question": "코칭 대화에서 마인드셋 전환을 유도하는 질문은?",
               "choices": [
                 "왜 이걸 못했나요?",
                 "다른 방법은 생각 안 해봤나요?",
                 "이 일을 계속할 수 있겠어요?",
                 "이 상황에서 무엇을 배울 수 있을까요?"
               ],
               "answer": "이 상황에서 무엇을 배울 수 있을까요?"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "고정형 마인드셋(Fixed Mindset)이 조직 내에서 미치는 부정적 영향을 두 가지 이상 서술하세요.",
               "answer": "변화 저항, 실패 회피, 성장 정체"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "긍정적인 마인드셋을 형성하기 위한 코칭 전략을 두 가지 이상 서술하세요.",
               "answer": "실패의 의미 재해석, 강점 기반 피드백, 성과보다는 과정에 집중"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (
           17,
           '업무 스트레스 관리법 기본 평가',
           '직장인의 스트레스 원인 파악 및 효과적인 대응 전략에 대한 이해를 평가합니다.',
           '2025-05-03T10:00:00',
           '2025-05-03T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 스트레스 완화를 위한 방법으로 가장 적절한 것은?",
               "choices": [
                 "업무를 무조건 미루기",
                 "혼자서 모든 것을 해결하려 하기",
                 "규칙적인 운동과 충분한 수면",
                 "불만을 동료에게 지속적으로 표출하기"
               ],
               "answer": "규칙적인 운동과 충분한 수면"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "직무 스트레스 요인으로 일반적으로 볼 수 없는 것은?",
               "choices": [
                 "모호한 역할",
                 "비현실적인 마감 기한",
                 "효율적인 의사소통",
                 "지속적인 업무 과부하"
               ],
               "answer": "효율적인 의사소통"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "직장에서 스트레스를 받을 때 자신이 사용할 수 있는 개인적인 관리 전략을 두 가지 이상 서술하세요.",
               "answer": "심호흡, 산책, 명상, 시간 분배 조절"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "조직 차원에서 직무 스트레스를 예방하기 위한 방안을 두 가지 이상 서술하세요.",
               "answer": "명확한 역할 정의, 휴식 권장 문화, 피드백 시스템 마련"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (

           18,
           '디지털 문해력 교육 기본 평가',
           '디지털 환경에서 필요한 정보 해석 능력과 도구 활용 이해도를 평가합니다.',
           '2025-05-04T10:00:00',
           '2025-05-04T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 디지털 문해력이 높은 사람의 특징으로 가장 적절한 것은?",
               "choices": [
                 "모든 정보를 SNS로 판단한다",
                 "출처가 불분명해도 정보를 공유한다",
                 "가짜 뉴스와 신뢰할 수 있는 정보를 구분할 수 있다",
                 "단순히 많은 정보를 저장해둔다"
               ],
               "answer": "가짜 뉴스와 신뢰할 수 있는 정보를 구분할 수 있다"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "디지털 도구 사용 시 개인정보보호를 위해 기본적으로 해야 할 행동은?",
               "choices": [
                 "공용 PC에서 로그인 유지 설정",
                 "비밀번호를 메모장에 저장",
                 "정기적인 비밀번호 변경 및 2단계 인증",
                 "SNS에 업무 정보를 자주 공유"
               ],
               "answer": "정기적인 비밀번호 변경 및 2단계 인증"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "디지털 시대에 정보의 진위 여부를 확인하는 방법을 두 가지 이상 서술하세요.",
               "answer": "공식 출처 확인, 팩트체크 사이트 활용, 날짜 및 작성자 검토"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "디지털 도구(예: 협업 툴, 메신저 등)를 효과적으로 사용하기 위한 습관을 서술하세요.",
               "answer": "중복 공유 방지, 알림 설정, 정리된 파일명 사용, 업무별 채널 구분"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (

           19,
           '스마트워크 도구 활용 평가',
           'Slack, Notion, Trello 등 디지털 협업 도구의 이해와 활용 능력을 평가합니다.',
           '2025-05-05T10:00:00',
           '2025-05-05T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 Trello의 주된 활용 용도로 가장 적절한 것은?",
               "choices": [
                 "화상 회의 진행",
                 "채팅 기반 커뮤니케이션",
                 "업무 일정 시각화 및 카드 기반 협업 관리",
                 "문서 작성 자동화"
               ],
               "answer": "업무 일정 시각화 및 카드 기반 협업 관리"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "Notion의 주요 기능이 아닌 것은?",
               "choices": [
                 "문서 및 데이터베이스 통합 관리",
                 "실시간 음성 회의",
                 "할 일 목록 작성",
                 "사내 위키 문서 구성"
               ],
               "answer": "실시간 음성 회의"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "Slack을 사용할 때 효과적인 커뮤니케이션을 위한 방법을 두 가지 이상 서술하세요.",
               "answer": "채널 목적에 맞는 메시지 작성, 이모지 리액션 활용, 멘션으로 명확한 대상 지정"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "스마트워크 도구를 사용하면서 생길 수 있는 문제점과 그 해결 방안을 각각 서술하세요.",
               "answer": "알림 과다 = 필터링 설정, 정보 중복 = 체계적인 문서화 및 권한 관리"
             }
           ]'
       );

INSERT INTO exam (lecture_id, title, description, start_time, end_time, question)
VALUES (

           20,
           '원격 커뮤니케이션 기본 평가',
           '비대면 환경에서의 효과적인 커뮤니케이션 및 협업 능력을 평가합니다.',
           '2025-05-06T10:00:00',
           '2025-05-06T11:00:00',
           '[
             {
               "id": 1,
               "type": "objective",
               "question": "다음 중 원격 회의 시 효과적인 참여 방법으로 적절하지 않은 것은?",
               "choices": [
                 "회의 전에 자료를 미리 검토한다",
                 "말할 때 마이크를 켠다",
                 "다른 업무를 병행한다",
                 "카메라를 켜고 눈맞춤을 시도한다"
               ],
               "answer": "다른 업무를 병행한다"
             },
             {
               "id": 2,
               "type": "objective",
               "question": "비동기 협업에서 커뮤니케이션 누락을 줄이기 위한 방법은?",
               "choices": [
                 "업무 완료 후 공유하지 않는다",
                 "대면 보고를 기다린다",
                 "문서와 코멘트를 남기고 기록을 남긴다",
                 "단톡방에 비공식적으로 전달한다"
               ],
               "answer": "문서와 코멘트를 남기고 기록을 남긴다"
             },
             {
               "id": 3,
               "type": "subjective",
               "question": "원격 근무 중 커뮤니케이션 오류를 줄이기 위한 방법을 두 가지 이상 서술하세요.",
               "answer": "정기적인 회의, 명확한 메시지 작성, 기록 기반 소통"
             },
             {
               "id": 4,
               "type": "subjective",
               "question": "비대면 회의에서 발표자가 청중의 주의를 끌기 위한 전략을 서술하세요.",
               "answer": "시각자료 활용, 질문 던지기, 실시간 채팅 활용, 이름 언급"
             }
           ]'
       );

