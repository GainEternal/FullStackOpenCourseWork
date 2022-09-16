const Countries = ({ countries, filter, handleButton, weather }) => {

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
        return <CountryData country={filteredCountries[0]} weather={weather} />
    } else {
        return <div> No countries match </div>
    }
}
  
const Country = ({ country, handleButton }) => {
    return <li>
        {country} <button id={country} onClick={handleButton} type="submit">Show</button>
    </li>
}
  
const CountryData = ({ country, weather }) => {
    return <div>

        <h2>{country.name.common}</h2>
        <BasicInfo country={country} />

        <h3>Languages</h3>
        <Languages country={country} />

        <img src={country.flags.png} alt="Country Flag" />

        <h3>Weather in {country.capital}</h3>
        <Weather weather={weather} />
            
    </div>
}

const BasicInfo = ({ country }) => {
    return <>
        Region: {country.region}<br/>
        Capital: {country.capital.toString()}<br/>
        Area: {country.area} km<sup>2</sup><br/>
        Population: {country.population}<br/>
    </>
}

const Languages = ({ country }) => {
    return <ul>
        {Object.values(country.languages)
            .map((language) => <Language key={language} language={language}/>)
        }
    </ul>
}

const Language = ({ language }) => <li>{language}</li>

const Weather = ({ weather }) => {
    return <div>
        Temperature: {weather.main.temp} Celcius <br/>
        <img 
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt="Weather Icon" />
        <br/>
        Wind: {weather.wind.speed} m/s
    </div>
}

export default Countries