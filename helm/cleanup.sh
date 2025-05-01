#!/bin/bash

echo "Uninstalling Helm releases..."
helm uninstall eureka gateway -n microservices

echo "Deleting microservices namespace..."
kubectl delete namespace microservices

echo "Removing Docker images..."
docker rmi eureka:latest gateway:latest

echo "Cleanup completed!" 