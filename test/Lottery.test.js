// const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const assert = require('assert');
const {interface, bytecode} = require('../compile');
const ganache = require('ganache-cli');

const provider = ganache.provider();

const web3 = new Web3(provider);

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: 1000000});
});

describe('a lottery contract', () => {
    it('can deploy a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });

        const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
        assert.equal(players.length, 1);
        assert.equal(accounts[0], players[0]);
    })
});

