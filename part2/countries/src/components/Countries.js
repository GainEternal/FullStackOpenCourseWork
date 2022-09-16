const Countries = ({ countries, filter, handleButton, oneCountry }) => {

    const filteredCountries = countries.filter((country) => 
        country.name.common.toLowerCase().includes(filter.toLowerCase()))

    if (filteredCountries.length > 10) {
        return <div>Too many matches. Specify another filter.</div>
    } else if (filteredCountries.length > 1) {
        return <ul>
        {filteredCountries
            .map((country) => <Country 
            key={country.name.common} 
            country={country.name.common}
            handleButton={handleButton}/>)
        }
        </ul>
    } else if(filteredCountries.length === 1) {
        return <CountryData country={filteredCountries[0]} />
    } else {
        return <div> No countries match </div>
    }
}
  
const Country = ({ country, handleButton }) => {
    return <li>
        {country} <button id={country} onClick={handleButton} type="submit">Show</button>
    </li>
}
  
const CountryData = ({ country }) => {
    return <div>
        <h2>{country.name.common}</h2>
        <div>
            Region: {country.region}<br/>
            Capital: {country.capital}<br/>
            Area: {country.area} km<sup>2</sup><br/>
            Population: {country.population}<br/>

            <h3>Languages</h3>
            <ul>
            {Object.values(country.languages)
                .map((language) => <Language key={language} language={language}/>)
            }
            </ul>

            <img src={country.flags.png} alt="Country Flag" />

        </div>
    </div>
}

const Language = ({ language }) => <li>{language}</li>

export default Countries