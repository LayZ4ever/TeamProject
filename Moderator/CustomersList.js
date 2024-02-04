function fetchCustomers() {
    fetch('/customers')
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    fetchCustomers();
});



function populateTable(customers) {
    const table = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    customers.forEach((customer, index) => {
        let row = table.insertRow();
        // Add cells and set their content
        row.insertCell(0).innerHTML = customer.CustId;
        row.insertCell(1).innerHTML = customer.CustName;
        row.insertCell(2).innerHTML = customer.PhoneNumber;
        row.insertCell(3).innerHTML = customer.Address;
    
        // Добавяне на класове за четни и нечетни редове
        row.classList.add(index % 2 === 0 ? 'table-row-even' : 'table-row-odd');
    
        // Create a container for the buttons
        let buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('button-container'); // Добавяне на нов клас за контейнера
    
        let editButton = document.createElement('button');
        editButton.classList.add('action-save'); // Добавяне на нов клас за бутона "Edit"
        editButton.textContent = 'Edit'; 
        editButton.addEventListener('click', function() {
            editCustomer(index);
        });
        buttonsContainer.appendChild(editButton);
    
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('action-delete'); // Същият клас като за "Edit"
        deleteButton.classList.add('cancel-button'); // Добавяне на нов клас за бутона "Cancel"
        deleteButton.textContent = 'Delete'; 
        deleteButton.addEventListener('click', function() {
            deleteCustomer(customer.CustId);
        });
        buttonsContainer.appendChild(deleteButton);
    
        row.insertCell(4).appendChild(buttonsContainer);
    });
}

/**
 * When the 'Add' button in CustomerList.html is pressed, this function is called.
 * It creates a new row for the new customer record, along with a 'Save' and 'Cancel' buttons.
 */
function addNewCustomer() {
    const table = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();

    newRow.insertCell(0).innerText = 'New';
    newRow.insertCell(1).innerHTML = `<input type="text" name="CustName" />`;
    newRow.insertCell(2).innerHTML = `<input type="text" name="PhoneNumber" />`;
    newRow.insertCell(3).innerHTML = `<input type="text" name="Address" />`;
 
    // Create a container for the buttons
    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('button-container');

    let saveButton = document.createElement('button');
    saveButton.classList.add('action-save');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', function() {
        saveNewCustomer(this); // Подаваме бутона като аргумент
    });
    buttonsContainer.appendChild(saveButton);

    let cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        cancelNewCustomer(this);
    });
    buttonsContainer.appendChild(cancelButton);

    newRow.insertCell(4).appendChild(buttonsContainer);
}

/**
 * Saves the new customer info into the base and reloads the page with the updated data.
 * @param {*} save the 'Save' button.
 */
function saveNewCustomer(button) {
    //var row = button.parentNode.parentNode;
    var row = button.closest('tr'); 
    var nameInput = row.cells[1].querySelector('input').value;
    var phoneInput = row.cells[2].querySelector('input').value;
    var addressInput = row.cells[3].querySelector('input').value;

    fetch('/api/addCustomer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            CustName: nameInput,
            PhoneNumber: phoneInput,
            Address: addressInput
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Customer added successfully. Username: ' + data.newUsername);
                row.remove();
                fetchCustomers();
            } else {
                alert('Error adding customer: ' + (data.message || ''));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding customer');
        });
}

function cancelNewCustomer(button) {

    var row = button.closest('tr');
    row.remove(); 
}

function editCustomer(rowIndex) {
    var table = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
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

/**
 * Toggles between edit mode and display mode for a given table row (<tr>).
 * @param {*} row The row that is being toggled
 * @param {*} isEditMode isEditMode ? edit mode : display mode
 * @param {*} name the name of the customer  
 * @param {*} number the customer number
 * @param {*} address the customer address
 */
function toggleEditMode(row, isEditMode, name = '', number = '', address = '') {
    if (isEditMode) {
        row.cells[1].innerHTML = `<input type="text" name="CustName" value="${row.cells[1].innerText}" />`;
        row.cells[2].innerHTML = `<input type="text" name="PhoneNumber" value="${row.cells[2].innerText}" />`;
        row.cells[3].innerHTML = `<input type="text" name="Address" value="${row.cells[3].innerText}" />`;
    } else {
        row.cells[1].innerHTML = name;
        row.cells[2].innerHTML = number;
        row.cells[3].innerHTML = address;
    }
}

function cancelEdit(rowIndex) {
    var table = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
    var row = table.rows[rowIndex];

    // Revert changes and toggle back to display mode
    toggleEditMode(row, false, row.cells[1].querySelector('input').defaultValue, row.cells[2].querySelector('input').defaultValue, row.cells[3].querySelector('input').defaultValue);
    row.querySelector('button:nth-child(2)').remove(); // Remove the Cancel button
    row.querySelector('button').innerText = 'Edit'; // Reset the Edit button text
}

function handleSave(row, rowIndex) {
    var custId = row.cells[0].innerText;
    var nameInput = row.cells[1].querySelector('input');
    var phoneInput = row.cells[2].querySelector('input');
    var addressInput = row.cells[3].querySelector('input');


    toggleEditMode(row, false, nameInput.value, phoneInput.value, addressInput.value);
    row.querySelector('button:nth-child(2)').remove(); // Remove the Cancel button
    row.querySelector('button').innerText = 'Edit'; // Reset the Edit button text

    // Send updated data to the server
    saveCustomerData(custId, nameInput.value, phoneInput.value, addressInput.value); 
}

function saveCustomerData(custId, name, number, address) {
    fetch('/api/updateCustomer', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CustId: custId, CustName: name, PhoneNumber: number, Address: address }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Customer updated successfully');
            } else {
                alert('Error updating customer');
            }
        })
        .catch(error => console.error('Error:', error));
}



function deleteCustomer(custId) {
    fetch('/api/deleteCustomer', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ custId: custId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Customer deleted successfully.');
                fetchCustomers();
            } else {
                alert('Error deleting customer: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the customer.');
        });
}

document.getElementById('sortButton').addEventListener('click', function () {
    const selectedAttribute = document.getElementById('customerAttribute').value;
    fetchSortedCustomers(selectedAttribute);
});

function fetchSortedCustomers(sortingAttribute) {
    // sortingAttribute is appended to the URL as a query parameter so that it can be acceseed in the sortedCustomers api
    url = `/sortedCustomers?sortingAttribute=${sortingAttribute}`;
    fetch(url)
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

function exitCustomer() {
    window.location.href = "Moderator.html";
  }