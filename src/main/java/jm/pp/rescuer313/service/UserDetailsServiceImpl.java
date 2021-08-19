package jm.pp.rescuer313.service;

import jm.pp.rescuer313.ExeptionHandler.NoUserWithSuchIdException;
import jm.pp.rescuer313.ExeptionHandler.NoUserWithSuchLogin;
import jm.pp.rescuer313.dao.RoleDao;
import jm.pp.rescuer313.dao.UserDao;
import jm.pp.rescuer313.model.Role;
import jm.pp.rescuer313.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserDetailsServiceImpl implements UserService, UserDetailsService {

    private final UserDao userDao;
    private final RoleDao roleDao;
    private final SecurityService securityService;

    @Autowired
    public UserDetailsServiceImpl(UserDao userDao, SecurityService securityService, RoleDao roleDao) {
        this.userDao = userDao;
        this.securityService = securityService;
        this.roleDao = roleDao;
    }

    @Override
    public User findByUsername(String login) {

        try {
            return userDao.findByUsername(login);
        } catch (Exception e) {
            throw new NoUserWithSuchLogin("There is not user with such login");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        return userDao.findByUsername(s);
    }

    @Override
    public void addNewUser(User user) {
        user.setPassword(securityService.getCrypt(user.getPassword()));
        userDao.save(user);
    }

    @Override
    public Set<User> findAllUsers() {
        // sorted by id
        return userDao.findAll().stream()
                .sorted(Comparator.comparing(User::getId))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @Override
    public void updateUser(User user) {
        user.setPassword(securityService.getCrypt(user.getPassword()));
        userDao.save(user);
    }

    @Override
    public List<Role> findAllRoles() {
        return roleDao.findAll();
    }

    @Override
    public User findUserById(Integer id) {
        return userDao.findById(id).orElseThrow(() -> new NoUserWithSuchIdException("User with such id does not exist"));
    }

    @Override
    public void deleteUserById(Integer id) {
        userDao.deleteById(id);
    }
}
