// libs
import React from 'react';
import Styled from 'styled-components';
import { TailSpin } from 'react-loader-spinner';

export interface Props {
  value: string;
  logo?: string;
  inProgress?: boolean;
  onClick: () => Promise<void>;
}

const RoundButton = ({ value, inProgress, onClick }: Props) => {
  return (
    <Button.Wrapper onClick={onClick}>
      {!inProgress && value}
      {inProgress && <Button.Loader width='20' color='#000' visible={true} />}
    </Button.Wrapper>
  );
};

const Button = {
  Wrapper: Styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 30px;
    border-radius: 10px;
    padding: 10px;
    margin: 2px;
    background-color: ${(props) => props.theme.colors.core};
    border: 2px solid ${(props) => props.theme.colors.hunter};
    cursor: pointer;
    transition: all 0.5s;
    z-index: 1;
    font-family: ${(props) => props.theme.fonts.family.secondary.bold};
    font-size: ${(props) => props.theme.fonts.size.small};

    &:hover {
      background-color: ${(props) => props.theme.colors.hunter};
    }
  `,
  Loader: Styled(TailSpin)`
    display: flex;
    width: 100%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `
};

export default RoundButton;