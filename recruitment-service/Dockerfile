FROM openjdk:17-jdk-slim

WORKDIR /app

COPY build/libs/*.jar gateway.jar

EXPOSE 9898

ENTRYPOINT ["java", "-jar", "gateway.jar"] 