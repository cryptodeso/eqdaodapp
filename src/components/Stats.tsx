import { IonButton, IonCard, IonChip, IonGrid, IonCardHeader,IonRow,  IonCardContent, IonAvatar, IonCardTitle, IonCardSubtitle, IonImg, IonItem, IonList, IonProgressBar, IonText, IonTitle, IonHeader } from '@ionic/react';
import './ExploreContainer.css';
import { Chain, useChainId, useContractRead, useContractWrite, useNetwork, useSwitchNetwork, useAccount } from 'wagmi';
import { homeChain, mintContract, fakeEqual, fakeEqualNew, rpcUrl, iconUrls, explorerUrl } from '../config';
import { useEffect, useState } from 'react';
import { formatEther,  formatGwei, formatUnits} from 'viem';
import './App.css'
import eqDaoLogo from '../assets/eqDaoLogo.png';
import equal from '../assets/equalLogo.png';

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


const Stats: React.FC = () => {
    const chainId = useChainId();
    const { switchNetwork } = useSwitchNetwork({ chainId: homeChain.id })
    const { chain, chains } = useNetwork()
    const [hash, setHash] = useState<string | null>(null);
    const { address } = useAccount();

    useEffect(() => {
        homeChain && addNetworkToMetaMask(homeChain);
        switchNetwork && switchNetwork(homeChain.id)
    }, [chainId, switchNetwork, chain])

    // const { data: totalBacking } = useContractRead({
    // address: mintContract.address,
    // abi: mintContract.abi,
    // functionName: 'getTotalBacking',
    // watch: true,
    // });


    const { data: totalSupply } = useContractRead({
    address: mintContract.address,
    abi: mintContract.abi,
    functionName: 'totalSupply',
    watch: true,
    });

    const { data: totalBacking } = useContractRead({
        address: mintContract.address,
        abi: mintContract.abi,
        functionName: 'totalBacking',
        watch: true,
        });
    

    const { data: balance } = useContractRead({
        address: mintContract.address,
        abi: mintContract.abi,
        functionName: 'balanceOf',
        watch: true,
        args: [address],
    });


    return (
        <IonGrid>
            <IonRow>

            <IonCard color='light' className="my-class">
                <IonHeader>
                    <IonCardTitle>
                        Your Balance
                    </IonCardTitle>
                </IonHeader>
                <IonCardContent>{balance ? parseFloat(formatEther(balance as bigint)).toFixed(3).toString() : '0'} $pEqual</IonCardContent>
                <IonChip outline={true} color='light'><IonAvatar><img src={eqDaoLogo}  title="pEqual"/></IonAvatar></IonChip>
            </IonCard>

            <IonCard color='light' className="my-class">
                <IonHeader>
                    <IonCardTitle>
                        Total Supply
                    </IonCardTitle>
                </IonHeader>
                <IonCardContent>{totalSupply ? parseFloat(formatEther(totalSupply as bigint)).toFixed(3).toString() : '0'} $pEqual</IonCardContent>
                <IonChip outline={true} color='light'><IonAvatar><img src={eqDaoLogo}  title="pEqual"/></IonAvatar></IonChip>
            </IonCard>
            
            <IonCard color='light' className="my-class">
                <IonHeader>
                    <IonCardTitle>
                        Total Backing
                    </IonCardTitle>
                </IonHeader>
                <IonCardContent>{totalBacking ? parseFloat(formatEther(totalBacking as bigint)).toFixed(3).toString() : '0'} $Equal </IonCardContent>
                <IonChip outline={true} color='light'><IonAvatar><img src={equal} title="Equal"/></IonAvatar> </IonChip>
            </IonCard>
            <IonCard color='light' className="my-class">
                <IonHeader>
                    <IonCardTitle>
                        Total Amount Distributed as Bribes
                    </IonCardTitle>
                </IonHeader>
                <IonCardContent> 0 $Equal </IonCardContent>
                <IonChip outline={true} color='light'><IonAvatar><img src={equal} title="Equal"/></IonAvatar> </IonChip>
            </IonCard>

            </IonRow>
        </IonGrid>
        
    );
};

export default Stats;