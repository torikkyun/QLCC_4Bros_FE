import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const PersonalDetail: React.FC = () => {
  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [avatar, setAvatar] = useState<string>(localStorage.getItem('avatar') || '');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://103.167.89.178:3000/api/user/${userId}`)
        .then(response => {
          const data = response.data;
          setUser({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            password: data.password || '',
          });
          localStorage.setItem('email', data.email);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        localStorage.setItem('avatar', imageData);
        setAvatar(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSave = () => {
    if (user.password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userId = localStorage.getItem('userId');
    axios.put('http://103.167.89.178:3000/api/user', {
      ...user,
      id: userId,
    })
      .then(() => {
        alert('Profile updated successfully!');
        localStorage.setItem('email', user.email);
      })
      .catch(error => console.error('Error updating user:', error));
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Personal detail</h2>
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <img
            src={avatar || 'https://via.placeholder.com/100'}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mx-auto mb-4"
          />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <p className="text-gray-600 mb-6">{localStorage.getItem('email') || 'No email'}</p>
        <input
          type="text"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          placeholder="Firstname"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          placeholder="Lastname"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="youremail@shtha.com"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm password"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
        <p className="mt-4 text-blue-500 cursor-pointer">back to login</p>
      </div>
    </div>
  );
};

export default PersonalDetail;
