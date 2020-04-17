const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

/** UPDATE TO THIS because of the web3 library get updated! **/
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there';

beforeEach(async () => {
   // Get a list of all accounts
    /*** almost every function we called in web3 are asynchronous ***/
    accounts = await web3.eth.getAccounts();

   // Use one of those accounts to deploy
   // the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [INITIAL_STRING]})
        .send({from: accounts[0], gas: '1000000'});

    /** ADD THIS LINE because of the web3 library get updated! **/
    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploy a contract', () => {
        // console.log(inbox);
        assert.ok(inbox.options.address); /*** .ok means that the value exist or truthy ***/
    });
    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });
    it('can update the message', async () => {
        const tx = await inbox.methods.setMessage('Hello world').send({from: accounts[0], gas: '1000000'});
        // console.log(tx);
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hello world');
    });
});