FROM openjdk:21-jdk
WORKDIR /app
COPY target/ServiceRegistry-0.0.1-SNAPSHOT.jar /app/serviceRegistry.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app/serviceRegistry.jar"]
