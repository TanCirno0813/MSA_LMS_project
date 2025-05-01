#!/bin/bash

# 기존 리소스 정리
echo "Cleaning up existing resources..."
./cleanup.sh

# 이미지 빌드 및 Minikube 로드
echo "Building and loading images to Minikube..."
./build-images.sh

# 네임스페이스 생성
echo "Creating microservices namespace..."
kubectl create namespace microservices

# Eureka 서비스 배포
echo "Deploying Eureka service..."
helm install eureka ./eureka -n microservices

# Gateway 서비스 배포
echo "Deploying Gateway service..."
helm install gateway ./gateway -n microservices

# 배포 상태 확인
echo "Checking deployment status..."
kubectl get all -n microservices

# Gateway 서비스의 외부 IP 확인
echo "Checking Gateway service external IP..."
kubectl get svc gateway -n microservices 