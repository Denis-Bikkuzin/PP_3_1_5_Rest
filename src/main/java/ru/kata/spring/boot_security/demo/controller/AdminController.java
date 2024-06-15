package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    private final RoleService roleService;


    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;


    }

    @GetMapping("")
    public String allUsers(Model model) {
        model.addAttribute("allUsers", userService.getAllUsers());
        return "admin";
    }

    @GetMapping("/show")
    public String show(@RequestParam("id") long id, Model model) {
        model.addAttribute("user", userService.getUser(id));
        return "admin";
    }

    @GetMapping("/new")
    public String newUser(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.allRoles());
        return "new";
    }

    @PostMapping("/create")
    public String create(@ModelAttribute("user") User user, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("userRoles", roleService.allRoles());
            return "new";
        }
        userService.addUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/edit")
    public String edit(@RequestParam("id") long id, Model model) {
        model.addAttribute("user", userService.getUser(id));
        model.addAttribute("userRoles", roleService.allRoles());
        return "edit";
    }

    @PostMapping("/update")
    public String update(@ModelAttribute("user") User user, Model model) {
        model.addAttribute("userRoles", roleService.allRoles());
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/delete")
    public String delete(@RequestParam("id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
