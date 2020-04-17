const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
    'guard humble shrimp model canal runway boss position tube shy bunker mirror',
    'https://ropsten.infura.io/v3/57be3513956440c6b2764924be48cb5d'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
        try {
            const result = await new web3.eth.Contract(JSON.parse(interface))
                .deploy({data: '0x' + bytecode, arguments: ['Hi there!']}) // add 0x bytecode
                .send({from: accounts[0]});

            console.log('Contract deploy to' + result.options.address)
        } catch(e) {
            console.log(e)
        }
};

deploy().catch();


