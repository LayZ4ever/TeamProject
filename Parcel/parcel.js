window.onload = function() {
    fetch('/api/customerName')
    .then(response => {
        if (!response.ok) {
            throw new Error('Not logged in');
        }
        return response.json();
    })
    .then(data => {
        if (data.custName) {
            document.getElementById('customerName').value = data.custName;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Redirect to login page
        window.location.href = '/autentication.html';
    });
};

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
                const grIndex = cityInfo.indexOf('gr. ');
                const commaIndex = cityInfo.indexOf(',');
                if (grIndex !== -1 && commaIndex !== -1) {
                    const cityName = cityInfo.substring(grIndex + 4, commaIndex);
                    const option = document.createElement('option');
                    option.value = cityName;
                    option.text = cityName;
                    cityListElement.appendChild(option);
                }
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const dataForm = document.getElementById('dataForm');
    const resultDisplay = document.getElementById('result');

    dataForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const isOfficeDelivery = formData.get('deliveryMethod') === 'office';
        const deliveryType = isOfficeDelivery ? 1 : 2; // 1 for office, 2 for address

        const weight = formData.get('weight');
        const price = (parseFloat(weight) * 0.50 + deliveryType).toFixed(2);
        const deliveryAddress = isOfficeDelivery ? formData.get('office') : `${formData.get('addressCity')} ${formData.get('deliveryAddress')}`;

        const submissionData = {
            senderId,
            receiverId,
            officeOrAddress: deliveryType,
            senderAddress: formData.get('senderCity'),
            deliveryAddress: deliveryAddress,
            weight: weight,
            price: price
        };

        fetch('/api/insertData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData),
        })
            .then(response => response.json())
            .then(data => {
                resultDisplay.textContent = data.message;
            })
            .catch(error => {
                console.error('Error:', error);
                resultDisplay.textContent = 'Error inserting data';
            });
    });
});


