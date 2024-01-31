// libs
import React, { forwardRef } from 'react';
import Styled from 'styled-components';

// helpers
import { truncateString } from './../../helpers';

// img
import copyIcon from './../../assets/images/copy-link.png';
import RoundButton from '../buttons/roundButton';

export interface Props {
  account: string;
}

const MetaMaskModal = forwardRef<HTMLDivElement>((props: Props, ref) => {
  const { account } = props;

  const isClipboardAvailable = navigator.clipboard && navigator.clipboard.writeText !== undefined;

  return (
    <MetaMaskRoot.Layout ref={ref}>
      <MetaMaskRoot.Group>
        <MetaMaskRoot.Label>Connected Account</MetaMaskRoot.Label>
        {isClipboardAvailable ? (
          <MetaMaskRoot.Row>
            <MetaMaskRoot.Value>{truncateString(account)}</MetaMaskRoot.Value>
            <MetaMaskRoot.CopyButton src={copyIcon} onClick={() => navigator.clipboard.writeText(account)} />
          </MetaMaskRoot.Row>
        ) : (
          <MetaMaskRoot.Value>{truncateString(account)}</MetaMaskRoot.Value>
        )}
      </MetaMaskRoot.Group>
      <MetaMaskRoot.Row>
        <RoundButton value={'Add MOR'} inProgress={true} onClick={() => undefined} />
        <RoundButton value={'Sign'} onClick={() => undefined} />
      </MetaMaskRoot.Row>
      <MetaMaskRoot.Group>
      </MetaMaskRoot.Group>
    </MetaMaskRoot.Layout>
  )
});

const MetaMaskRoot = {
  Layout: Styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
    height: 150px;
    border-radius: 10px;
    background: ${(props) => props.theme.colors.core};
    position: absolute;
    right: -10px;
    top: 75px;
    box-shadow: 10px 10px 5px -7px rgba(0,0,0,0.5);
    padding: 10px;
  `,
  Group: Styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 30px;
  `,
  Row: Styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  Label: Styled.label`
    display: flex;
    font-family: ${(props) => props.theme.fonts.family.primary.regular};
    font-size: ${(props) => props.theme.fonts.size.smallest};
  `,
  Value: Styled.span`
    display: flex;
    font-family: ${(props) => props.theme.fonts.family.secondary.bold};
    font-size: ${(props) => props.theme.fonts.size.small};
  `,
  CopyButton: Styled.img`
    display: flex;
    width: 15px;
    height: 15px;
    margin-left: 5px;
    cursor: pointer;
  `
};

export default MetaMaskModal;