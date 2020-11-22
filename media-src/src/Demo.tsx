import styled from '@emotion/styled';
import React from 'react';
import ReactDOM from 'react-dom';

const Header = styled.h1``;

function App() {
    return <Header>123456</Header>;
}

ReactDOM.render(<App />, document.getElementById('app'));
