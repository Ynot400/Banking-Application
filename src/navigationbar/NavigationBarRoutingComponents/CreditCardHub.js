import React from 'react';
import CreditCardCarousel from '../CreditCardComponents/CreditCardCarousel';


export default function CreditCardHub() {

  const userJson = localStorage.getItem('user'); // Retrieve the JSON string
  const userObj = JSON.parse(userJson); // Parse the JSON string to an object
  const username = userObj.username; // Extract the 'username' property 
  const name = userObj.name; // Extract the 'name' property
  console.log('CreditCardCarousel:', username, name);

 

  return (

        <CreditCardCarousel username={username} name={name}/>
    );

}