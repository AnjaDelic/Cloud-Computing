import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles/AddBook.css';
import './styles/NavigationLinks.css';

const AddBook = () => {
  const history = useHistory();

  const [city, setCity] = useState('novi_sad'); // Default city is Novi Sad

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const [newBook, setNewBook] = useState({
    bookTitle: '',
    author: '',
    isbn: '',
    availableCount: 0,
    totalCount: 0,
  });

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleAddBook = async () => {
    try {
      const endpoint = getCityEndpoint(city);
      
      // Convert availableCount and totalCount to numbers
      const bookData = {
        ...newBook,
        availableCount: +newBook.availableCount,
        totalCount: +newBook.totalCount,
      };

      await axios.post(endpoint, bookData);
      alert('Book added successfully!');
      
      // Navigate to the WelcomePage
      history.push('/');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const getCityEndpoint = (selectedCity) => {
    switch (selectedCity) {
      case 'novi_sad':
        return 'http://localhost:8081/addBook';
      case 'beograd':
        return 'http://localhost:8082/addBook';
      case 'nis':
        return 'http://localhost:8083/addBook';
      default:
        return 'http://localhost:8081/addBook'; // Default to Novi Sad
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add Book</h2>
      
      {/* City Selection Dropdown */}
      <div className="city-selection">
        <label>Select City: </label>
        <select value={city} onChange={handleCityChange}>
          <option value="novi_sad">Novi Sad</option>
          <option value="beograd">Beograd</option>
          <option value="nis">Nis</option>
        </select>
      </div>

      {/* Book Addition Form */}
      <form className="add-book-form">
        <input type="text" name="bookTitle" placeholder="Book Title" onChange={handleInputChange} />
        <input type="text" name="author" placeholder="Author" onChange={handleInputChange} />
        <input type="text" name="isbn" placeholder="ISBN" onChange={handleInputChange} />
        <input type="number" name="availableCount" placeholder="Available Count" onChange={handleInputChange} />
        <input type="number" name="totalCount" placeholder="Total Count" onChange={handleInputChange} />
        <button type="button" onClick={handleAddBook}>Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
