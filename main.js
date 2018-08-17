const SHA256 = require('crypto-js/sha256');

class Block{
    constructor( index, timestamp , data , previousHash = '' ){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();

        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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

console.log('Mining block 1...');
NoobCoin.addBlock(new Block(1,"1/8/18",{amount:5}));

console.log('Mining block 2...');
NoobCoin.addBlock(new Block(2,"3/8/18",{amount:5}));



/*console.log(JSON.stringify(NoobCoin,null,4));
console.log("Is NoobCoin valid?"+NoobCoin.isChainValid());

/*NoobCoin.chain[1].data = {amount:55};
NoobCoin.chain[1].hash = NoobCoin.chain[1].calculateHash();
NoobCoin.chain[2].previousHash = NoobCoin.chain[1].calculateHash(); 
NoobCoin.chain[2].hash = NoobCoin.chain[2].calculateHash();


//console.log(JSON.stringify(NoobCoin,null,4));

console.log("Is NoobCoin valid?"+NoobCoin.isChainValid());
*/

