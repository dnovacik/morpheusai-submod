import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MetaMaskProvider } from '@metamask/sdk-react';
import { HashRouter } from 'react-router-dom';

// custom components
import { QrCodeModal } from './components/modals/qr-code-modal';
import AppInit from './components/layout/appInit';
import Main from './components/layout/main';

// helpers
import { updateQrCode } from './helpers';
import { IpcChannel } from './../events';

// theme
import ThemeProvider from './theme/themeProvider';
import GlobalStyle from './theme/index'
import './index.css';

// root
const rootElement = document.querySelector('#root');
const root = createRoot(rootElement);

const AppRoot = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const result = await window.backendBridge.main.init();

      setIsInitialized(result);
    };

    init()
      .catch(err => console.error(err));

      return () => {
        window.backendBridge.removeAllListeners(IpcChannel.AppInit);
      }
  });

  // useEffect(() => {
  //   window.backendBridge.main.onInit((result: boolean) => setIsInitialized(result));

  //   return () => {
  //     window.backendBridge.removeAllListeners('app:init');
  //   }
  // });

  return (
    <React.StrictMode>
      <ThemeProvider>
        <MetaMaskProvider
          debug={false}
          sdkOptions={{
            logging: {
              developerMode: false
            },
            communicationServerUrl: 'https://metamask-sdk-socket.metafi.codefi.network/',
            checkInstallationImmediately: false,
            i18nOptions: {
              enabled: true
            },
            dappMetadata: {
              name: 'MorpheusAI SubMod',
              url: window.location.host
            },
            modals: {
              install: ({ link }) => {
                let modalContainer: HTMLElement | null;

                return {
                  mount: () => {
                    if (modalContainer) return;

                    modalContainer = document.createElement('div');

                    modalContainer.id = 'meta-mask-modal-container';

                    document.body.appendChild(modalContainer);

                    ReactDOM.render(
                      <QrCodeModal
                        onClose={() => {
                          ReactDOM.unmountComponentAtNode(modalContainer);
                          modalContainer.remove();
                        }}
                      />,
                      modalContainer,
                    );

                    setTimeout(() => {
                      updateQrCode(link);
                    }, 100);
                  },
                  unmount: () => {
                    if (modalContainer) {
                      ReactDOM.unmountComponentAtNode(modalContainer);

                      modalContainer.remove();
                    }
                  },
                };
              },
            }
          }}
        >
          {!isInitialized && <AppInit />}
          {isInitialized && <Main />}

        </MetaMaskProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
};

root.render(
  <HashRouter>
    <GlobalStyle />
    <AppRoot />
  </HashRouter>
)
