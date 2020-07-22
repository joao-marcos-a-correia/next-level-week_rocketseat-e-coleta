import React from 'react';
import { StatusBar } from 'react-native';

import Home from './src/pages/Home';
import Routes from './src/routes';


export default function App() {
  
  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent />
      <Routes />
    </>
  );
};
