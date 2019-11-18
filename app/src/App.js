import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import './App.css';
import CPUInfo from './CPUInfo';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1>CPU Monitor</h1>
        </header>
        <CPUInfo />
      </div>
    </ApolloProvider>
  );
}

export default App;
