import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles/BorrowBook.css';
import './styles/NavigationLinks.css';

const BorrowBook = () => {
  const history = useHistory(); // Initialize the useHistory hook

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
      const response = await axios.post('http://localhost:8081/borrow', book);
      if (response.data.status === 'success') {
        alert('Book borrowed successfully!');
        // Redirect to the Welcome Page after successful borrowing
        history.push('/welcome');
      } else {
        alert('Failed to borrow book.');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  return (
    <div className="borrow-book-container">
      <h2>Borrow Book</h2>
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
