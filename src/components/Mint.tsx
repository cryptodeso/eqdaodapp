import { IonButton, IonCard, IonChip, IonImg, IonProgressBar, IonTitle } from '@ionic/react';
import './ExploreContainer.css';
import { Chain, useChainId, useContractRead, useContractWrite, useNetwork, useSwitchNetwork} from 'wagmi';
import { homeChain, mintContract } from '../config';
import { useEffect, useState } from 'react';
import { formatEther} from 'viem';
import logoTransparent from '../assets/logo_transparent.png'
import leftImage from '../assets/leftImage.png'
import rightImage from '../assets/rightImage.png'
import MintButton from './MintButton';
import RedeemButton from './RedeemButton';
import Stats from './Stats'
import './App.css'

interface ContainerProps {
  name: string;
}



const Mint: React.FC<ContainerProps> = () => {
  const [hash, setHash] = useState<string | null>(null);

  // const { data: totalSupplyData } = useContractRead({
  //   address: mintContract.address,
  //   abi: mintContract.abi,
  //   functionName: 'maxSupply',
  //   watch: true,
  // });

  // const { data: currentSupplyData } = useContractRead({
  //   address: mintContract.address,
  //   abi: mintContract.abi,
  //   functionName: 'totalSupply',
  //   watch: true,
  // });


  return (

    <div className="App">
      <header className="App-header">
        {/* <img src={logoTransparent} alt="logo" style={{ width: '650px', height: '250px' }}  /> */}
        
        <Stats/>
        <div className="minting-container">
          <div className="minting-content">
            <div className="button-container">
              <MintButton/>
            </div>
          </div>

          <div className="button-container">
              <RedeemButton/>
          </div>
        </div>
        
      </header>

    
    </div>

  );
};

export default Mint;
