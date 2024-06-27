const urlAdmin = 'http://localhost:8080/api/admin';
const urlCurrentUser = 'http://localhost:8080/api/admin/current';
let tableUsers = [];
let currentUser = "";
let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
let editModal = new bootstrap.Modal(document.getElementById('editModal'));

function getUsers() {
    fetch(urlAdmin, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json()).then(data => {
        tableUsers = data.length > 0 ? data : [];
        showUsers(tableUsers);
    });
}

function showUsers(table) {
    let temp = "";
    table.forEach(user => {
        temp += "<tr>";
        temp += `<td>${user.id}</td>`;
        temp += `<td>${user.name}</td>`;
        temp += `<td>${user.surname}</td>`;
        temp += `<td>${user.username}</td>`;
        temp += `<td>${user.city}</td>`;
        temp += `<td>${user.email}</td>`;
        temp += `<td>${user.roles.map(role => role.name.substring(5)).join(', ')}</td>`;
        temp += `<td><a onclick='showEditModal(${user.id})' class="btn btn-info" id="edit">Edit</a></td>`;
        temp += `<td><a onclick='showDeleteModal(${user.id})' class="btn btn-danger" id="delete">Delete</a></td>`;
        temp += "</tr>";
    });
    document.getElementById("allUsersBody").innerHTML = temp;
}

function showOneUser(user) {
    let temp = "<tr>";
    temp += `<td>${user.id}</td>`;
    temp += `<td>${user.name}</td>`;
    temp += `<td>${user.surname}</td>`;
    temp += `<td>${user.username}</td>`;
    temp += `<td>${user.city}</td>`;
    temp += `<td>${user.email}</td>`;
    temp += `<td>${user.roles.map(role => role.name.substring(5)).join(', ')}</td>`;
    temp += "</tr>";
    document.getElementById("oneUserBody").innerHTML = temp;
}

function rolesUser(event) {
    let roles = [];
    let sel = document.querySelector(event);
    for (let i = 0, n = sel.options.length; i < n; i++) {
        if (sel.options[i].selected) {
            roles.push({ id: parseInt(sel.options[i].value), name: sel.options[i].text });
        }
    }
    return roles;
}

document.getElementById('newUser').addEventListener('submit', addNewUser);

function addNewUser(event) {
    event.preventDefault();
    let newUserForm = new FormData(event.target);
    let user = {
        id: null,
        name: newUserForm.get('name'),
        surname: newUserForm.get('surname'),
        username: newUserForm.get('username'),
        city: newUserForm.get('city'),
        email: newUserForm.get('email'),
        password: newUserForm.get('password'),
        roles: rolesUser("#roles")
    };

    fetch(urlAdmin, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        getUsers();
        event.target.reset();
        const triggerEl = document.querySelector('#nav-home-tab');
        bootstrap.Tab.getInstance(triggerEl).show();
    });
}

function showDeleteModal(id) {
    fetch(`${urlAdmin}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json()).then(deleteUser => {
        document.getElementById('idDel').value = deleteUser.id;
        document.getElementById('firstNameDel').value = deleteUser.name;
        document.getElementById('surnameDel').value = deleteUser.surname;
        document.getElementById('usernameDel').value = deleteUser.username;
        document.getElementById('cityDel').value = deleteUser.city;
        document.getElementById('emailDel').value = deleteUser.email;
        document.getElementById('passwordDel').value = deleteUser.password;
        deleteUser.roles.forEach(role => {
            if (role.name === "ROLE_ADMIN") document.getElementById('rolesDel2').selected = true;
            if (role.name === "ROLE_USER") document.getElementById('rolesDel1').selected = true;
        });
        deleteModal.show();
    });

    document.getElementById('deleteUser').addEventListener('submit', event => {
        event.preventDefault();
        fetch(`${urlAdmin}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(() => {
            getUsers();
            deleteModal.hide();
        });
    });
}

function showEditModal(id) {
    fetch(`${urlAdmin}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json()).then(editUser => {
        document.getElementById('idRed').value = editUser.id;
        document.getElementById('nameRed').value = editUser.name;
        document.getElementById('surnameRed').value = editUser.surname;
        document.getElementById('usernameRed').value = editUser.username;
        document.getElementById('cityRed').value = editUser.city;
        document.getElementById('emailRed').value = editUser.email;
        document.getElementById('passwordRed').value = editUser.password;
        editUser.roles.forEach(role => {
            if (role.name === "ROLE_ADMIN") document.getElementById('rolesRed2').selected = true;
            if (role.name === "ROLE_USER") document.getElementById('rolesRed1').selected = true;
        });
        editModal.show();
    });

    document.getElementById('editUser').addEventListener('submit', submitFormEditUser);
}

function submitFormEditUser(event) {
    event.preventDefault();
    let redUserForm = new FormData(event.target);
    let user = {
        id: redUserForm.get('id'),
        name: redUserForm.get('name'),
        surname: redUserForm.get('surname'),
        username: redUserForm.get('username'),
        city: redUserForm.get('city'),
        email: redUserForm.get('email'),
        password: redUserForm.get('password'),
        roles: rolesUser("#rolesRed")
    };

    fetch(urlAdmin, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(() => {
        getUsers();
        event.target.reset();
        editModal.hide();
    });
}

function initialize() {
    Promise.all([
        fetch(urlAdmin, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()),
        fetch(urlCurrentUser).then(res => res.json())
    ]).then(([usersData, currentUserData]) => {
        tableUsers = usersData.length > 0 ? usersData : [];
        showUsers(tableUsers);

        currentUser = currentUserData;
        showOneUser(currentUser);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}

initialize();