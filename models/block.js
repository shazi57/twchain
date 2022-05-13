const SHA256 = require('crypto-js/sha256');

class Block {
  constructor() {
    this.timestamp = Date.now();
    this.nonce = 0;
    this.transactions = [];
  }

  getHash() {
    return SHA256(`${this.timestamp}${this.nonce}${this.transactions}`).toString();
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
