import React from 'react';
import Styled from 'styled-components';

const SettingsView = (): JSX.Element => {
  return (
    <Settings.Layout>
      <Settings.Title>Settings</Settings.Title>
    </Settings.Layout>
  );
};

const Settings = {
  Layout: Styled.div`
      display: flex;
      width: 100%;
      height: 100%;
    `,
  Left: Styled.div`
      display: flex;
      flex-direction: row;
      width: 230px;
      background-color: rgba(253, 254, 254, 0.25);
    `,
  Title: Styled.h2`
    color: #000;
    `
};

export default SettingsView
