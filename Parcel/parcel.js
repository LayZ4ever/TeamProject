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

function showSelection(selectionType) {
    var officeSelection = document.getElementById('officeSelection');
    var addressSelection = document.getElementById('addressSelection');

    if (selectionType === 'office') {
        officeSelection.style.display = 'block';
        addressSelection.style.display = 'none';
    } else if (selectionType === 'address') {
        officeSelection.style.display = 'none';
        addressSelection.style.display = 'block';
    } else {
        officeSelection.style.display = 'none';
        addressSelection.style.display = 'none';
    }
}

let customerSelected = false; // Flag to track if a customer has been selected

// Search for customer and autofill the form
function searchCustomer(phoneInputId, formId, submitButtonId) {
    const phoneInput = document.getElementById(phoneInputId);
    const submitButton = document.getElementById(submitButtonId);

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

// Generalized form submission handler
function handleFormSubmission(formId, apiUrl) {
    checkFormsCompletion()
    document.getElementById(formId).addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);

        // Make sure these names match the 'name' attributes in your form inputs
        const fullName = `${formData.get('firstName')} ${formData.get('lastName')}`.trim();
        const fullAddress = `${formData.get('city')} ${formData.get('address')}`.trim();

        // Prepare the data to be sent
        const dataToSend = {
            CustName: fullName,
            PhoneNumber: formData.get('phoneNumber'),
            Address: fullAddress
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                checkFormsCompletion();
            })
            .catch(error => {
                console.error('Error:', error);
            });

        if (formId === 'SenderForm') {
            document.getElementById('senderSubmit').style.display = 'none';
        } else {
            document.getElementById('receiverSubmit').style.display = 'none';
        }
    });
}

async function handleParcelFormSubmission(event) {
    event.preventDefault();

    // Collect data from SenderForm, ReceiverForm, and DeliveryForm
    const senderFormData = new FormData(document.getElementById('SenderForm'));
    const receiverFormData = new FormData(document.getElementById('ReceiverForm'));
    const deliveryFormData = new FormData(document.getElementById('DeliveryForm'));

    const isOfficeDelivery = deliveryFormData.get('deliveryMethod') === 'office';
    const isCustomerAddress = deliveryFormData.get('deliveryMethod') === 'savedAddress';
    const deliveryType = isOfficeDelivery ? 1 : 2; // 1 for office, 2 for address

    // Retrieve phone numbers from sender and receiver form data
    const senderPhone = senderFormData.get('phoneNumber');
    const receiverPhone = receiverFormData.get('phoneNumber');

    // Fetch SenderId and ReceiverId using the phone numbers
    const senderResponse = await fetch(`/api/getCustomerId?phone=${senderPhone}`);
    const senderData = await senderResponse.json();
    const senderId = senderData.customerId;

    const receiverResponse = await fetch(`/api/getCustomerId?phone=${receiverPhone}`);
    const receiverData = await receiverResponse.json();
    const receiverId = receiverData.customerId;


    const parcelData = {
        SenderId: senderId,
        ReceiverId: receiverId,
        officeOrAddress: deliveryType,
        senderAddress: `${senderFormData.get('city')}, ${senderFormData.get('address')}`,
        receiverAddress: isCustomerAddress ? `${receiverFormData.get('city')} ${receiverFormData.get('address')}` : (isOfficeDelivery ? deliveryFormData.get('office') : `${deliveryFormData.get('addressCity')} ${deliveryFormData.get('deliveryAddress')}`),
        Weight: deliveryFormData.get('weight'),
        Price: (parseFloat(deliveryFormData.get('weight')) * 0.50 + deliveryType).toFixed(2),
    };

    fetch('/api/insertData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parcelData),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').textContent = data.message;
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here
        });
}

// Event listener for form submission
document.getElementById('DeliveryForm').addEventListener('submit', handleParcelFormSubmission);
document.addEventListener('DOMContentLoaded', function () {
    searchCustomer('senderPhoneInput', 'SenderForm', 'senderSubmit');
    searchCustomer('receiverPhoneInput', 'ReceiverForm', 'receiverSubmit');
    handleFormSubmission('SenderForm', '/api/create-or-update-customer');
    handleFormSubmission('ReceiverForm', '/api/create-or-update-customer');
});
