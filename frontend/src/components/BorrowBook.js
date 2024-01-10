import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles/BorrowBook.css';
import './styles/NavigationLinks.css';

const BorrowBook = () => {
  const history = useHistory(); // Initialize the useHistory hook

  const [city, setCity] = useState('novi_sad'); // Default city is Novi Sad

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const [book, setBook] = useState({
    bookTitle: '',
    author: '',
    isbn: '',
    memberNumber: '',
    loanDate: new Date().toISOString(),
  });

  const handleInputChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleBorrow = async () => {
    try {
      const endpoint = getCityEndpoint(city);

      const response = await axios.post(endpoint + '/borrow', book);
      if (response.data.status === 'success') {
        alert('Book borrowed successfully!');
        // Redirect to the Welcome Page after successful borrowing
        history.push('/');
      } else {
        alert('Failed to borrow book.');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const getCityEndpoint = (selectedCity) => {
    switch (selectedCity) {
      case 'novi_sad':
        return 'http://localhost:8081';
      case 'beograd':
        return 'http://localhost:8082';
      case 'nis':
        return 'http://localhost:8083';
      default:
        return 'http://localhost:8081'; // Default to Novi Sad
    }
  };

  return (
    <div className="borrow-book-container">
      <h2>Borrow Book</h2>
      
      {/* City Selection Dropdown */}
      <div className="city-selection">
        <label>Select City: </label>
        <select value={city} onChange={handleCityChange}>
          <option value="novi_sad">Novi Sad</option>
          <option value="beograd">Beograd</option>
          <option value="nis">Nis</option>
        </select>
      </div>

      {/* Borrow Book Form */}
      <form className="borrow-form">
        <input type="text" name="bookTitle" placeholder="Book Title" onChange={handleInputChange} />
        <input type="text" name="author" placeholder="Author" onChange={handleInputChange} />
        <input type="text" name="isbn" placeholder="ISBN" onChange={handleInputChange} />
        <input type="text" name="memberNumber" placeholder="Member Number" onChange={handleInputChange} />
        <button type="button" onClick={handleBorrow}>Borrow</button>
      </form>
    </div>
  );
};

export default BorrowBook;
