const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, prevHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
    }
    calculateHash() {
        return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock() {
        return new Block(0, "19/04/2023", "GENESIS_BLOCK", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
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

mycoin.addBlock(new Block(1, "19/04/2023", { amount: 5 }));
mycoin.addBlock(new Block(2, "20/04/2023", { amount: 10 }));

console.log(mycoin.isChainValid()); // All good :)

mycoin.chain[1].data = { amount: 100 }; // Tamper the data ;)
mycoin.chain[1].hash = mycoin.chain[1].calculateHash(); // Recalculate the hash :D

console.log(mycoin.isChainValid()); // Sorry, chain is still broken :(