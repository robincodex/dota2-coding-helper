import React from 'react';
import ReactDOM from 'react-dom';
import { css } from '@emotion/css';
import styled from '@emotion/styled';

const Header = styled.h1`
    padding: 0px;
`;

function App() {
    return <Header>Header</Header>;
}

ReactDOM.render(<App />, document.getElementById('app'));
