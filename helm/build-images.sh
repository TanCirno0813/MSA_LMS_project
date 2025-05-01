#!/bin/bash

# Eureka 이미지 빌드
echo "Building Eureka image..."
docker build -t eureka:latest -f ../eureka-server/Dockerfile ../eureka-server
if [ $? -ne 0 ]; then
    echo "Failed to build Eureka image"
    exit 1
fi

# Eureka 이미지를 Minikube에 로드
echo "Loading Eureka image to Minikube..."
minikube image load eureka:latest
if [ $? -ne 0 ]; then
    echo "Failed to load Eureka image to Minikube"
    exit 1
fi

# Gateway 이미지 빌드
echo "Building Gateway image..."
docker build -t gateway:latest -f ../gateway/Dockerfile ../gateway
if [ $? -ne 0 ]; then
    echo "Failed to build Gateway image"
    exit 1
fi

# Gateway 이미지를 Minikube에 로드
echo "Loading Gateway image to Minikube..."
minikube image load gateway:latest
if [ $? -ne 0 ]; then
    echo "Failed to load Gateway image to Minikube"
    exit 1
fi

# 이미지 로드 확인
echo "Verifying images in Minikube..."
minikube image ls | grep -E "eureka|gateway"

echo "All images have been built and loaded to Minikube successfully!" 