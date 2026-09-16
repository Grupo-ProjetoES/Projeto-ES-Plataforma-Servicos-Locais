FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests


FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Cria grupo e usuário sem privilégios de root
RUN addgroup -S spring && adduser -S spring -G spring

# Copia o JAR do estágio de build atribuindo a posse ao usuário spring
COPY --from=build /app/target/*.jar app.jar
RUN chown spring:spring /app/app.jar

# Alterna a execução do container para o usuário não-root
USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]