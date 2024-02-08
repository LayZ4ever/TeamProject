document.addEventListener('DOMContentLoaded', function () {
    fetchParcels();
});

function fetchTotalPaidSum() {
    fetch('/api/getTotalPaidSum')
        .then(response => response.json())
        .then(data => {
            const paidSumElement = document.getElementById('paidSum');
            paidSumElement.innerHTML = data.totalPaidSum;
        })
        .catch(error => console.error('Error fetching total paid sum:', error));

}
function fetchTotalUnpaidSum() {
    fetch('/api/getTotalUnpaidSum')
        .then(response => response.json())
        .then(data => {
            const paidSumElement = document.getElementById('unpaidSum');
            paidSumElement.innerHTML = data.totalUnpaidSum;
        })
        .catch(error => console.error('Error fetching total paid sum:', error));
}


function fetchParcels() {
    fetchTotalPaidSum();
    fetchTotalUnpaidSum();
    fetch('/parcels')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));

}

function populateTable(parcels) {
    const container = document.getElementById('parcels');
    container.innerHTML = '';

    parcels.forEach((parcel, index) => {
        let containerDiv = document.createElement("div");
        containerDiv.classList.add("container-parcel");

        let infoRow = document.createElement("div");
        infoRow.classList.add("info-row");
        infoRow.appendChild(createParagraph("Parcel: " + parcel.ParcelsId));
        infoRow.appendChild(createParagraph("Employee: " + parcel.EmployeeName));

        // Sender details
        let senderDiv = document.createElement("div");
        senderDiv.classList.add("sender-info");
        senderDiv.appendChild(createParagraph("Sender: "));
        senderDiv.appendChild(createParagraph(parcel.SenderName));
        senderDiv.appendChild(createParagraph(parcel.SenderAddress));
        containerDiv.appendChild(senderDiv);

        // Receiver details
        let receiverDiv = document.createElement("div");
        receiverDiv.classList.add("receiver-info");
        receiverDiv.appendChild(createParagraph("Receiver: "));
        receiverDiv.appendChild(createParagraph(parcel.ReceiverName));
        receiverDiv.appendChild(createParagraph(parcel.ReceiverAddress));
        containerDiv.appendChild(receiverDiv);

        // Parcel details
        let parcelDiv = document.createElement("div");
        parcelDiv.classList.add("parcel-info");
        parcelDiv.appendChild(createParagraph("Weight: " + parcel.Weight));
        parcelDiv.appendChild(createParagraph("Price: " + parcel.Price));
        parcelDiv.appendChild(createParagraph("Payment: " + parcel.PaidOn));
        parcelDiv.appendChild(createParagraph("Send to: " + (parcel.OfficeOrAddress ? "Office" : "Address")));

        containerDiv.appendChild(parcelDiv);

        let parcelDiv1 = document.createElement("div");
        parcelDiv1.classList.add("parcel1-info");
        parcelDiv1.appendChild(createParagraph("Dispatch Date: " + (parcel.DispatchDate === null ? null : new Date(parcel.DispatchDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }))));
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

//dropdown за филтриране на служител
function loadEmployeeList() {
    const inputElement = document.getElementById('employeeInput');
    const employeeListElement = document.getElementById('employeeList');
    const searchText = inputElement.value;

    // Clear previous options
    employeeListElement.innerHTML = '';

    if (searchText.length === 0) return; // Optional: only search if input is not empty

    fetch(`/searchEmployees?query=${encodeURIComponent(searchText)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(employeeName => {
                const option = document.createElement('option');
                option.value = employeeName;
                employeeListElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching employee list:', error);
        });
}

document.getElementById('filterParcelsButton').addEventListener('click', function () {
    const employeeInputValue = document.getElementById('employeeInput').value.trim();
    const parcelIdValue = document.getElementById('parcelIdInput').value.trim();
    const senderIdValue = document.getElementById('senderIdInput').value.trim();
    const receiverIdValue = document.getElementById('receiverIdInput').value.trim();
    const startDateValue = document.getElementById('startDateInput').value;
    const endDateValue = document.getElementById('endDateInput').value;

    // Construct the URL with query parameters
    const url = new URL('/parcelsFilter', window.location.origin);

    // Add employeeId query parameter if employee input is not empty and matches the expected format
    const employeeIdMatch = employeeInputValue.match(/\(ID:\s*(\d+)\)/);
    if (employeeIdMatch) {
        const employeeId = employeeIdMatch[1];
        url.searchParams.append('employeeId', employeeId);
    }

    // Add other query parameters if their respective inputs are not empty
    if (parcelIdValue) url.searchParams.append('parcelId', parcelIdValue);
    if (senderIdValue) url.searchParams.append('senderId', senderIdValue);
    if (receiverIdValue) url.searchParams.append('receiverId', receiverIdValue);
    if (startDateValue) url.searchParams.append('startDate', startDateValue);
    if (endDateValue) url.searchParams.append('endDate', endDateValue);


    // Fetch parcels with the specified filters
    fetch(url)
        .then(response => response.json())
        .then(data => {
            populateTable(data); // Populate table with the filtered data
        })
        .catch(error => console.error('Error fetching filtered parcels:', error));
});

document.getElementById('clearInputsButton').addEventListener('click', function () {
    // Clear text and date inputs
    document.getElementById('parcelIdInput').value = '';
    document.getElementById('employeeInput').value = '';
    document.getElementById('senderIdInput').value = '';
    document.getElementById('receiverIdInput').value = '';
    document.getElementById('startDateInput').value = '';
    document.getElementById('endDateInput').value = '';

    // If you want to reset any <datalist> or other elements, add the code here
});

