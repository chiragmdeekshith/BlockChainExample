const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor( timestamp , transactions , previousHash = '' ){
    
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();

        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: ",this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block(0,"01/08/2018","Genesis Block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        //newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined.");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null,miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -=trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                //console.log("IF 1");
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                //console.log("IF 2");
                return false;
            }
            //console.log(i+ "correct");
        }
        return true;
    }
}

let NoobCoin = new BlockChain();

NoobCoin.createTransaction(new Transaction('address1','address2',5));
NoobCoin.createTransaction(new Transaction('address2','address1',55));

console.log("\nStarting the miner..");
NoobCoin.minePendingTransactions('myAddress');
console.log("\nBalance of 'my' is",NoobCoin.getBalanceOfAddress('myAddress'));

console.log("\nStarting the miner again..");
NoobCoin.minePendingTransactions('myAddress');
console.log("\nBalance of 'my' is",NoobCoin.getBalanceOfAddress('myAddress'));
