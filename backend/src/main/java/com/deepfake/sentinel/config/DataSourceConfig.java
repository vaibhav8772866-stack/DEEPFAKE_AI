package com.deepfake.sentinel.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.io.File;
import java.nio.file.Files;
import java.util.List;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/deepfake_sentinel?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:root}")
    private String mysqlUsername;

    @Value("${spring.datasource.password:}")
    private String mysqlPassword;

    private String activeDatabaseType = "UNKNOWN";

    @Bean
    @Primary
    public DataSource dataSource() {
        if (mysqlUrl != null && mysqlUrl.startsWith("jdbc:h2:mem:")) {
            this.activeDatabaseType = "H2 In-Memory (Test Suite)";
            HikariConfig testConfig = new HikariConfig();
            testConfig.setJdbcUrl(mysqlUrl);
            testConfig.setUsername(mysqlUsername);
            testConfig.setPassword(mysqlPassword);
            testConfig.setDriverClassName("org.h2.Driver");
            testConfig.setMaximumPoolSize(5);
            testConfig.setPoolName("Sentinel-Test-Pool");
            return new HikariDataSource(testConfig);
        }

        String effectivePassword = resolvePassword();

        log.info("===============================================================================");
        log.info("[DATASOURCE] Initializing strict connection to MySQL database");
        log.info("[DATASOURCE] JDBC URL: {}", mysqlUrl);
        log.info("[DATASOURCE] Username: {}", mysqlUsername);
        log.info("[DATASOURCE] Password configured: {}", (effectivePassword != null && !effectivePassword.isEmpty()));
        log.info("===============================================================================");

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(mysqlUrl);
        config.setUsername(mysqlUsername);
        config.setPassword(effectivePassword != null ? effectivePassword : "");
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(5000);
        config.setPoolName("Sentinel-MySQL-Pool");

        this.activeDatabaseType = "MySQL 8.0 (Native)";
        return new HikariDataSource(config);
    }

    private String resolvePassword() {
        if (mysqlPassword != null && !mysqlPassword.isEmpty()) {
            return mysqlPassword;
        }

        String envPwd = System.getenv("SPRING_DATASOURCE_PASSWORD");
        if (envPwd != null && !envPwd.isEmpty()) {
            return envPwd;
        }

        String mysqlEnvPwd = System.getenv("MYSQL_PASSWORD");
        if (mysqlEnvPwd != null && !mysqlEnvPwd.isEmpty()) {
            return mysqlEnvPwd;
        }

        File[] candidateFiles = new File[]{
                new File(".env"),
                new File("backend/.env"),
                new File(".env.txt"),
                new File("backend/.env.txt"),
                new File("../.env"),
                new File("application-local.properties"),
                new File("backend/src/main/resources/application-local.properties"),
                new File("src/main/resources/application-local.properties")
        };

        for (File f : candidateFiles) {
            if (f.exists() && f.isFile()) {
                try {
                    List<String> lines = Files.readAllLines(f.toPath());
                    for (String line : lines) {
                        line = line.trim();
                        if (line.startsWith("SPRING_DATASOURCE_PASSWORD=")) {
                            String val = line.substring("SPRING_DATASOURCE_PASSWORD=".length()).trim();
                            return stripQuotes(val);
                        } else if (line.startsWith("spring.datasource.password=")) {
                            String val = line.substring("spring.datasource.password=".length()).trim();
                            return stripQuotes(val);
                        } else if (line.startsWith("MYSQL_PASSWORD=")) {
                            String val = line.substring("MYSQL_PASSWORD=".length()).trim();
                            return stripQuotes(val);
                        }
                    }
                } catch (Exception ignored) {}
            }
        }

        return "";
    }

    private String stripQuotes(String val) {
        if (val.startsWith("\"") && val.endsWith("\"") && val.length() >= 2) {
            return val.substring(1, val.length() - 1);
        }
        if (val.startsWith("'") && val.endsWith("'") && val.length() >= 2) {
            return val.substring(1, val.length() - 1);
        }
        return val;
    }

    public String getActiveDatabaseType() {
        return activeDatabaseType;
    }
}
