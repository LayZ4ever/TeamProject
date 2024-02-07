document.addEventListener('DOMContentLoaded', function () {
    fetchCustomerParcels();
});

function fetchCustomerParcels() {
    fetch('/customerParcels')
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
        containerDiv.classList.add("container-parcel");

        let infoRow = document.createElement("div");
        infoRow.classList.add("info-row");
        infoRow.appendChild(createParagraph("Parcel: " + parcel.ParcelsId));
        infoRow.appendChild(createParagraph("Employee: " + parcel.EmployeeName));
        
        let buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('button-container');

        infoRow.appendChild(buttonsContainer);
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
        parcelDiv.appendChild(createParagraph("Payment: " + parcel.PaidOn)); 
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

// for the sorting
function fetchSortedCustomerParcels(sortingAttribute) {
    url = `sortedCustomerParcels?sortingAttribute=${sortingAttribute}`;
    fetch(url)
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

document.getElementById('sortButton').addEventListener('click', function () {
    const selectedAttribute = document.getElementById('parcelsAttribute').value;
    fetchSortedCustomerParcels(selectedAttribute);
});