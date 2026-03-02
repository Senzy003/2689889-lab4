const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    if (!countryName) return;

    spinner.classList.remove('hidden');
    countryInfo.innerHTML = '';
    borderingCountries.innerHTML = '';
    errorMessage.classList.add('hidden');

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();


        const exactMatch = data.find(country =>
            country.name.common.toLowerCase() === countryName.toLowerCase()
        );

        const country = exactMatch || data[0]; 

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        if (country.borders && country.borders.length > 0) {
            const bordersResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`);
            const bordersData = await bordersResponse.json();

            borderingCountries.innerHTML = bordersData.map(border => `
                <div class="country-card">
                    <h3>${border.name.common}</h3>
                    <img src="${border.flags.svg}" alt="${border.name.common} flag" width="100">
                </div>
            `).join('');
        } else {
            borderingCountries.innerHTML = `<p>No bordering countries.</p>`;
        }
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        spinner.classList.add('hidden');
    }
}
searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});


countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry(countryInput.value.trim());
    }
});