const userFetchService = {
    findAllUsers: async () => fetch('/api/users'),
    findOneUser: async (id) => fetch(`/api/users/${id}`),
}

menu()

let table = $('#adminTable tbody');
table.empty();

let t = document.location.toString().split('/')
let id = t[4]

userFetchService.findOneUser(id)
    .then(r => r.json())
    .then(user => {
        let userRoles = ""
        user.roles.forEach((r) => {
            userRoles += r.name.replace('ROLE_', '') + ' '
        })
        let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.lastName}</td>
                            <td>${user.name}</td>
                            <td>${user.age}</td>
                            <td>${userRoles}</td>
                        </tr>
                )`;
        table.append(tableFilling);
    })

function menu() {
    let list = $('#list-group');
    list.empty()
    let user_aut = document.getElementById("aut").innerText
    user_aut = user_aut.substring(0, user_aut.indexOf(' '))
    userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                if (user.username === user_aut) {
                    let user_aut_id = user.id
                    userFetchService.findOneUser(user_aut_id)
                        .then(r => r.json())
                        .then(user => {
                            let ddd = ""
                            user.roles.forEach((r) => {
                                if (r.name === 'ROLE_ADMIN') {
                                    ddd = `<a href="/admin" class="list-group-item list-group-item-action">Admin</a>`
                                }
                            })
                            ddd += `<a href="/user/${user_aut_id}" class="list-group-item list-group-item-action active">User</a>`
                            list.append(ddd)
                        })

                }
            })
        })
}