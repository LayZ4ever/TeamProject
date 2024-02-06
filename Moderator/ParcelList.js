document.addEventListener('DOMContentLoaded', function () {
    fetchParcels();
});

function fetchParcels() {
    fetch('/parcels')
        .then(response => response.json())
        .then(data => {
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

        let editButton = document.createElement('button');
        editButton.classList.add('action-save');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function () {
            //TODO redirect to edit page
        });
        buttonsContainer.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('action-delete'); 
        deleteButton.classList.add('cancel-button'); 
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteParcel(parcel.ParcelsId);
        });
        buttonsContainer.appendChild(deleteButton);

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


function deleteParcel(parcelId) {
    fetch('/api/deleteParcel', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ parcelId: parcelId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Parcel deleted successfully.');
                fetchParcels();
            } else {
                alert('Error deleting parcel: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the parcel.');
        });
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

