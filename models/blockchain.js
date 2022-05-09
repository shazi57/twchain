class Blockchain {
  constructor() {
    this.blocks = [];
  }

  getHeight() {
    return this.blocks.length;
  }

  addBlock(block) {
    this.blocks.push(block);
  }
}

module.exports = Blockchain;
