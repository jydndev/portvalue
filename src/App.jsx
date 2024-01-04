import { Suspense } from 'react';
import { isMobile } from 'react-device-detect';

import { string } from 'prop-types';

import {
  AuthProvider,
  MallProvider,
  Modal,
  ModalProvider,
  TermsProvider,
  PageScriptsProvider,
  DesignPopupProvider,
  BoardConfigurationProvider,
  NaverShoppingConfigurationProvider,
} from '@shopby/react-components';
import { TERMS_KEY_TYPE } from '@shopby/shared';

import { ErrorBoundary } from './components/ErrorBoundary';
import Router from './router';

const App = ({ clientId, profile }) => (
  <Suspense>
    <ModalProvider>
      <ErrorBoundary>
        <MallProvider clientId={clientId} mallProfile={profile}>
          <BoardConfigurationProvider>
            <AuthProvider>
              <TermsProvider
                termsTypes={[
                  TERMS_KEY_TYPE.MALL_INTRODUCTION,
                  TERMS_KEY_TYPE.USE,
                  TERMS_KEY_TYPE.PI_PROCESS,
                  TERMS_KEY_TYPE.ACCESS_GUIDE,
                ]}
              >
                <PageScriptsProvider platform={isMobile ? 'MOBILE' : 'PC'}>
                  <NaverShoppingConfigurationProvider>
                    <DesignPopupProvider>
                      <Router />
                      <Modal />
                    </DesignPopupProvider>
                  </NaverShoppingConfigurationProvider>
                </PageScriptsProvider>
              </TermsProvider>
            </AuthProvider>
          </BoardConfigurationProvider>
        </MallProvider>
      </ErrorBoundary>
    </ModalProvider>
  </Suspense>
);
export default App;

App.propTypes = {
  clientId: string.isRequired,
  profile: string.isRequired,
};
