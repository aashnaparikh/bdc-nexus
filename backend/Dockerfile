# ============================================================
# BDC-Nexus Backend — Multi-Stage Dockerfile
# Stage 1: Build JAR with Maven
# Stage 2: Run with minimal JRE image
# ============================================================

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy POM first to cache dependency resolution layer
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests --no-transfer-progress

# Stage 2: Runtime (JRE-only image — smaller than JDK)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
