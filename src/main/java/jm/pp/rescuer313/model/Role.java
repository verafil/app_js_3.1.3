package jm.pp.rescuer313.model;

import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    private String name;

    public Role() { }

    public Role(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    @ManyToMany(mappedBy = "roles")
    private Set<User> users;

    public Role(String name) {
        this.name = name;
    }

    public Long getId() { return id; }

    public String getRole() { return name; }

    public void setId(Long id) { this.id = id; }

    public void setRole(String role) { this.name = role; }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    @Override
    public String getAuthority() { return name; }

    @Override
    public String toString() {
        return name.replace("ROLE_", "");
    }
}
