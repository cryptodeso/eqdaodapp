import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
import {rpcUrl} from './config';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { avalanche, fantom, sepolia, avalancheFuji } from 'viem/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { InjectedConnector } from 'wagmi/connectors/injected';


setupIonicReact();
const { chains, publicClient } = configureChains(
  [avalancheFuji],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return {
          http: rpcUrl,
        }
      }
    }),
  ],
)
const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [new InjectedConnector({ chains })],
})
const App: React.FC = () => {
  return (
    <IonApp>
      <WagmiConfig config={config}>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            {/* <Menu /> */}
            <IonRouterOutlet id="main">
              <Route path="/" exact={true}>
                <Page />
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </WagmiConfig>

    </IonApp>
  );
};

export default App;
