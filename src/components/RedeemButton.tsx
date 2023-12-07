import { IonButton, IonCard, IonChip, IonImg, IonItem, IonList, IonHeader, IonAvatar, IonInput, IonCardSubtitle, IonCardContent, IonProgressBar, IonText, IonTitle } from '@ionic/react';
import './ExploreContainer.css';
import { Chain, useChainId, useContractRead, useContractWrite, useNetwork, useSwitchNetwork, useAccount } from 'wagmi';
import { explorerUrl, homeChain, iconUrls, mintContract, rpcUrl } from '../config';
import { useEffect, useState } from 'react';
import { formatEther, parseEther } from 'viem';
import eqDaoLogo from '../assets/eqDaoLogo.png';
import equal from '../assets/equalLogo.png';
import './App.css'

interface ContainerProps {
    name: string;
}
async function addNetworkToMetaMask(chain: Chain) {
    if (!chain) {
        return;
    }
    const networkData = {
        chainId: `0x${chain.id.toString(16)}`, // Convert the chain ID to a hex string
        chainName: "Avalanche Fuji Testnet",
        nativeCurrency: chain.nativeCurrency,

        iconUrls: [iconUrls],
        rpcUrls: [rpcUrl],
        blockExplorerUrls: [explorerUrl], // Map block explorer objects to their URLs
    };
    // Check if MetaMask is installed
    const ethereum = (window as any).ethereum
    if (typeof ethereum !== 'undefined') {
        try {
            // Try to switch to the network (by its chain ID)
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: networkData.chainId }],
            });
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    // Try to add the new network
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [networkData],
                    });
                } catch (addError) {
                    // Handle any errors that occur when trying to add the new network
                    console.error('Could not add network to MetaMask', addError);
                }
            } else {
                // Handle other errors
                console.error('Could not switch to the network in MetaMask', switchError);
            }
        }
    } else {
        console.log('MetaMask is not installed!');
    }
}


const RedeemButton: React.FC = () => {
    const chainId = useChainId();
    const { switchNetwork } = useSwitchNetwork({ chainId: homeChain.id })
    const { chain, chains } = useNetwork()
    const { address } = useAccount();
    const [hash, setHash] = useState<string | null>(null);
    const [valueInWei, setValueInWei] = useState(0n);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        homeChain && addNetworkToMetaMask(homeChain);
        switchNetwork && switchNetwork(homeChain.id)
    }, [chainId, switchNetwork, chain])

    const { write: redeem} = useContractWrite({
        ...mintContract,
        functionName: "redeem",
    })

    const onInput = (ev: Event) => {
        const value = (ev.target as HTMLIonInputElement).value as string;

        const valueInWei = parseEther(value)
        setValueInWei(valueInWei);
        setInputValue(value);
    }

    const { data: balancePEqual } = useContractRead({
        address: mintContract.address,
        abi: mintContract.abi,
        functionName: 'balanceOf',
        watch: true,
        args: [address],
    });

    const handleHelperTextClick = () => {
        if (balancePEqual) {
          const formattedBalance = parseFloat(formatEther(balancePEqual as bigint)).toFixed(3);
          setInputValue(formattedBalance);
        }
      };


    return (
        <IonList>
            <IonCard color='light' className='card'>
                <IonCard color='light'>
                    <IonHeader>
                        <IonTitle>
                            Burn <IonChip outline={true} color='light'><IonAvatar><img src={eqDaoLogo}  title="pEqual"/></IonAvatar></IonChip>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right'}}> <IonCardSubtitle> </IonCardSubtitle></div>
                        </IonTitle>
                    <IonInput aria-label='Deposit input' clearInput={false} type='number' placeholder="0" onIonInput={onInput} min="0" value={inputValue}></IonInput>
                    <IonCardContent onClick={handleHelperTextClick}  style={{ cursor: 'pointer' }}> Balance: {balancePEqual ? parseFloat(formatEther(balancePEqual as bigint)).toFixed(3) : '0'} $pEqual </IonCardContent>
                    </IonHeader>
                </IonCard>
                
                <IonCard color='light'>
                    <IonHeader>
                        <IonTitle>
                            Receive <IonChip outline={true} color='light'><IonAvatar><img src={equal} title="Equal"/></IonAvatar></IonChip>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right'}}> <IonCardSubtitle></IonCardSubtitle></div>
                        </IonTitle>
                        <IonInput aria-label="Disabled input" value="0" type='number' readonly={true}></IonInput>
                    </IonHeader>
                </IonCard>



                <IonCard color='light'>
                <IonButton color='dark' className="my-class" fill='solid' disabled={!redeem || !valueInWei || BigInt(valueInWei) <= 0n} onClick={() => redeem({args: [valueInWei]})}>
                    redeem
                </IonButton>
                </IonCard>
                
            </IonCard>
        </IonList>
    );
};

export default RedeemButton;