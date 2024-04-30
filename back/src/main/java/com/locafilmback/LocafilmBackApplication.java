package com.locafilmback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.*")
@EnableJpaRepositories("com.*")
@ComponentScan(basePackages = { "com.*" })
public class LocafilmBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(LocafilmBackApplication.class, args);
	}

}
