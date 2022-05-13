class UTXO {
  constructor(owner, amount, prev) {
    this.owner = owner;
    this.amount = amount;
    this.spent = false;
    this.prev = prev;
  }

  markSpent() {
    this.spent = true;
  }
}

module.exports = UTXO;
