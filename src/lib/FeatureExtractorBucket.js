const { getCombinations } = require("./combo");
const { FeatureExtractorSet } = require("./FeatureExtractorSet");

class FeatureExtractorBucket {

  constructor() {
    this.features_ = [];
    this.extractorIndex_ = {};
  }

  add(label, factory, modifiers, weight) {

    if (!weight) weight = 1;

    // TODO: Param checks!
    this.extractorIndex_[label] = {
      weight,
      factory,
      label,
      modifiers
    };

    if (Array.isArray(modifiers)) {

      for (const modifier of modifiers) {

        this.features_.push(this.createFeatureExtractor_(label, factory, modifier, weight));
      }

      return;
    }

    this.features_.push(this.createFeatureExtractor_(label, factory, modifiers, weight));
    return;

  }

  buildFeatureExtractorSet(extractorList) {

    if (typeof extractorList === "string") extractorList = JSON.parse(extractorList);

    const features = [];

    for (const extractor of extractorList) {

      const { factory, weight } = this.extractorIndex_[extractor.name];
      const feature = this.createFeatureExtractor_(extractor.name, factory, extractor.modifier, weight);
      features.push(feature);
    }

    return new FeatureExtractorSet(features);

  }

  createFeatureExtractor_(label, extractorFactory, modifier, weight) {

    const extractor = {
      fnc: extractorFactory.create(modifier),
      name: label
    };

    extractor.weight = weight !== undefined ? weight : 1;
    if (modifier !== undefined) extractor.modifier = modifier;

    // console.log("extractor", extractor);

    return extractor;

  }
  getFeatureExtractors() {

    const combos = getCombinations(this.features_);

    const sets = [];

    for (const item of combos) {
      sets.push(new FeatureExtractorSet(item));
    }

    return sets;
  }
}

exports.FeatureExtractorBucket = FeatureExtractorBucket;
