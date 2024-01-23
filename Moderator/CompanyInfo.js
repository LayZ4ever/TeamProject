// -------------------   --------- to be looked into ---------   -------------------

document.addEventListener('DOMContentLoaded', function () {
    fetchCompany();
});

function fetchCompany() {
    fetch('/firm')
        .then(response => response.json())
        .then(data => populateCompanyInfo(data))
        .catch(error => console.error('Error fetching data:', error));
}

function populateCompanyInfo(data) {
    const companyNameElement = document.getElementById('companyName');
    const firmAddressElement = document.getElementById('firmAddress');

    if (data && data.length > 0) {
        const companyData = data[0];
        companyNameElement.textContent = `Company name: ${companyData.FirmName}`;
        firmAddressElement.textContent = `Firm address: ${companyData.FirmAddress}`;
    } else {
        // Handle case where no firm data is found
        companyNameElement.textContent = 'Company name: Not available';
        firmAddressElement.textContent = 'Firm address: Not available';
    }
}

