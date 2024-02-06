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
    const container = document.getElementById('parcels');
    container.innerHTML = ''; 

    parcels.forEach((parcel, index) => {
        let containerDiv = document.createElement("div");
        containerDiv.classList.add("yourClassName");

        let infoRow = document.createElement("div");
        infoRow.classList.add("info-row");
        infoRow.appendChild(createParagraph("Parcel: " + parcel.ParcelsId));
        infoRow.appendChild(createParagraph("Employee: " + parcel.EmployeeName));
        containerDiv.appendChild(infoRow);

        // Sender details
        let senderDiv = document.createElement("div");
        senderDiv.classList.add("sender-info");
        senderDiv.appendChild(createParagraph("Sender: " ));
        senderDiv.appendChild(createParagraph(parcel.SenderName));
        senderDiv.appendChild(createParagraph(parcel.SenderAddress));
        containerDiv.appendChild(senderDiv);

        // Receiver details
        let receiverDiv = document.createElement("div");
        receiverDiv.classList.add("receiver-info");
        receiverDiv.appendChild(createParagraph("Receiver: " ));
        receiverDiv.appendChild(createParagraph(parcel.ReceiverName));
        receiverDiv.appendChild(createParagraph(parcel.ReceiverAddress));
        containerDiv.appendChild(receiverDiv);
        
        // Parcel details
        let parcelDiv = document.createElement("div");
        parcelDiv.classList.add("parcel-info");
        parcelDiv.appendChild(createParagraph("Weight: " + parcel.Weight));
        parcelDiv.appendChild(createParagraph("Price: " + parcel.Price));
        parcelDiv.appendChild(createParagraph("Payment: " + parcel.PaymentStatus)); 
        parcelDiv.appendChild(createParagraph("Send to: " + (parcel.OfficeOrAddress ? "Office" : "Address")));
        
        containerDiv.appendChild(parcelDiv);   
        
        let parcelDiv1 = document.createElement("div");
        parcelDiv1.classList.add("parcel1-info");
        parcelDiv1.appendChild(createParagraph("Dispatch Date: " + (parcel.DispachDate === null ? null : new Date(parcel.DispachDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }))));
        parcelDiv1.appendChild(createParagraph("Receipt Date: " + (parcel.ReceiptDate === null ? null : new Date(parcel.ReceiptDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }))));
        parcelDiv1.appendChild(createParagraph("Status: " + parcel.StatusName + " " + (parcel.StatusDate === null ? null : new Date(parcel.StatusDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }))));
        containerDiv.appendChild(parcelDiv1);

        // Append the containerDiv to the main container
        container.appendChild(containerDiv);
    });
}

// Helper function to create a paragraph element
function createParagraph(content) {
    let paragraph = document.createElement("p");
    paragraph.innerHTML = content;
    return paragraph;
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