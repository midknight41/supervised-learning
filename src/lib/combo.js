class Combo {

  constructor(source) {
    this.source_ = source;
    this.combinations_ = [];
  }

  calculate() {

    this.traverseTree_([], 0, this.source_.length);

    return this.combinations_;

  }

  traverseTree_(predecessor, position, limit) {

    for (let cursor = position; cursor < limit; cursor++) {

      // create new combination
      const combo = [];

      for (const item of predecessor) {
        combo.push(item);
      }

      combo.push(this.source_[cursor]);

      // store new combination
      this.combinations_.push(combo);

      // travel further down this branch
      if (cursor !== limit) this.traverseTree_(combo, cursor + 1, limit);
    }
  }

}

function getCombinations(array) {

  const combo = new Combo(array);
  return combo.calculate();

}

exports.getCombinations = getCombinations;
