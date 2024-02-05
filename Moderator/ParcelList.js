document.addEventListener('DOMContentLoaded', function () {
    fetchParcels();
});

function fetchParcels() {
    fetch('/parcels')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            populateTable(data);})
        .catch(error => console.error('Error fetching data:', error));
}

function populateTable(parcels) {
    const table = document.getElementById('parcels').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    parcels.forEach((parcels, index) => {
        //console.log(parcels);
        let row = table.insertRow();
        // Add cells and set their content
        row.insertCell(0).innerHTML = parcels.ParcelsId;
        row.insertCell(1).innerHTML = parcels.SenderName;
        row.insertCell(2).innerHTML = parcels.ReceiverName;
        row.insertCell(3).innerHTML = parcels.OfficeOrAddress ? "Office": "Adress";
        row.insertCell(4).innerHTML = parcels.SenderAddress;
        row.insertCell(5).innerHTML = parcels.ReceiverAddress;
        row.insertCell(6).innerHTML = parcels.Weight;
        row.insertCell(7).innerHTML = parcels.Price;
        row.insertCell(8).innerHTML = parcels.DispachDate === null ? null : new Date(parcels.DispachDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        row.insertCell(9).innerHTML = parcels.ReceiptDate === null ? null : new Date(parcels.ReceiptDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        row.insertCell(10).innerHTML = parcels.StatusName;
        row.insertCell(11).innerHTML = parcels.StatusDate === null ? null : new Date(parcels.StatusDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        row.insertCell(12).innerHTML = parcels.EmployeeName.split(' ').slice(0, 2).map((name, index) => index === 2 ? name : name[0]).join('') + parcels.EmployeeName.split(' ')[2];
        row.insertCell(13).innerHTML = parcels.PaymentStatus;
        row.insertCell(14).innerHTML = `<button>Edit</button><button>Cancel</button>`;
    });
}

//----------------------------------------------------------------------------
function loadCityList() {
    const cityListElement = document.getElementById('cityList');

    // Check if the city list has already been loaded
    if (cityListElement.children.length > 0) return;

    fetch('citylist.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('City data loaded:', data);
            data.forEach(cityInfo => {
                const option = document.createElement('option');
                option.value = cityInfo;
                option.text = cityInfo;
                cityListElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching city list:', error);
        });
}

// Search for customer and autofill the form
function searchCustomer(phoneInputId, formId, submitButtonId) {
    const phoneInput = document.getElementById(phoneInputId);
    const submitButton = document.getElementById(submitButtonId);
    let customerSelected = false; // Flag to track if a customer has been selected

    phoneInput.addEventListener('input', function () {
        if (this.value.length === 10) {
            fetch(`/api/search-customer?phoneNumber=${this.value}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fillForm(formId, data.customer);
                        customerSelected = true;
                    } else {
                        submitButton.style.display = 'block';
                        customerSelected = false;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    customerSelected = false;
                });
        } else if (customerSelected) {
            clearForm(formId);
            customerSelected = false;
        }
    });
}

function checkFormsCompletion() {
    let senderFormFilled = checkFormFilled('SenderForm');
    let receiverFormFilled = checkFormFilled('ReceiverForm');

    toggleSubmitButton(senderFormFilled && receiverFormFilled);
}

function checkFormFilled(formId) {
    const form = document.getElementById(formId);
    return Array.from(form.elements).every(input => input.value.trim() !== '');
}

function toggleSubmitButton(show) {
    const submitButton = document.getElementById('submitAllForms');
    submitButton.style.display = show ? 'block' : 'none';
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    form.reset();
    form.elements['firstName'].readOnly = false;
    form.elements['lastName'].readOnly = false;
    form.elements['city'].readOnly = false;
    form.elements['address'].readOnly = false;
    checkFormsCompletion()
}

function fillForm(formId, customerData) {
    const form = document.getElementById(formId);
    let allFieldsFilled = true;

    // Split full name into first and last names
    const fullName = customerData.CustName.split(' ');
    form.elements['firstName'].value = fullName[0];
    form.elements['lastName'].value = fullName[1];
    form.elements['firstName'].readOnly = true;
    form.elements['lastName'].readOnly = true;

    // Split the combined city and address
    if (customerData.Address) {
        // Splitting the address at ") ", assuming the format "gr. CityName (PostCode) Address"
        const addressParts = customerData.Address.split(') ');
        const city = addressParts[0] + ')';
        const address = addressParts[1];

        form.elements['city'].value = city;
        form.elements['address'].value = address;
        form.elements['city'].readOnly = true;
        form.elements['address'].readOnly = true;
    } else {
        form.elements['city'].readOnly = false;
        form.elements['address'].readOnly = false;
        allFieldsFilled = false;
    }

    // Enable the submit button if not all fields are filled
    const submitButtonId = formId === 'SenderForm' ? 'senderSubmit' : 'receiverSubmit';
    const submitButton = document.getElementById(submitButtonId);

    if (allFieldsFilled) {
        // If all fields are filled, hide the submit button
        submitButton.style.display = 'none';
    } else {
        // If not all fields are filled, show the submit button
        submitButton.style.display = 'block';
    }
    checkFormsCompletion()
}

function fetchSortedParcels(sortingAttribute) {
    url = `/sortedParcels?sortingAttribute=${sortingAttribute}`;
    fetch(url)
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

document.getElementById('sortButton').addEventListener('click', function () {
    const selectedAttribute = document.getElementById('parcelsAttribute').value;
    fetchSortedParcels(selectedAttribute);
});