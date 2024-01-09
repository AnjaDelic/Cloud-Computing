import React, { useState } from 'react';
import axios from 'axios';
import './styles/RegisterMember.css';
import './styles/NavigationLinks.css';

const RegisterMember = () => {
  const [member, setMember] = useState({
    firstName: '',
    lastName: '',
    address: '',
    jmbg: '',
  });

  const handleInputChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/register', member);
      console.log(response.data);

      // Reload the page after successful registration
      window.location.reload();
    } catch (error) {
      console.error('Error registering member:', error);
    }
  };

  return (
    <div>
      <h2>Register Member</h2>
      <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} />
      <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} />
      <input type="text" name="address" placeholder="Address" onChange={handleInputChange} />
      <input type="text" name="jmbg" placeholder="JMBG" onChange={handleInputChange} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterMember;
