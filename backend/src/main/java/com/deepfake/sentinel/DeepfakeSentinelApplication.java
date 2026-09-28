package com.deepfake.sentinel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
public class DeepfakeSentinelApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeepfakeSentinelApplication.class, args);
    }
}
