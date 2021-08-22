package jm.pp.rescuer313.dto;

import java.util.Set;

public class UserDto {

    private int id;
    private String username;
    private String password;
    private String name;
    private String lastName;
    private Set<String> roles;
    private Integer age;

    public UserDto() {
    }

    public UserDto(String username, String password, String name, String lastName, Integer age, Set<String> roles) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
 //       this.roles = roles;
        this.age = age;
    }

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    public String getLastName() {
        return lastName;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public void setAge(Integer age) {this.age = age;}

    public Integer getAge() {return age;}
}
