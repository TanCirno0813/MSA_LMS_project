FROM openjdk:17-jdk-slim

WORKDIR /app

COPY build/libs/*.jar eureka-server.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "eureka-server.jar"] 