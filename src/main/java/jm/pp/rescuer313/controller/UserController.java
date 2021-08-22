package jm.pp.rescuer313.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping
public class UserController {

    @GetMapping("/admin")
    public String getIndex() {
        return "pages/index";
    }

    @GetMapping("/user/{id}")
    public String personalPageUser(@PathVariable("id") int id, Model model) {
        return "/pages/user-personal";
    }

}
