package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@Component
public class DatabaseInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final RoleRepository roleRepository;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public DatabaseInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        Role userRole = new Role();
        userRole.setName("ROLE_USER");
        roleRepository.save(userRole);

        Role adminRole = new Role();
        adminRole.setName("ROLE_ADMIN");
        roleRepository.save(adminRole);

        Set<Role> userRoles = new HashSet<>();
        userRoles.add(userRole);
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        adminRoles.add(userRole);

        User admin = new User();
        admin.setUsername("admin12");
        admin.setName("Aldfgh245n");
        admin.setEmail("admin12@mail.ru");
        admin.setSurname("BarbashaF24fgsd5");
        admin.setPassword(passwordEncoder.encode("admin12"));
        admin.setRoles(adminRoles);
        userRepository.save(admin);

        User user = new User();
        user.setUsername("user12");
        user.setName("Evsfg");
        user.setEmail("user12@mail.ru");
        user.setSurname("Petinsentsadf2352fg");
        user.setPassword(passwordEncoder.encode("user12"));
        user.setRoles(userRoles);
        userRepository.save(user);


    }
}
