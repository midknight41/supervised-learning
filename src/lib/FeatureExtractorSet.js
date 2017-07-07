class FeatureExtractorSet {

  constructor(featureExtractors) {

    this.featureExtractors_ = featureExtractors;

  }

  get featureExtractors() { return this.featureExtractors_; }

  serialize() {

    const result = [];

    for (const feature of this.featureExtractors_) {

      const item = { name: feature.name };
      if (feature.modifier !== undefined) item.modifier = feature.modifier;

      result.push(item);

    }

    return result;
  }

}

exports.FeatureExtractorSet = FeatureExtractorSet;
