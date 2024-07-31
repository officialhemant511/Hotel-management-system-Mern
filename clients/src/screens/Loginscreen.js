import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';

function Loginscreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login() {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
  
    const user = { email, password };
  
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('/api/users/login', user);
      console.log('Full response:', response);
      const data = response.data;
      console.log('Response data:', data);
  
      if (data && typeof data === 'object') {
        if (data.email && data._id) {
          console.log('User data found:', data);
          localStorage.setItem('currentUser', JSON.stringify(data));
          
          // Verify that the data was stored correctly
          const storedUserString = localStorage.getItem('currentUser');
          if (storedUserString) {
            const storedUser = JSON.parse(storedUserString);
            console.log('Stored user:', storedUser);
            
            // Redirect to home page
            window.location.href = '/home';
          } else {
            throw new Error('Failed to store user data in localStorage');
          }
        } else {
          console.log('Unexpected data structure:', data);
          throw new Error('Unexpected response format from server');
        }
      } else {
        console.log('Invalid response data:', data);
        throw new Error('Invalid response from server');
      }
  
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      if (error.response) {
        console.log('Error response:', error.response);
        errorMessage = error.response.data.message || 'Login failed. Please try again.';
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className='row justify-content-center mt-5 shadow-none'>
        <div className='col-md-5 mt-5'>
          {error && typeof error === 'string' && <Error message={error} />}
          <div className='bs border'>
            <h2 className='text-center'>Login</h2>
            <input
              type='email'
              className='form-control'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              className='form-control'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className='btn btn-dark mt-3' onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginscreen;