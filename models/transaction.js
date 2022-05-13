const SHA256 = require('crypto-js/sha256');
const db = require('../db');

class Transaction {
  constructor(inputs, outputs, blockNumber) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.size = inputs.length * 180 + outputs.length * 34 + 10;
    this.blockNumber = blockNumber;
  }

  getHash() {
    return SHA256(`${JSON.stringify(this.inputs)}${JSON.stringify(this.outputs)}${this.size}${this.blockNumber}`).toString();
  }

  execute() {
    const prevUTXOs = db.getData('/utxos');
    let updateCount = 0;
    while (updateCount < this.inputs.length) {
      const toBeSpent = this.inputs[updateCount];
      const toSplice = prevUTXOs.findIndex((utxo) => toBeSpent.owner === utxo.owner
        && toBeSpent.amount === utxo.amount
        && !utxo.spent);
      this.inputs[updateCount].markSpent();
      prevUTXOs.splice(toSplice, 1, this.inputs[updateCount]);
      updateCount += 1;
    }

    this.outputs.forEach((output) => {
      prevUTXOs.push(output);
    });

    db.push('/utxos', prevUTXOs);
  }
}

module.exports = Transaction;
