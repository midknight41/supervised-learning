const { WordTokenizer, BayesClassifier } = require("natural");
const { FeatureExtractorBucket } = require("./FeatureExtractorBucket");
const Trainer = require("./Trainer").Trainer;
const Tester = require("./Tester").Tester;
const Classifier = require("./Classifier").Classifier;

class Toolkit {
  constructor({ tokenizer, bucket, itemSelector, classifierType }) {
    this.tokenizer_ = tokenizer;
    this.bucket_ = bucket;
    this.itemSelector_ = itemSelector;
    this.classifierType_ = classifierType;
  }

  buildFeatureExtractorSet(extractorDefinitions) {
    return this.bucket_.buildFeatureExtractorSet(extractorDefinitions);
  }

  loadClassifier(fileName) {

    return new Promise((resolve, reject) => {

      // Loads a basic classifier and wraps it in our feature classifier
      this.classifierType_.load(fileName, null, (err, basicClassifier) => {

        if (err) return reject(err);

        return resolve(this.createClassifier_(basicClassifier));
      });
    });
  }

  createTester(classifier) {

    return new Tester(classifier, { itemSelector: this.itemSelector_ });
  }

  createTrainer() {
    const classifier = this.createClassifier_();
    return new Trainer(classifier, { itemSelector: this.itemSelector_ });
  }

  createClassifier_(basicClassifier) {

    if (!basicClassifier) basicClassifier = new this.classifierType_();
    return new Classifier(this.tokenizer_, basicClassifier);

  }

}

function createToolkit(options) {

  const opts = {};

  if (!options) throw new Error("parameter 'options' was not provided");
  if (!options.itemSelector) throw new Error("Option 'itemSelector' is required");

  opts.classifierType = options.classifierType === undefined ? BayesClassifier : options.classifierType;
  opts.tokenizer = options.tokenizer === undefined ? new WordTokenizer() : options.tokenizer;
  opts.bucket = options.bucket === undefined ? new FeatureExtractorBucket() : options.bucket;
  opts.itemSelector = options.itemSelector;

  return new Toolkit(opts);

}

function createFeatureExtractorBucket() {
  return new FeatureExtractorBucket();
}

exports.createToolkit = createToolkit;
exports.createFeatureExtractorBucket = createFeatureExtractorBucket;
