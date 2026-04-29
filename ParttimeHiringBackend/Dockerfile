# ===== Build stage =====
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom trước để tận dụng cache dependency
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy source code
COPY src ./src

# Build jar
RUN mvn -q clean package -DskipTests


# ===== Runtime stage =====
FROM eclipse-temurin:21-jre

WORKDIR /app

# Render sẽ cấp PORT runtime, Spring Boot đã đọc từ application.yml
ENV PORT=8080

# Copy jar từ stage build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]