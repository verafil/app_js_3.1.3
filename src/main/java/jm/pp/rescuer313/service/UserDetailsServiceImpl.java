package jm.pp.rescuer313.service;

import jm.pp.rescuer313.dao.RoleDao;
import jm.pp.rescuer313.dao.UserDao;
import jm.pp.rescuer313.dto.UserDto;
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

            return userDao.findByUsername(login);
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        return userDao.findByUsername(s);
    }

    @Override
    public void addNewUser(UserDto userDto) {
    //    user.setPassword(securityService.getCrypt(user.getPassword()));
        User user = fromUserDtoToUser(userDto);
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
    public void updateUser(UserDto userDto) {
      //  user.setPassword(securityService.getCrypt(user.getPassword()));
        User user = fromUserDtoToUser(userDto);
        userDao.save(user);
    }

    @Override
    public List<Role> findAllRoles() {
        return roleDao.findAll();
    }

    @Override
    public User findUserById(Integer id) {
        return userDao.findById(id).orElseThrow();
    }

    @Override
    public void deleteUserById(Integer id) {
        userDao.deleteById(id);
    }

    private User fromUserDtoToUser(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        if (userDto.getPassword().isEmpty()) {
            user.setPassword(userDao.findById(userDto.getId()).get().getPassword());
        } else {
            user.setPassword(securityService.getCrypt(userDto.getPassword()));
        }
        user.setName(userDto.getName());
        user.setLastName(userDto.getLastName());
        user.setAge(userDto.getAge());

        Set<Role> roles = new LinkedHashSet<>();
        if (userDto.getRoles() != null) {
            for (String roleName : userDto.getRoles()) {
                Role roleInBase = roleDao.findByName(roleName);
                if (roleInBase != null) {
                    roles.add(roleInBase);
                } else {
                    roles.add(new Role(roleName));
                }
            }
        } else {
            roles = null;
        }
        user.setRoles(roles);
        return user;
    }
}
