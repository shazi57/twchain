const SHA256 = require('crypto-js/sha256');

class Block {
  constructor() {
    this.timestamp = Date.now();
    this.nonce = 0;
    this.transactions = [];
    this.merkleRoot = null;
  }

  getHash() {
    return SHA256(`${this.timestamp}${this.nonce}${this.transactions}`).toString();
  }

  setMerkleRoot(txes = this.transactions.map((tx) => tx.hash)) {
    if (txes.length === 1) {
      [this.merkleRoot] = txes;
      return;
    }
    const merkleLayer = [];
    for (let i = 0; i < txes.length - 1; i += 1) {
      const first = txes[i];
      const second = txes[i + 1];
      if (!second) {
        merkleLayer.push(first);
      } else {
        merkleLayer.push(SHA256(`${first}${second}`).toString());
      }
    }
    this.setMerkleRoot(merkleLayer);
  }

  addTransaction(tx) {
    this.transactions.push(tx);
  }

  execute() {
    this.transactions.forEach((tx) => tx.execute());
  }

  toString() {
    const block = {
      timestamp: this.timestamp,
      nonce: this.nonce,
      transactions: this.transactions,
      hash: this.getHash(),
    };
    return JSON.stringify(block);
  }
}

module.exports = Block;
