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
    });
    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });
        await lottery.methods.enter().send({ from: accounts[1], value: web3.utils.toWei('0.02', 'ether') });
        await lottery.methods.enter().send({ from: accounts[2], value: web3.utils.toWei('0.02', 'ether') });


        const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
        assert.equal(players.length, 3);
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
    });
    it('require minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({from: accounts[0], value: 10 /* unit: wei, WILL FAILED */});

            /** 如果上面的程式不 throw error 到 catch block
             * 就會執行 assert(false) 這個 test 就會失敗 **/
            assert(false);
        } catch(e) {
            /** assert.ok() check existence **/
            /** assert() check truthiness **/
            assert(e);
        }
    });
    it('manager could pick a winner', async () => {
        try {
            await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });
            await lottery.methods.enter().send({ from: accounts[1], value: web3.utils.toWei('0.02', 'ether') });
            await lottery.methods.enter().send({ from: accounts[2], value: web3.utils.toWei('0.02', 'ether') });

            await lottery.methods.pickWinner().send({from: accounts[0]});

            assert(true);
        } catch(e) {
            assert(false);
        }
    });
    it('only manager could pick the winner', async () => {
        try {
            // don't have to real enter the game, because the restricted modifier will kick you out
            await lottery.methods.pickWinner().send({from: accounts[1]});
            assert(false);
        } catch(e) {
            assert(e);
        }
    })
});

