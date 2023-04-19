const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, prevHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    mineBlock(difficulty) {
        const zeroes = Array(difficulty + 1).join("0");
        while (this.hash.substring(0, difficulty) !== zeroes) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined with hash: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }
    createGenesisBlock() {
        return new Block(0, "19/04/2023", "GENESIS_BLOCK", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.prevHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

const mycoin = new BlockChain();

console.log("Mining block 1...");
mycoin.addBlock(new Block(1, "19/04/2023", { amount: 5 }));

console.log("Mining block 2...");
mycoin.addBlock(new Block(2, "20/04/2023", { amount: 10 }));

// Checking the integrity of the blockchain
console.log("Is blockchain in valid state: " + mycoin.isChainValid()); // All good :)

mycoin.chain[1].data = { amount: 100 }; // Tamper the data ;)
mycoin.chain[1].hash = mycoin.chain[1].calculateHash(); // Recalculate the hash :D

console.log("Is blockchain in valid state: " + mycoin.isChainValid()); // Sorry, chain is still broken :(