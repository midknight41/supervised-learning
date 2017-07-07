const natural = require("natural");
const Hoek = require("hoek");

class Classifier {

  constructor(tokenizer, classifier) {

    this.tokenizer = tokenizer;
    this.classifier_ = (!classifier) ? new natural.BayesClassifier() : classifier;
    this.extractorSets_ = [];

  }

  addFeatureSet(set) {
    this.extractorSets_.push(set);
  }

  addDocument(item, classification) {

    const tokens = this.getTokens_(item);

    this.classifier_.addDocument(tokens, classification);

  }

  getTokens_(item) {

    const tokens = this.tokenizer.tokenize(item);
    let featureTokens = [];

    // If feature extractors are provided, addDocuments with the extractor output
    if (this.extractorSets_.length > 0) {

      for (const extractorSet of this.extractorSets_) {

        for (const extractor of extractorSet.featureExtractors) {

          const extracted = extractor.fnc(tokens);

          const weighted = [];

          // One unique feature is recorded for each point of weighting
          for (let i = 0; i < extractor.weight; i++) {

            for (const extractedItem of extracted) {

              weighted.push(`w${i}:${extractedItem}`);
            }

          }

          Hoek.merge(featureTokens, weighted);
        }
      }

    } else {
      featureTokens = tokens;
    }

    // console.log(featureTokens);
    return featureTokens;

  }

  train() {
    this.classifier_.train();
  }

  classify(text) {

    const tokens = this.getTokens_(text);
    return this.classifier_.classify(tokens);
  }

  getClassifications(text) {

    const tokens = this.getTokens_(text);
    return this.classifier_.getClassifications(tokens);
  }

  save(fileName) {

    return new Promise((resolve, reject) => {

      this.classifier_.save(fileName, err => {

        if (err) return reject(err);

        return resolve(fileName);
        // console.log(`The classifier is saved to the ${fileName} file.`);

      });

    });

  }

  load(fileName) {

    return new Promise((resolve, reject) => {

      natural.BayesClassifier.load(fileName, (err, classifier) => {

        if (err) return reject(err);

        this.classifier_ = classifier;

        return resolve(classifier);

      });

    });


  }

}

exports.Classifier = Classifier;
