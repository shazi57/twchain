const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(timestamp, nonce, transactions, merkleRoot) {
    this.timestamp = timestamp || Date.now();
    this.nonce = nonce || 0;
    this.transactions = transactions || [];
    this.merkleRoot = merkleRoot || null;
  }

  getHash() {
    return SHA256(`${this.timestamp}${this.nonce}${this.transactions}`).toString();
  }

  obtainMerkleProof(txHash, txes = this.transactions.map((tx) => tx.hash), merkleProof = []) {
    if (txes.length === 1) {
      return merkleProof;
    }
    const merkleLayer = [];
    for (let i = 0; i < txes.length - 1; i += 1) {
      const first = txes[i];
      const second = txes[i + 1];
      if (txHash === first) {
        merkleProof.push(second);
      }
      if (second && txHash === second) {
        merkleProof.push(first);
      }
      if (!second) {
        merkleLayer.push(first);
      } else {
        merkleLayer.push(SHA256(`${first}${second}`).toString());
      }
    }
    return this.obtainMerkleProof(txHash, merkleLayer, merkleProof);
  }

  setMerkleRoot(txes = this.transactions.map((tx) => tx.getHash())) {
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
