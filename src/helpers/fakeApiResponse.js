// @flow
const fakePrediction = {
  category: { probability: 1, value: "food" },
  date: {
    iso: "2017-03-14",
    probability: 0.99,
    raw: "03-14-2017",
    segmentation: {
      bounding_box: [
        [0.6, 0.25],
        [0.7, 0.25],
        [0.7, 0.3],
        [0.6, 0.3],
      ],
    },
  },
  locale: {
    country: "US",
    currency: "USD",
    language: "en",
    probability: 0.9,
    value: "en-US",
  },
  orientation: { degrees: 0, probability: 1 },
  taxes: [],
  time: {
    iso: "13:27",
    probability: 1,
    raw: "1:27 PM",
    segmentation: {
      bounding_box: [
        [0.3, 0.26],
        [0.375, 0.26],
        [0.375, 0.28],
        [0.3, 0.28],
      ],
    },
  },
  total: {
    amount: 12.34,
    probability: 0.99,
    segmentation: {
      bounding_box: [
        [0.583, 0.555],
        [0.7, 0.555],
        [0.7, 0.589],
        [0.583, 0.589],
      ],
    },
  },
}

export const fakeResponse = {
  details: {
    call_id: "a1001ab0-12a0-12a0-a001-123456abcd00",
    computation_time: 0.35,
    date_started: "2020-05-01T12:00:01+00:00",
    n_inputs: 1,
    version: "2.1",
  },
  inputs_id: ["10000abc-0a00-00ab-0a0a-00a000a000a0"],
  inputs_name: ["1000000a-0aa0-00aa-a000-0a000a00a000.jpg"],
  predictions: [fakePrediction, fakePrediction],
}
