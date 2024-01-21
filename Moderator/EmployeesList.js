document.getElementById('logoutButton').addEventListener('click', function () {
    fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/login.html'; // Redirect to login page after logout
            } else {
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
});


function fetchEmployees() {
    fetch('/employees')
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

function populateTable(employees) {
    const table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    employees.forEach((employee, index) => {
        let row = table.insertRow();
        // Add cells and set their content
        row.insertCell(0).innerHTML = employee.EmpId;
        row.insertCell(1).innerHTML = employee.EmpName;
        row.insertCell(2).innerHTML = employee.EmpType;
        row.insertCell(3).innerHTML = `<button onclick="editEmployee(${index})">Edit</button><button onclick="deleteEmployee(${employee.EmpId})">Delete</button>`;
    });
}

function addNewEmployee() {
    const table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();

    // Add a temporary ID or placeholder
    newRow.insertCell(0).innerText = 'New';
    newRow.insertCell(1).innerHTML = `<input type="text" name="EmpName" />`;
    newRow.insertCell(2).innerHTML = createEmpTypeDropdown('');
    newRow.insertCell(3).innerHTML = `<button onclick="saveNewEmployee(this)">Save</button><button onclick="cancelNewEmployee(this)">Cancel</button>`;
}

function cancelNewEmployee(button) {
    var row = button.parentNode.parentNode;
    row.remove(); // Remove the new row
}

function saveNewEmployee(button) {
    var row = button.parentNode.parentNode;
    var nameInput = row.cells[1].querySelector('input').value;
    var typeSelect = row.cells[2].querySelector('select').value;

    fetch('/api/addEmployee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            EmpName: nameInput,
            EmpType: typeSelect
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Employee added successfully. Username: ' + data.newUsername);
                row.remove();
                fetchEmployees();
            } else {
                alert('Error adding employee: ' + (data.message || ''));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding employee');
        });
}

function editEmployee(rowIndex) {
    var table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    var row = table.rows[rowIndex];
    var editButton = row.querySelector('button');

    if (editButton.innerText === 'Edit') {
        // Switch to edit mode
        toggleEditMode(row, true);
        editButton.innerText = 'Save';
        editButton.insertAdjacentHTML('afterend', `<button onclick="cancelEdit(${rowIndex})">Cancel</button>`);
    } else {
        // Handle saving logic
        handleSave(row, rowIndex);
    }
}

function handleSave(row, rowIndex) {
    var empId = row.cells[0].innerText;
    var nameInput = row.cells[1].querySelector('input');
    var typeSelect = row.cells[2].querySelector('select');

    toggleEditMode(row, false, nameInput.value, typeSelect.value);
    row.querySelector('button:nth-child(2)').remove(); // Remove the Cancel button
    row.querySelector('button').innerText = 'Edit'; // Reset the Edit button text

    // Send updated data to the server
    saveEmployeeData(empId, nameInput.value, typeSelect.value);
}

function cancelEdit(rowIndex) {
    var table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    var row = table.rows[rowIndex];

    // Revert changes and toggle back to display mode
    toggleEditMode(row, false, row.cells[1].querySelector('input').defaultValue, row.cells[2].getAttribute('data-original-type'));
    row.querySelector('button:nth-child(2)').remove(); // Remove the Cancel button
    row.querySelector('button').innerText = 'Edit'; // Reset the Edit button text
}

function toggleEditMode(row, isEditMode, name = '', type = '') {
    if (isEditMode) {
        row.cells[1].innerHTML = `<input type="text" name="EmpName" value="${row.cells[1].innerText}" />`;
        row.cells[2].setAttribute('data-original-type', row.cells[2].innerText); // Store original type
        row.cells[2].innerHTML = createEmpTypeDropdown(row.cells[2].innerText);
    } else {
        row.cells[1].innerHTML = name;
        row.cells[2].innerHTML = type;
    }
}

function saveEmployeeData(empId, name, type) {
    fetch('/api/updateEmployee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ EmpId: empId, EmpName: name, EmpType: type }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Employee updated successfully');
            } else {
                alert('Error updating employee');
            }
        })
        .catch(error => console.error('Error:', error));
}


function createEmpTypeDropdown(selectedType) {
    const types = ['courier', 'office worker'];
    let dropdownHTML = `<select name="EmpType">`;

    types.forEach(type => {
        dropdownHTML += `<option value="${type}" ${selectedType === type ? 'selected' : ''}>${type}</option>`;
    });

    dropdownHTML += `</select>`;
    return dropdownHTML;
}

function deleteEmployee(empId) {
    fetch('/api/deleteEmployee', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ empId: empId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Employee deleted successfully.');
            fetchEmployees();
        } else {
            alert('Error deleting employee: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the employee.');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchEmployees();
});