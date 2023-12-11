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
                window.location.href = '/authentication.html'; // Redirect to login page after logout
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

    employees.forEach(employee => {
        let row = table.insertRow();

        let cellId = row.insertCell();
        cellId.textContent = employee.EmpId;

        let cellName = row.insertCell();
        cellName.textContent = employee.EmpName;

        let cellType = row.insertCell();
        cellType.textContent = employee.EmpType;

        let actionsCell = row.insertCell();
        // You can add buttons or links for edit and delete here
        actionsCell.innerHTML = '<button onclick="editEmployee(' + employee.EmpId + ')">Edit</button> <button onclick="deleteEmployee(' + employee.EmpId + ')">Delete</button>';
    });
}

function editEmployee(empId) {
    // Implementation for editing an employee
}

function deleteEmployee(empId) {
    // Implementation for deleting an employee
}
