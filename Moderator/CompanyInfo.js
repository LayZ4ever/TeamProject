document.addEventListener('DOMContentLoaded', function () {
    fetchCompany();
});

function fetchCompany() {
    fetch('/firm')
        .then(response => response.json())
        .then(data => populateCompanyInfo(data))
        .catch(error => console.error('Error fetching data:', error));
}

// function populateCompanyInfo(data) {
//     const companyNameElement = document.getElementById('companyName');
//     const firmAddressElement = document.getElementById('firmAddress');

//     if (data && data.length > 0) {
//         const companyData = data[0];
//         companyNameElement.textContent = `Company name: ${companyData.FirmName}`;
//         firmAddressElement.textContent = `Firm address: ${companyData.FirmAddress}`;
//     } else {
//         // Handle case where no firm data is found
//         companyNameElement.textContent = 'Company name: Not available';
//         firmAddressElement.textContent = 'Firm address: Not available';
//     }
// }

// functions for editing

function populateCompanyInfo(data) {
    var companyNameElement = document.getElementById('companyName');
    var firmAddressElement = document.getElementById('firmAddress');
    var editCompanyNameInput = document.getElementById('editCompanyName');
    var editFirmAddressInput = document.getElementById('editFirmAddress');

    if (data && data.length > 0) {
        var companyData = data[0];
        companyNameElement.textContent = `Company name: ${companyData.FirmName}`;
        firmAddressElement.textContent = `Firm address: ${companyData.FirmAddress}`;
        editCompanyNameInput.value = companyData.FirmName;
        editFirmAddressInput.value = companyData.FirmAddress;
    } else {
        // Handle case where no firm data is found
        companyNameElement.textContent = 'Company name: Not available';
        firmAddressElement.textContent = 'Firm address: Not available';
    }
}

function enterEditMode() {
    // select the elements we want to manipulate
    var companyNameElement = document.getElementById('companyName');
    var firmAddressElement = document.getElementById('firmAddress');
    var editModeDiv = document.getElementById('editMode');

    // make display mode invisible
    companyNameElement.style.display = 'none';
    firmAddressElement.style.display = 'none';
    // make editMode visible
    editModeDiv.style.display = 'block';
}

function saveChanges() {
    var editCompanyNameInput = document.getElementById('editCompanyName').value;
    var editFirmAddressInput = document.getElementById('editFirmAddress').value;

    fetch('/firm/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            FirmName: editCompanyNameInput,
            FirmAddress: editFirmAddressInput,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Changes saved successfully.');
            exitEditMode();
            fetchCompany();
        } else {
            alert('Error saving changes: ' + (data.message || ''));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving changes.');
    });
}

function cancelEdit() {
    exitEditMode();
    fetchCompany();
}

function exitEditMode() {
    // hide editMode
    var companyNameElement = document.getElementById('editMode');
    companyNameElement.style.display = "none";
    // visualize data
    var companyNameElement = document.getElementById('companyName');
    var firmAddressElement = document.getElementById('firmAddress');
    companyNameElement.style.display = 'block';
    firmAddressElement.style.display = 'block';
}