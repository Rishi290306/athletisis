package com.athletisis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AthletisisApplication {

    public static void main(String[] args) {
        SpringApplication.run(AthletisisApplication.class, args);
    }
}
