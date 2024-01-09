import React from 'react';
import { useHistory } from 'react-router-dom';
import './styles/CitySelection.css';

const CitySelection = ({ onSelectCity }) => {
  const history = useHistory();

  const handleCitySelection = (city) => {
    onSelectCity(city);
    history.push(`/${city.toLowerCase()}`); // Prenosimo korisnika na odgovarajuću stranicu za izabrani grad
  };

  return (
    <div className="city-selection-container">
      <h2>Select City</h2>
      <div className="city-buttons">
        <button onClick={() => handleCitySelection('NoviSad')}>Novi Sad</button>
        <button onClick={() => handleCitySelection('Beograd')}>Beograd</button>
        <button onClick={() => handleCitySelection('Nis')}>Nis</button>
      </div>
    </div>
  );
};

export default CitySelection;
