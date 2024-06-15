package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.entity.User;

import java.util.List;


@Service
public interface UserService extends UserDetailsService {

    User findByUsername(String username);

    void addUser(User user);

    List<User> getAllUsers();

    void deleteUser(Long id);

    User getUser(Long id);

    void updateUser(User user);


}
