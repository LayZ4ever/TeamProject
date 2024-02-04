function fetchOffices() {
    fetch('/offices')
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    fetchOffices();
});

function populateTable(offices) {
    const table = document.getElementById('officeTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    offices.forEach((office, index) => {
        let row = table.insertRow();
        // Add cells and set their content
        row.insertCell(0).innerHTML = office.OfficeId;
        row.insertCell(1).innerHTML = office.OfficeName;
        row.insertCell(2).innerHTML = office.OfficeAddress;
    
        // Добавяне на класове за четни и нечетни редове
        row.classList.add(index % 2 === 0 ? 'table-row-even' : 'table-row-odd');
    
        // Create a container for the buttons
        let buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('button-container'); // Добавяне на нов клас за контейнера
    
        let editButton = document.createElement('button');
        editButton.classList.add('action-save'); // Добавяне на нов клас за бутона "Edit"
        editButton.textContent = 'Edit'; 
        editButton.addEventListener('click', function() {
            editOffice(index);
        });
        buttonsContainer.appendChild(editButton);
    
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('action-delete'); // Същият клас като за "Edit"
        deleteButton.classList.add('cancel-button'); // Добавяне на нов клас за бутона "Cancel"
        deleteButton.textContent = 'Delete'; 
        deleteButton.addEventListener('click', function() {
            deleteOffice(office.OfficeId);
        });
        buttonsContainer.appendChild(deleteButton);
    
        row.insertCell(3).appendChild(buttonsContainer);
    });
}


/**
 * When the 'Add' button in OfficeList.html is pressed, this function is called.
 * It creates a new row for the new office record, along with a 'Save' and 'Cancel' buttons.
 */
function addNewOffice() {
    const table = document.getElementById('officeTable').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();

    newRow.insertCell(0).innerText = 'New';
    newRow.insertCell(1).innerHTML = `<input type="text" name="OfficeName" />`;
    newRow.insertCell(2).innerHTML = `<input type="text" name="OfficeAddress" />`;
 
    // Create a container for the buttons
    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('button-container');

    let saveButton = document.createElement('button');
    saveButton.classList.add('action-save');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', function() {
        saveNewOffice(this); // Подаваме бутона като аргумент
    });
    buttonsContainer.appendChild(saveButton);

    let cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        cancelNewOffice(this);
    });
    buttonsContainer.appendChild(cancelButton);

    newRow.insertCell(3).appendChild(buttonsContainer);
}

/**
 * Saves the new office info into the base and reloads the page with the updated data.
 * @param {*} save the 'Save' button.
 */
function saveNewOffice(button) {
    //var row = button.parentNode.parentNode;
    var row = button.closest('tr'); 
    var nameInput = row.cells[1].querySelector('input').value;
    var addressInput = row.cells[2].querySelector('input').value;

    fetch('/api/addOffice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            OfficeName: nameInput,
            OfficeAddress: addressInput
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Office added successfully.');
                row.remove();
                fetchOffices();
            } else {
                alert('Error adding office: ' + (data.message || ''));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding office');
        });
}

function cancelNewOffice(button) {

    var row = button.closest('tr');
    row.remove(); 
}

function editOffice(rowIndex) {
    var table = document.getElementById('officeTable').getElementsByTagName('tbody')[0];
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
 * @param {*} name the name of the office  
 * @param {*} address the office address
 */
function toggleEditMode(row, isEditMode, name = '', address = '') {
    if (isEditMode) {
        row.cells[1].innerHTML = `<input type="text" name="OfficeName" value="${row.cells[1].innerText}" />`;
        row.cells[2].innerHTML = `<input type="text" name="OfficeAddress" value="${row.cells[2].innerText}" />`;
    } else {
        row.cells[1].innerHTML = name;
        row.cells[2].innerHTML = address;
    }
}


function cancelEdit(rowIndex) {
    var table = document.getElementById('officeTable').getElementsByTagName('tbody')[0];
    var row = table.rows[rowIndex];

    // Revert changes and toggle back to display mode
    toggleEditMode(row, false, row.cells[1].querySelector('input').defaultValue, row.cells[2].querySelector('input').defaultValue);
    row.querySelector('button:nth-child(2)').remove(); // Remove the Cancel button
    row.querySelector('button').innerText = 'Edit'; // Reset the Edit button text
}



function handleSave(row, rowIndex) {
    var custId = row.cells[0].innerText;
    var nameInput = row.cells[1].querySelector('input');
    var addressInput = row.cells[2].querySelector('input');


    toggleEditMode(row, false, nameInput.value, addressInput.value);
    row.querySelector('button:nth-child(2)').remove(); // Remove the Cancel button
    row.querySelector('button').innerText = 'Edit'; // Reset the Edit button text

    // Send updated data to the server
    saveOfficeData(custId, nameInput.value, addressInput.value); 
}



function saveOfficeData(custId, name, address) {
    fetch('/api/updateOffice', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ OfficeId: custId, OfficeName: name, OfficeAddress: address }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Office updated successfully');
            } else {
                alert('Error updating office');
            }
        })
        .catch(error => console.error('Error:', error));
}


function deleteOffice(officeId) {
    fetch('/api/deleteOffice', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ officeId: officeId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Office deleted successfully.');
                fetchOffices();
            } else {
                alert('Error deleting office: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the office.');
        });
}

document.getElementById('sortButton').addEventListener('click', function () {
    const selectedAttribute = document.getElementById('officeAttribute').value;
    fetchSortedOffices(selectedAttribute);
});

function fetchSortedOffices(sortingAttribute) {
    // sortingAttribute is appended to the URL as a query parameter so that it can be acceseed in the sortedOffices api
    url = `/sortedOffices?sortingAttribute=${sortingAttribute}`;
    fetch(url)
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

function exitOffice() {
    window.location.href = "Moderator.html";
  }