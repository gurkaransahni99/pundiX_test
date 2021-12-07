const BN = require('bn.js');
const { BigNumber, utils } = require("ethers")
const CONFIG = require("../credentials.js");

const DEBUG = true

const logger = (...params) => {
    if (DEBUG) {
        console.log(...params)
    }
}

const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${CONFIG.infura.mainEndpoint}`)
const signer = new ethers.Wallet(CONFIG.wallet.PKEY);
const account = signer.connect(provider);

// Helper function for toBaseUnit
function isString(s) {
    return (typeof s === 'string' || s instanceof String)
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

// https://ethereum.stackexchange.com/questions/41506/web3-dealing-with-decimals-in-erc20
// Take a value string & decimals to return corresponding representtaion as a BN object
const toBaseUnit = (value, decimals) => {
    if (!isString(value)) {
        throw new Error('Pass strings to prevent floating point precision issues.')
    }
    const ten = new BN(10);
    const base = ten.pow(new BN(decimals));

    // Is it negative?
    let negative = (value.substring(0, 1) === '-');
    if (negative) {
        // eslint-disable-next-line no-param-reassign
        value = value.substring(1);
    }

    if (value === '.') {
        throw new Error(
            `Invalid value ${value} cannot be converted to`
            + ` base unit with ${decimals} decimals.`,
        );
    }

    // Split it into a whole and fractional part
    let comps = value.split('.');
    if (comps.length > 2) { throw new Error('Too many decimal points'); }

    let whole = comps[0]; let
        fraction = comps[1];

    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > decimals) {
        throw new Error('Too many decimal places');
    }

    while (fraction.length < decimals) {
        fraction += '0';
    }

    whole = new BN(whole);
    fraction = new BN(fraction);
    let wei = (whole.mul(base)).add(fraction);

    if (negative) {
        wei = wei.neg();
    }

    return new BN(wei.toString(10), 10);
}

const parseBaseUnit = (value, decimals) => {
    let orig = value;
    if (BN.isBN(value)) {
        value = value.toString()
    }
    if (!isString(value)) {
        throw new Error(`Not a String: ${value} ${decimals} ${orig}`)
    }
    value = BigNumber.from(value)
    return utils.formatUnits(value, decimals)
}

const advanceBlock = () => new Promise((resolve, reject) => {
    web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: new Date().getTime(),
    }, async (err, result) => {
        if (err) { return reject(err) }
        // const newBlockhash =await web3.eth.getBlock('latest').hash
        return resolve()
    })
})

const advanceBlocks = async (num) => {
    let resp = []
    for (let i = 0; i < num; i += 1) {
        resp.push(advanceBlock())
    }
    await Promise.all(resp)
}

const advancetime = (time) => new Promise((resolve, reject) => {
    web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        id: new Date().getTime(),
        params: [time],
    }, async (err, result) => {
        if (err) { return reject(err) }
        const newBlockhash = (await web3.eth.getBlock('latest')).hash

        return resolve(newBlockhash)
    })
})

// eslint-disable-next-line no-undef
contract("PundiX Deploy Script", () => {
    // eslint-disable-next-line no-undef
    before(async () => {
        accounts = await web3.eth.getAccounts();
    
        mPUNDIX = await ethers.getContractFactory("mPUNDIX");
        mPUNDIX = await mPUNDIX.deploy(toBaseUnit("100", 18).toString());

        mPURSE = await ethers.getContractFactory("mPURSE");
        mPURSE = await mPURSE.deploy();

        staking = await ethers.getContractFactory("Staking");
        staking = await staking.deploy(mPUNDIX.address, mPURSE.address);

    })

    // eslint-disable-next-line no-undef
    after(async () => {
        logger('\u0007');
        logger('\u0007');
        logger('\u0007');
        logger('\u0007');
    })

    it("print contract address", async () => {
        logger({
            mPUNDIX: mPUNDIX.address,
            mPURSE: mPURSE.address,
            staking: staking.address,
        })
    })

    it("should change owner of mPURSE token", async () => {
        let tx = await mPURSE.changeOwner(staking.address);
        await tx.wait();
    })
})