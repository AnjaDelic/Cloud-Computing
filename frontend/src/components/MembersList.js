import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/MemberList.css'; 
import './styles/NavigationLinks.css';

const MembersList = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/members');
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div>
      <h2>Members List</h2>
      <table className="members-table">
        <thead>
          <tr>
            <th>Member ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>JMBG</th>
            <th>Loans Count</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.firstName}</td>
              <td>{member.lastName}</td>
              <td>{member.address}</td>
              <td>{member.jmbg}</td>
              <td>{member.loansCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersList;
