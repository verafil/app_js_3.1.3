package jm.pp.rescuer313.service;

import jm.pp.rescuer313.model.Role;
import jm.pp.rescuer313.model.User;

import java.util.List;
import java.util.Set;

public interface UserService {
    User findByUsername(String login);
    void addNewUser(User user);
    Set<User> findAllUsers();
    User findUserById(Integer id);
    void deleteUserById(Integer id);
    void updateUser(User user);
    List<Role> findAllRoles();
}
