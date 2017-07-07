const loadData = require("./loadData").loadData;
const { getValue } = require("map-factory");


class Verification {

  get fileName() { return this.fileName_; }
  get classification() { return this.classification_; }

  constructor(fileName, classification) {
    this.fileName_ = fileName;
    this.classification_ = classification;
  }


}

class Tester {
  constructor(classifier, opts) {

    this.opts_ = opts;
    this.itemSelector_ = opts.itemSelector;

    this.classifier_ = classifier;
    this.verifications_ = [];
  }

  defineSource(fileName, classification) {

    const verification = new Verification(fileName, classification);
    this.verifications_.push(verification);

  }

  use(featureSet) {
    this.classifier_.addFeatureSet(featureSet);
  }

  verify() {

    const percentages = [];

    for (const verification of this.verifications_) {

      const summary = {
        group: verification.classification,
        successful: 0,
        total: 0,
        percentage: 0,
        errors: []
      };

      const data = loadData(verification.fileName);

      for (const item of getValue(data, this.itemSelector_)) {

        summary.total++;
        const result = this.classifier_.classify(item);

        if (result === verification.classification) {
          summary.successful++;
        } else {
          summary.errors.push(item);
        }

      }

      if (summary.total > 0) summary.percentage = summary.successful / summary.total;

      percentages.push(summary);

    }

    return percentages;

  }

}

exports.Tester = Tester;
