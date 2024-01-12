import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles/AddBook.css'; // Koristi isti CSS fajl za stilizaciju

const ReturnBook = () => {
  const history = useHistory();

  const [city, setCity] = useState('novi_sad'); // Default city is Novi Sad

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const [returnedBook, setReturnedBook] = useState({
    bookTitle: '',
    author: '',
    isbn: '',
    memberNumber: '',
  });

  const handleInputChange = (e) => {
    setReturnedBook({ ...returnedBook, [e.target.name]: e.target.value });
  };

  const handleReturnBook = async () => {
    try {
      const endpoint = getCityEndpoint(city);

      await axios.post(endpoint, returnedBook);
      alert('Book returned successfully!');

      // Navigate to the WelcomePage
      history.push('/');
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const getCityEndpoint = (selectedCity) => {
    switch (selectedCity) {
      case 'novi_sad':
        return 'http://localhost:8081/returnBook';
      case 'beograd':
        return 'http://localhost:8082/returnBook';
      case 'nis':
        return 'http://localhost:8083/returnBook';
      default:
        return 'http://v:8081/returnBook'; // Default to Novi Sad
    }
  };

  return (
    <div className="add-book-container"> {/* Koristi istu klasu kao i za AddBook */}
      <h2>Return Book</h2>
      
      {/* City Selection Dropdown */}
      <div className="city-selection">
        <label>Select City: </label>
        <select value={city} onChange={handleCityChange}>
          <option value="novi_sad">Novi Sad</option>
          <option value="beograd">Beograd</option>
          <option value="nis">Nis</option>
        </select>
      </div>

      {/* Book Return Form */}
      <form className="add-book-form"> {/* Koristi istu klasu kao i za AddBook */}
        <input type="text" name="bookTitle" placeholder="Book Title" onChange={handleInputChange} />
        <input type="text" name="author" placeholder="Author" onChange={handleInputChange} />
        <input type="text" name="isbn" placeholder="ISBN" onChange={handleInputChange} />
        <input type="text" name="memberNumber" placeholder="Member Number" onChange={handleInputChange} />
        <button type="button" onClick={handleReturnBook}>Return Book</button>
      </form>
    </div>
  );
};

export default ReturnBook;
