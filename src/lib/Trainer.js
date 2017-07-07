const loadData = require("./loadData").loadData;
const { getValue } = require("map-factory");

class Training {

  get fileName() { return this.fileName_; }
  get classification() { return this.classification_; }

  constructor(fileName, classification) {
    this.fileName_ = fileName;
    this.classification_ = classification;
  }

}

class Trainer {

  constructor(classifier, opts) {

    this.opts_ = opts;
    this.itemSelector_ = opts.itemSelector;

    this.trainings_ = [];
    this.classifier_ = classifier;
  }

  use(featureSet) {
    this.classifier_.addFeatureSet(featureSet);
  }

  defineSource(fileName, classification) {
    const training = new Training(fileName, classification);
    this.trainings_.push(training);
  }

  addData_(fileName, classification) {

    const analysis = loadData(fileName);

    for (const item of getValue(analysis, this.itemSelector_)) {

      this.classifier_.addDocument(item, classification);

    }

  }

  createClassifier() {

    for (const training of this.trainings_) {
      this.addData_(training.fileName, training.classification);
    }

    this.classifier_.train();

    return this.classifier_;
  }

}

exports.Trainer = Trainer;
