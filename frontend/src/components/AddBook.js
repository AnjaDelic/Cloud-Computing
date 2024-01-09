import React, { useState } from 'react';
import axios from 'axios';
import './styles/AddBook.css';
import './styles/NavigationLinks.css';


const AddBook = () => {
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
      await axios.post('http://localhost:8081/addBook', newBook);
      alert('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add Book</h2>
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