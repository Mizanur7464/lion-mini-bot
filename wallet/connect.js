async function connectWallet(walletType) {
    try {
        switch(walletType) {
            case 'metamask':
                if (typeof window.ethereum !== 'undefined') {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    console.log('Connected to MetaMask:', accounts[0]);
                    // Redirect to success page or show success message
                    alert('Successfully connected to MetaMask!');
                } else {
                    window.open('https://metamask.io/download/', '_blank');
                }
                break;

            case 'walletconnect':
                const provider = new WalletConnectProvider.default({
                    rpc: {
                        56: "https://bsc-dataseed.binance.org/"
                    },
                    chainId: 56
                });
                await provider.enable();
                alert('Successfully connected with WalletConnect!');
                break;

            case 'trustwallet':
                if (typeof window.ethereum !== 'undefined') {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    console.log('Connected to Trust Wallet:', accounts[0]);
                    alert('Successfully connected to Trust Wallet!');
                } else {
                    window.open('https://trustwallet.com/download', '_blank');
                }
                break;

            case 'binance':
                if (typeof window.BinanceChain !== 'undefined') {
                    const accounts = await window.BinanceChain.request({ method: 'eth_requestAccounts' });
                    console.log('Connected to Binance Wallet:', accounts[0]);
                    alert('Successfully connected to Binance Wallet!');
                } else {
                    window.open('https://www.bnbchain.org/en/wallet-direct', '_blank');
                }
                break;

            case 'coinbase':
                const coinbaseWallet = new CoinbaseWalletSDK({ appName: 'Your App Name' });
                const ethereum = coinbaseWallet.makeWeb3Provider();
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                console.log('Connected to Coinbase Wallet:', accounts[0]);
                alert('Successfully connected to Coinbase Wallet!');
                break;
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet. Please try again.');
    }
}

// Handle email submission
function handleEmailSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    console.log('Email submitted:', email);
    alert('Email registered successfully!');
} 