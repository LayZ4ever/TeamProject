// document.getElementById('logoutButton').addEventListener('click', function () {
//     fetch('/api/logout', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 window.location.href = '/login.html'; // Redirect to login page after logout
//             } else {
//                 alert('Logout failed. Please try again.');
//             }
//         })
//         .catch(error => console.error('Error:', error));
// });

/**
 * Handles the response (employee data) from the database.
 */
function fetchEmployees() {
    fetch('/employees')
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}
/**
 * Adds the employee records sent from the database into the page (EmployeeList.html).
 * @param {*} employees the employees returned from the database.
 */
function populateTable(employees) {
    const table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    employees.forEach((employee, index) => {
        let row = table.insertRow();
        // Add cells and set their content
        row.insertCell(0).innerHTML = employee.EmpId;
        row.insertCell(1).innerHTML = employee.EmpName;
        row.insertCell(2).innerHTML = employee.EmpType;

        // Добавяне на класове за четни и нечетни редове
        row.classList.add(index % 2 === 0 ? 'table-row-even' : 'table-row-odd');

        // Create a container for the buttons
        let buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('button-container'); // Добавяне на нов клас за контейнера

        let editButton = document.createElement('button');
        editButton.classList.add('action-save'); // Добавяне на нов клас за бутона "Edit"
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function () {
            editEmployee(index);
        });
        buttonsContainer.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('action-delete'); // Същият клас като за "Edit"
        deleteButton.classList.add('cancel-button'); // Добавяне на нов клас за бутона "Cancel"
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteEmployee(employee.EmpId);
        });
        buttonsContainer.appendChild(deleteButton);

        row.insertCell(3).appendChild(buttonsContainer);
    });
}
/**
 * When the 'Add' button in EmployeeList.html is pressed, this function is called.
 * It creates a new row for the new employee record, along with a 'Save' and 'Cancel' buttons.
 */
function addNewEmployee() {
    const table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();

    newRow.insertCell(0).innerText = 'New';
    newRow.insertCell(1).innerHTML = `<input type="text" name="EmpName" />`;
    newRow.insertCell(2).innerHTML = createEmpTypeDropdown('');
    //   newRow.insertCell(3).innerHTML = `<button onclick="saveNewEmployee(this)">Save</button><button onclick="cancelNewEmployee(this)">Cancel</button>`;

    // Create a container for the buttons
    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('button-container');

    let saveButton = document.createElement('button');
    saveButton.classList.add('action-save');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', function () {
        saveNewEmployee(this); // Подаваме бутона като аргумент
    });
    buttonsContainer.appendChild(saveButton);

    let cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function () {
        cancelNewEmployee(this);
    });
    buttonsContainer.appendChild(cancelButton);

    newRow.insertCell(3).appendChild(buttonsContainer);
}
/**
 * Removes a row after pressing the cancel button.
 * @param {*} button the (cancel) button used to reach the row for removal.
 */
function cancelNewEmployee(button) {

    var row = button.closest('tr'); // returns the closest parent row of the button (tr) 
    row.remove(); // Remove the new row
}
/**
 * Saves the new employee info into the base and reloads the page with the updated data.
 * @param {*} save the 'Save' button.
 */
function saveNewEmployee(button) {
    //var row = button.parentNode.parentNode;
    var row = button.closest('tr');
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

        // Добавяне на бутона "Cancel" в същата колона със стил
        editButton.insertAdjacentHTML('afterend', `<button class="cancel-button" onclick="cancelEdit(${rowIndex})">Cancel</button>`);
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

/**
 * Toggles between edit mode and display mode for a given table row (<tr>).
 * @param {*} row The row that is being toggled
 * @param {*} isEditMode isEditMode ? edit mode : display mode
 * @param {*} name the name of the employee  
 * @param {*} type the employee type
 */
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

function fetchSortedEmployees(sortingAttribute) {
    // sortingAttribute is appended to the URL as a query parameter so that it can be acceseed in the sortedEmployees api
    url = `/sortedEmployees?sortingAttribute=${sortingAttribute}`;
    fetch(url)
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

document.getElementById('sortButton').addEventListener('click', function () {
    const selectedAttribute = document.getElementById('employeeAttribute').value;
    fetchSortedEmployees(selectedAttribute);
});

function exitEmployee() {
    window.location.href = "Moderator.html";
}