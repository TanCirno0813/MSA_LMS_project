# MSA 프로젝트 Helm 배포 가이드

이 프로젝트는 Spring Cloud 기반의 MSA(Microservice Architecture) 애플리케이션을 Kubernetes 환경에 배포하기 위한 Helm 차트를 제공합니다.

## 사전 요구사항

- Docker
- Kubernetes (minikube)
- Helm 3.x
- kubectl
- Node.js (프론트엔드 개발용)

## Node.js 설치 가이드 (Ubuntu)

### NVM을 사용한 Node.js 설치

1. 시스템 업데이트:
```bash
sudo apt update
sudo apt upgrade -y
```

2. NVM 설치를 위한 필수 패키지 설치:
```bash
sudo apt install curl
```

3. NVM 설치:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

4. NVM을 현재 셸에서 사용할 수 있도록 설정:
```bash
source ~/.bashrc
```

5. 설치된 NVM 버전 확인:
```bash
nvm --version
```

6. Node.js 설치 (LTS 버전):
```bash
nvm install 18  # LTS 버전 설치
```

7. 설치된 Node.js 버전 확인:
```bash
node -v
npm -v
```

8. 특정 버전의 Node.js 사용:
```bash
nvm use 18  # Node.js 18 버전 사용
```

### 추가 명령어

- 다른 Node.js 버전 설치:
```bash
nvm install 16  # Node.js 16 버전 설치
nvm install 20  # Node.js 20 버전 설치
```

- 설치된 Node.js 버전 목록 확인:
```bash
nvm ls
```

- 기본 Node.js 버전 설정:
```bash
nvm alias default 18  # Node.js 18을 기본 버전으로 설정
```

- 글로벌 npm 패키지 설치:
```bash
npm install -g yarn  # 예: yarn 설치
```

### 주의사항

1. NVM을 설치한 후에는 터미널을 재시작하거나 `source ~/.bashrc`를 실행해야 합니다.
2. 프로젝트마다 다른 Node.js 버전이 필요한 경우, 프로젝트 디렉토리에서 `nvm use <version>`을 실행하여 버전을 변경할 수 있습니다.
3. 시스템 전체에 Node.js를 설치하려면 다음 명령어를 사용할 수 있습니다:
```bash
sudo apt install nodejs npm
```
하지만 이 방법은 버전 관리가 어렵기 때문에 NVM 사용을 추천합니다.

## 프로젝트 구조

```
.
├── eureka-server/          # Eureka 서비스 디스커버리 서버
├── gateway/               # API Gateway 서비스
├── frontend/              # Vue.js 프론트엔드
└── helm/                  # Helm 차트
    ├── eureka/            # Eureka 서비스 Helm 차트
    ├── gateway/           # Gateway 서비스 Helm 차트
    ├── build-images.sh    # Docker 이미지 빌드 스크립트
    ├── cleanup.sh         # 리소스 정리 스크립트
    └── deploy.sh          # 배포 스크립트
```

## 배포 방법

### 1. JAR 파일 준비
- Eureka 서비스 JAR 파일을 `eureka-server/build/libs/` 폴더에 복사
- Gateway 서비스 JAR 파일을 `gateway/build/libs/` 폴더에 복사

### 2. 배포 스크립트 실행
```bash
# 스크립트 실행 권한 부여
chmod +x helm/*.sh

# 배포 실행
./helm/deploy.sh
```

배포 스크립트는 다음 작업을 순차적으로 수행합니다:
1. 기존 리소스 정리 (Helm 릴리즈, 네임스페이스, Docker 이미지)
2. Docker 이미지 빌드 및 Minikube에 로드
3. microservices 네임스페이스 생성
4. Eureka 서비스 배포
5. Gateway 서비스 배포
6. 배포 상태 확인

### 3. 외부 접속 방법

#### 방법 1: minikube service 명령어 사용
```bash
minikube service gateway -n microservices
```
이 명령어는 자동으로 브라우저를 열어 Gateway 서비스에 접속할 수 있는 URL을 제공합니다.

#### 방법 2: minikube tunnel 사용
```bash
# 터미널 1: 터널 실행
minikube tunnel

# 터미널 2: 서비스 상태 확인
kubectl get svc gateway -n microservices
```
터널을 실행한 후 EXTERNAL-IP를 통해 접속할 수 있습니다:
- http://EXTERNAL-IP:9898/api/users
- http://EXTERNAL-IP:9898/api/products

주의: minikube tunnel은 백그라운드에서 계속 실행되어야 하며, 터널을 종료하면 외부 접속이 중단됩니다.

## 리소스 정리
모든 리소스를 정리하려면 다음 명령어를 실행합니다:
```bash
./helm/cleanup.sh
```

## 서비스 상태 확인
```bash
# 모든 리소스 상태 확인
kubectl get all -n microservices

# Gateway 서비스 상태 확인
kubectl get svc gateway -n microservices
```

## 서비스 스케일링

### Gateway 서비스 레플리카 수 조정
Gateway 서비스의 레플리카 수를 조정하려면 다음 단계를 따르세요:

1. `helm/gateway/values.yaml` 파일에서 `replicaCount` 값을 수정합니다.
2. 다음 명령어로 변경사항을 적용합니다:
   ```bash
   helm upgrade gateway ./helm/gateway -n microservices
   ```
3. 변경된 레플리카 수를 확인합니다:
   ```bash
   kubectl get pods -n microservices | grep gateway
   ```

## Helm 차트 관리

### 차트 업그레이드

설정을 변경한 후 차트를 업그레이드합니다:

```bash
helm upgrade msa-app ./helm
```

### 차트 삭제

배포된 차트를 삭제합니다:

```bash
helm uninstall msa-app -n msa-namespace
```

## 설정 변경

`helm/values.yaml` 파일을 수정하여 다음 설정을 변경할 수 있습니다:

- 네임스페이스
- 이미지 태그
- 서비스 포트
- 환경 변수
- 레플리카 수

## 문제 해결

### 일반적인 문제

1. JAR 파일 없음
   - 각 서비스의 build/libs 디렉토리에 JAR 파일이 있는지 확인
   - JAR 파일 이름이 올바른지 확인 (eureka-server-*.jar, gateway-*.jar)

2. Dockerfile 문제
   - Dockerfile이 올바른 위치에 있는지 확인
   - JAR 파일 경로가 Dockerfile과 일치하는지 확인

3. 이미지 로드 실패
   - minikube가 실행 중인지 확인
   - Docker 이미지가 올바르게 빌드되었는지 확인

4. 서비스 접속 불가
   - 서비스 상태 확인: `kubectl get svc -n msa-namespace`
   - 포드 상태 확인: `kubectl get pods -n msa-namespace`
   - 로그 확인: `kubectl logs <pod-name> -n msa-namespace`

### 로그 확인

```bash
# Eureka 서버 로그
kubectl logs -f deployment/eureka-server -n msa-namespace

# Gateway 서비스 로그
kubectl logs -f deployment/gateway -n msa-namespace
```

## 참고사항

- 이 Helm 차트는 개발 환경을 위한 기본 설정을 제공합니다.
- 프로덕션 환경에서는 보안 설정, 리소스 제한, 모니터링 등을 추가로 구성해야 합니다.
- 필요에 따라 `values.yaml` 파일의 설정을 수정하여 환경에 맞게 조정할 수 있습니다. 