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



function calculatePrice(){
    const isOfficeDelivery = document.getElementById('deliveryMethodOffice').checked;
    const deliveryTypePrice = isOfficeDelivery ? 1 : 5; // 1 for office, 2 for address
    const price = (parseFloat(document.getElementById('weight').value) * 0.50 + deliveryTypePrice).toFixed(2);

    document.getElementById('price').value = price;
}

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
    const statusFormData = new FormData(document.getElementById('StatusForm'));

    const isOfficeDelivery = deliveryFormData.get('deliveryMethod') === 'office';
    const isCustomerAddress = deliveryFormData.get('deliveryMethod') === 'savedAddress';
    const deliveryTypePrice = isOfficeDelivery ? 1 : 5; // 1 for office, 5 for address

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

    const weight = deliveryFormData.get('weight');
    const price = deliveryFormData.get('price');
    const dispatchDate = deliveryFormData.get('dispatchDate');
    console.log("dispatchDate:" + dispatchDate);
    const receiptDate = deliveryFormData.get('receiptDate');
    console.log("receiptDate:" + receiptDate);
    const statusId = statusFormData.get('status');
    const changeStatusDate = statusFormData.get('changeStatusDate');
    const empId = await getEmpIdFromSession();
    const paidOn = statusFormData.get('payDate');


    const parcelData = {
        SenderId: senderId,
        ReceiverId: receiverId,
        officeOrAddress: deliveryTypePrice,
        senderAddress: `${senderFormData.get('city')}, ${senderFormData.get('address')}`,
        receiverAddress: isCustomerAddress ? `${receiverFormData.get('city')} ${receiverFormData.get('address')}` : (isOfficeDelivery ? deliveryFormData.get('office') : `${deliveryFormData.get('addressCity')} ${deliveryFormData.get('deliveryAddress')}`),
        Weight: weight,
        Price: (parseFloat(deliveryFormData.get('weight')) * 0.50 + deliveryTypePrice).toFixed(2),
        // Price: (parseFloat(deliveryFormData.get('weight')) * price + deliveryTypePrice).toFixed(2), 
        DispatchDate: dispatchDate ? dispatchDate : null,
        ReceiptDate: receiptDate ? receiptDate : null,
        StatusId: statusId ? statusId : 1,
        StatusDate: changeStatusDate ? changeStatusDate : new Date().toISOString().split("T")[0], //this is current date
        EmpId: empId,
        PaidOn: paidOn ? paidOn : null,
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


//Function that sets required to a certain class and removes it from others
function requiredONLYForClass(elementClass, ...otherClasses) {

    //remove required
    for (const otherclass of otherClasses) {
        const otherElements = document.querySelectorAll('.' + otherclass);

        for (const otherElement of otherElements) {
            otherElement.setAttribute('disabled', '');
            otherElement.removeAttribute('required');
        }
    }
    if (elementClass !== '') {
        const selectedElements = document.querySelectorAll('.' + elementClass);
        for (const selectedElement of selectedElements) {

            selectedElement.removeAttribute('disabled');
            selectedElement.setAttribute('required', '');
        }
    }
}

async function getEmpIdFromSession() {
    const res = await fetch('/api/getEmpIdAndName').then(response => response.json());
    return res.empId;
}

async function getEmpNameFromSession() {
    const res = await fetch('/api/getEmpIdAndName').then(response => response.json());
    return res.empName;
}

async function fillEmpValue() {
    let empName = await getEmpNameFromSession();
    console.log(empName);
    const empEmt = document.getElementById("employee");
    empEmt.value = empName;
}

//get parcelId from the url - edit parcel status, if null - new parcel
function getParcelId() {
    const urlParams = new URLSearchParams(window.location.search);
    const parcelId = urlParams.get('parcelId');
    if (parcelId != null) {
        //edit parcel mode
        //fill forms - Sender, Receiver, Delivery NOT Status
        //get Sender info from parcelId

        //get Receiver info from parcelId

        //get Delivery info from parcelId (change Price to FinalPrice)





        //make them read-only


    }
}

window.addEventListener("load", fillEmpValue);
// window.addEventListener("load", conSL);

// document.addEventListener("DOMContentLoaded", async () => {});