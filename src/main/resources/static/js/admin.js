$(async function () {
    await menu()
    await getTableWithUsers();
    getDefaultModal();
    addNewUser();
})

async function menu() {
    let list = $('#list-group');
    let user_aut = document.getElementById("aut").innerText
    user_aut = user_aut.substring(0, user_aut.indexOf(' '))
    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                if (user.username === user_aut) {
                    let user_aut_id = user.id
                    list.append(`
                    <a href="admin" class="list-group-item list-group-item-action active">Admin</a>
                    <a href="/user/${user_aut_id}" class="list-group-item list-group-item-action">User</a>`)
                }
            })
        })
}

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    findAllRoles: async () => await fetch('api/roles'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#adminTable tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let userRoles = ""
                user.roles.forEach((r) => {
                    userRoles += r.name.replace('ROLE_', '') + ' '
                })
                let tableFilling = `$(
                        <tr id="${user.id}">
                            <td>${user.id}</td>
                            <td id="username${user.id}">${user.username}</td>
                            <td id="lastName${user.id}">${user.lastName}</td>
                            <td id="name${user.id}">${user.name}</td>
                            <td id="age${user.id}">${user.age}</td>  
                            <td id="userRoles${user.id}">${userRoles}</td>    
                               <td>
                                <button data-userid="${user.id}" data-action="edit" class="btn btn-primary eBtn" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                             </td>
                            <td>
                               <button data-userid="${user.id}" data-action="delete" class="btn bg-danger eBtn" 
                               data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#adminTable").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

$('#navTabs a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
})

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {

    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    let rolesInBase = await userFetchService.findAllRoles();
    let roles = rolesInBase.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-outline-success" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    roles.then(rolesObject => {
        let selectRoles = `<select multiple class="form-control" id="rolesEdit" name="roles">`
        rolesObject.forEach(r => {
            selectRoles += `$(
                 <option value="${r.name}">"${r.name.replace('ROLE_', '')}"</option>     
                 )`
        })
        modal.find('.modal-body').append(selectRoles);
    })

    user.then(user => {
        let bodyForm = `
              <form class="form-group" id="editUser">
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>              
                <input class="form-control" type="text" id="username" value="${user.username}"><br>
                <input class="form-control" type="password" id="password"><br>
                <input class="form-control" type="text" id="name" value="${user.name}"><br>
                <input class="form-control" type="text" id="lastName" value="${user.lastName}"><br>
                <input class="form-control" id="age" type="number" value="${user.age}"><br> 
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let username = modal.find("#username").val().trim();
        let name = modal.find("#name").val().trim();
        let lastName = modal.find("#lastName").val().trim();
        let age = modal.find("#age").val().trim();
        let password = modal.find("#password").val().trim();
        let roles = modal.find("#rolesEdit").val();
        let data = {
            id: id,
            username: username,
            name: name,
            lastName: lastName,
            password: password,
            roles: roles,
            age: age
        }
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            //getTableWithUsers();
            // let username = modal.find("#username").val().trim();
            // let name = modal.find("#name").val().trim();
            // let lastName = modal.find("#lastName").val().trim();
            // let age = modal.find("#age").val().trim();
            // let roles = modal.find("#rolesEdit").val();
            document.getElementById("username" + id).textContent = username
            document.getElementById("name"  + id).textContent = name
            document.getElementById("lastName"  + id).textContent = lastName
            document.getElementById("age"  + id).textContent = age
            let userRoles = ""
            roles.forEach((r) => {
                userRoles += r.replace('ROLE_', '') + ' '
            })
            document.getElementById("userRoles" + id).textContent = userRoles
            modal.modal('hide');
        }
    })
}

async function deleteUser(modal, id) {

    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Delete user');

    let deleteButton = `<button  class="btn btn-outline-success" id="deleteButton">Delete</button>`
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let userRoles = ''
        user.roles.forEach((r) => {
            userRoles += r.name.replace('ROLE_', '') + ' '
        })
        let bodyForm = `
            <form class="form-group" id="editUser">
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>              
                <input class="form-control" type="text" id="username" value="${user.username} " disabled><br>
                <input class="form-control" type="password" id="password" disabled><br>
                <input class="form-control" type="text" id="name" value="${user.name}" disabled><br>
                <input class="form-control" type="text" id="lastName" value="${user.lastName}" disabled><br>
                <input class="form-control" type="text" id="roles" value="${userRoles}" disabled><br>
                <input class="form-control" id="age" type="number" value="${user.age}" disabled><br>  
            
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#deleteButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        const response = await userFetchService.deleteUser(id);
        if (response.ok) {
           $('#data').find('#'+ modal.find("#id").val().trim()).remove()
            modal.modal('hide');
        }
    })
}

async function addNewUser() {
    let formNewUser = $('#defaultSomeForm');

    let rolesInBase = await userFetchService.findAllRoles();
    let roles = rolesInBase.json();

    roles.then(rolesObject => {
        let selectRoles = `<select multiple class="form-control" id="AddNewUserRoles" name="roles">`
        rolesObject.forEach(r => {
            selectRoles += `$(
                 <option value="${r.name}">"${r.name.replace('ROLE_', '')}"</option>     
                 )`
        })
        formNewUser.append(selectRoles);
    })

    $('#addNewUserButton').click(async () => {
        let addUserForm = $('#defaultSomeForm')
        let username = addUserForm.find('#AddNewUserUsername').val().trim();
        let password = addUserForm.find('#AddNewUserPassword').val().trim();
        let age = addUserForm.find('#AddNewUserAge').val().trim();
        let name = addUserForm.find('#AddNewUserName').val().trim();
        let lastName = addUserForm.find('#AddNewUserLastName').val().trim();
        let roles = addUserForm.find('#AddNewUserRoles').val();
        let data = {
            username: username,
            password: password,
            age: age,
            roles: roles,
            name: name,
            lastName: lastName
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            getTableWithUsers();
            addUserForm.find('#AddNewUserUsername').val('');
            addUserForm.find('#AddNewUserPassword').val('');
            addUserForm.find('#AddNewUserAge').val('');
            addUserForm.find('#AddNewUserName').val('');
            addUserForm.find('#AddNewUserLastName').val('');
            $('#navTabs a[href="#adminTable"]').tab('show')
        }
    })
}