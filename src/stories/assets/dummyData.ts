import { v4 as uuidv4 } from 'uuid'

export const DUMMY_SHAPES = [
  {
    id: uuidv4(),
    coordinates: [
      [0.479, 0.172],
      [0.611, 0.172],
      [0.611, 0.196],
      [0.479, 0.196],
    ],
  },
  {
    id: uuidv4(),
    coordinates: [
      [0.394, 0.068],
      [0.477, 0.068],
      [0.477, 0.087],
      [0.394, 0.087],
    ],
  },
  {
    id: uuidv4(),
    coordinates: [
      [0.17, 0.647],
      [0.719, 0.647],
      [0.719, 0.675],
      [0.17, 0.675],
    ],
  },
  {
    id: uuidv4(),
    coordinates: [
      [0.623, 0.172],
      [0.68, 0.172],
      [0.68, 0.189],
      [0.623, 0.189],
    ],
  },
  {
    id: uuidv4(),
    coordinates: [
      [0.564, 0.614],
      [0.725, 0.614],
      [0.725, 0.644],
      [0.564, 0.644],
    ],
  },
]

export const DUMMY_SHAPES_COLLECTION = [
  [
    {
      id: uuidv4(),
      coordinates: [
        [0.354, 0.498],
        [0.544, 0.498],
        [0.544, 0.518],
        [0.354, 0.518],
      ],
    },
    {
      id: uuidv4(),
      coordinates: [
        [0.351, 0.384],
        [0.588, 0.384],
        [0.588, 0.404],
        [0.351, 0.404],
      ],
    },
    {
      id: uuidv4(),
      coordinates: [
        [0.448, 0.642],
        [0.73, 0.642],
        [0.73, 0.664],
        [0.448, 0.664],
      ],
    },
  ],
  [
    {
      id: uuidv4(),
      coordinates: [
        [0.479, 0.206],
        [0.605, 0.206],
        [0.605, 0.229],
        [0.479, 0.229],
      ],
    },
    {
      id: uuidv4(),
      coordinates: [
        [0.4, 0.113],
        [0.479, 0.113],
        [0.479, 0.132],
        [0.4, 0.132],
      ],
    },
    {
      id: uuidv4(),
      coordinates: [
        [0.186, 0.631],
        [0.708, 0.631],
        [0.708, 0.656],
        [0.186, 0.656],
      ],
    },
    {
      id: uuidv4(),
      coordinates: [
        [0.615, 0.206],
        [0.671, 0.206],
        [0.671, 0.222],
        [0.615, 0.222],
      ],
    },
  ],
]

export const API_RESPONSE = {
  call: {
    endpoint: { name: 'expense_receipts', version: '3.0' },
    finished_at: '2020-11-27T10:17:49+00:00',
    id: '05e04843-b972-4e2f-8924-5afe7b0f0c84',
    n_documents: 1,
    n_inputs: 1,
    processing_time: 1.201,
    started_at: '2020-11-27T10:17:48+00:00',
  },
  documents: [
    { id: 'b54dbd0c-88cd-4c05-a542-0ea45bc1fdcd', name: 'image.jpg' },
  ],
  predictions: [
    {
      category: { probability: 0.99, value: 'food' },
      date: {
        probability: 0.99,
        raw: '26-Feb-2016',
        segmentation: {
          bounding_box: [
            [0.479, 0.173],
            [0.613, 0.173],
            [0.613, 0.197],
            [0.479, 0.197],
          ],
        },
        value: '2016-02-26',
      },
      locale: {
        country: 'GB',
        currency: 'GBP',
        language: 'en',
        probability: 0.82,
        value: 'en-GB',
      },
      orientation: { degrees: 0, probability: 0.99 },
      supplier: {
        probability: 0.71,
        segmentation: {
          bounding_box: [
            [0.394, 0.068],
            [0.477, 0.068],
            [0.477, 0.087],
            [0.394, 0.087],
          ],
        },
        value: 'CLACHAN',
      },
      taxes: [
        {
          code: 'N/A',
          probability: 0.98,
          rate: 20,
          segmentation: {
            bounding_box: [
              [0.19, 0.402],
              [0.698, 0.402],
              [0.698, 0.432],
              [0.19, 0.432],
            ],
          },
          value: 1.7,
        },
      ],
      time: {
        probability: 0.99,
        raw: '15:20',
        segmentation: {
          bounding_box: [
            [0.62, 0.173],
            [0.681, 0.173],
            [0.681, 0.191],
            [0.62, 0.191],
          ],
        },
        value: '15:20',
      },
      total_incl: {
        probability: 0.99,
        segmentation: {
          bounding_box: [
            [0.549, 0.619],
            [0.715, 0.619],
            [0.715, 0.642],
            [0.549, 0.642],
          ],
        },
        value: 10.2,
      },
    },
  ],
}

export const MINDEE_VISION_DATA = {
  all_words: [
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.378, 0.946],
          [0.425, 0.946],
          [0.425, 0.968],
          [0.378, 0.968],
        ],
      },
      text: '232',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.316, 0.946],
          [0.364, 0.946],
          [0.364, 0.969],
          [0.316, 0.969],
        ],
      },
      text: 'VAT',
    },
    {
      probability: 0.96,
      segmentation: {
        bounding_box: [
          [0.44, 0.945],
          [0.484, 0.945],
          [0.484, 0.968],
          [0.44, 0.968],
        ],
      },
      text: '153',
    },
    {
      probability: 0.96,
      segmentation: {
        bounding_box: [
          [0.5, 0.944],
          [0.545, 0.944],
          [0.545, 0.967],
          [0.5, 0.967],
        ],
      },
      text: '895',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.378, 0.91],
          [0.438, 0.91],
          [0.438, 0.932],
          [0.378, 0.932],
        ],
      },
      text: '0207',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.304, 0.91],
          [0.362, 0.91],
          [0.362, 0.934],
          [0.304, 0.934],
        ],
      },
      text: 'TEL:',
    },
    {
      probability: 0.96,
      segmentation: {
        bounding_box: [
          [0.454, 0.909],
          [0.499, 0.909],
          [0.499, 0.932],
          [0.454, 0.932],
        ],
      },
      text: '494',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.514, 0.908],
          [0.573, 0.908],
          [0.573, 0.932],
          [0.514, 0.932],
        ],
      },
      text: '0834',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.379, 0.851],
          [0.484, 0.851],
          [0.484, 0.868],
          [0.379, 0.868],
        ],
      },
      text: 'Clachan',
    },
    {
      probability: 0.97,
      segmentation: {
        bounding_box: [
          [0.366, 0.813],
          [0.411, 0.813],
          [0.411, 0.834],
          [0.366, 0.834],
        ],
      },
      text: 'you',
    },
    {
      probability: 0.94,
      segmentation: {
        bounding_box: [
          [0.281, 0.809],
          [0.352, 0.809],
          [0.352, 0.831],
          [0.281, 0.831],
        ],
      },
      text: 'Thank',
    },
    {
      probability: 0.96,
      segmentation: {
        bounding_box: [
          [0.425, 0.808],
          [0.469, 0.808],
          [0.469, 0.83],
          [0.425, 0.83],
        ],
      },
      text: 'for',
    },
    {
      probability: 0.91,
      segmentation: {
        bounding_box: [
          [0.481, 0.807],
          [0.601, 0.807],
          [0.601, 0.832],
          [0.481, 0.832],
        ],
      },
      text: 'visiting',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.163, 0.714],
          [0.206, 0.714],
          [0.206, 0.735],
          [0.163, 0.735],
        ],
      },
      text: 'VAT',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.275, 0.713],
          [0.316, 0.713],
          [0.316, 0.734],
          [0.275, 0.734],
        ],
      },
      text: '153',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.217, 0.713],
          [0.26, 0.713],
          [0.26, 0.735],
          [0.217, 0.735],
        ],
      },
      text: '232',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.329, 0.712],
          [0.371, 0.712],
          [0.371, 0.733],
          [0.329, 0.733],
        ],
      },
      text: '895',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.275, 0.686],
          [0.316, 0.686],
          [0.316, 0.704],
          [0.275, 0.704],
        ],
      },
      text: 'no.',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.165, 0.684],
          [0.261, 0.684],
          [0.261, 0.707],
          [0.165, 0.707],
        ],
      },
      text: 'Receipt',
    },
    {
      probability: 0.88,
      segmentation: {
        bounding_box: [
          [0.33, 0.68],
          [0.429, 0.68],
          [0.429, 0.704],
          [0.33, 0.704],
        ],
      },
      text: '54/7500',
    },
    {
      probability: 0.94,
      segmentation: {
        bounding_box: [
          [0.17, 0.656],
          [0.214, 0.656],
          [0.214, 0.675],
          [0.17, 0.675],
        ],
      },
      text: '20%',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.225, 0.655],
          [0.269, 0.655],
          [0.269, 0.674],
          [0.225, 0.674],
        ],
      },
      text: 'VAT',
    },
    {
      probability: 0.91,
      segmentation: {
        bounding_box: [
          [0.281, 0.652],
          [0.389, 0.652],
          [0.389, 0.674],
          [0.281, 0.674],
        ],
      },
      text: 'included',
    },
    {
      probability: 0.66,
      segmentation: {
        bounding_box: [
          [0.646, 0.647],
          [0.719, 0.647],
          [0.719, 0.669],
          [0.646, 0.669],
        ],
      },
      text: '£1.70',
    },
    {
      probability: 0.84,
      segmentation: {
        bounding_box: [
          [0.17, 0.626],
          [0.297, 0.626],
          [0.297, 0.647],
          [0.17, 0.647],
        ],
      },
      text: 'Card',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.301, 0.624],
          [0.491, 0.624],
          [0.491, 0.647],
          [0.301, 0.647],
        ],
      },
      text: 'Payment',
    },
    {
      probability: 0.59,
      segmentation: {
        bounding_box: [
          [0.549, 0.62],
          [0.715, 0.62],
          [0.715, 0.642],
          [0.549, 0.642],
        ],
      },
      text: '£10.20',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.23, 0.569],
          [0.414, 0.569],
          [0.414, 0.593],
          [0.23, 0.593],
        ],
      },
      text: 'Payment',
    },
    {
      probability: 0.91,
      segmentation: {
        bounding_box: [
          [0.44, 0.567],
          [0.625, 0.567],
          [0.625, 0.589],
          [0.44, 0.589],
        ],
      },
      text: 'Receipt',
    },
    {
      probability: 0.94,
      segmentation: {
        bounding_box: [
          [0.188, 0.49],
          [0.312, 0.49],
          [0.312, 0.51],
          [0.188, 0.51],
        ],
      },
      text: 'Total',
    },
    {
      probability: 0.97,
      segmentation: {
        bounding_box: [
          [0.58, 0.487],
          [0.588, 0.487],
          [0.588, 0.496],
          [0.58, 0.496],
        ],
      },
      text: '1',
    },
    {
      probability: 0.74,
      segmentation: {
        bounding_box: [
          [0.6, 0.486],
          [0.623, 0.486],
          [0.623, 0.504],
          [0.6, 0.504],
        ],
      },
      text: '0',
    },
    {
      probability: 0.86,
      segmentation: {
        bounding_box: [
          [0.634, 0.484],
          [0.703, 0.484],
          [0.703, 0.507],
          [0.634, 0.507],
        ],
      },
      text: '.20',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.24, 0.44],
          [0.281, 0.44],
          [0.281, 0.458],
          [0.24, 0.458],
        ],
      },
      text: 'VAT',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.189, 0.44],
          [0.229, 0.44],
          [0.229, 0.46],
          [0.189, 0.46],
        ],
      },
      text: '20%',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.291, 0.439],
          [0.354, 0.439],
          [0.354, 0.457],
          [0.291, 0.457],
        ],
      },
      text: 'Total',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.636, 0.432],
          [0.698, 0.432],
          [0.698, 0.45],
          [0.636, 0.45],
        ],
      },
      text: '10.20',
    },
    {
      probability: 0.94,
      segmentation: {
        bounding_box: [
          [0.241, 0.414],
          [0.281, 0.414],
          [0.281, 0.432],
          [0.241, 0.432],
        ],
      },
      text: 'VAT',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.19, 0.414],
          [0.23, 0.414],
          [0.23, 0.432],
          [0.19, 0.432],
        ],
      },
      text: '20%',
    },
    {
      probability: 0.79,
      segmentation: {
        bounding_box: [
          [0.641, 0.403],
          [0.698, 0.403],
          [0.698, 0.424],
          [0.641, 0.424],
        ],
      },
      text: '1.70',
    },
    {
      probability: 0.96,
      segmentation: {
        bounding_box: [
          [0.294, 0.389],
          [0.331, 0.389],
          [0.331, 0.407],
          [0.294, 0.407],
        ],
      },
      text: 'Net',
    },
    {
      probability: 0.94,
      segmentation: {
        bounding_box: [
          [0.244, 0.389],
          [0.282, 0.389],
          [0.282, 0.407],
          [0.244, 0.407],
        ],
      },
      text: 'VAT',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.191, 0.389],
          [0.233, 0.389],
          [0.233, 0.407],
          [0.191, 0.407],
        ],
      },
      text: '20%',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.641, 0.38],
          [0.695, 0.38],
          [0.695, 0.399],
          [0.641, 0.399],
        ],
      },
      text: '8.50',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.307, 0.34],
          [0.371, 0.34],
          [0.371, 0.359],
          [0.307, 0.359],
        ],
      },
      text: 'Drink',
    },
    {
      probability: 0.94,
      segmentation: {
        bounding_box: [
          [0.259, 0.34],
          [0.299, 0.34],
          [0.299, 0.359],
          [0.259, 0.359],
        ],
      },
      text: 'And',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.198, 0.34],
          [0.249, 0.34],
          [0.249, 0.359],
          [0.198, 0.359],
        ],
      },
      text: 'Food',
    },
    {
      probability: 0.89,
      segmentation: {
        bounding_box: [
          [0.568, 0.333],
          [0.629, 0.333],
          [0.629, 0.352],
          [0.568, 0.352],
        ],
      },
      text: '10.20',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.37, 0.316],
          [0.456, 0.316],
          [0.456, 0.334],
          [0.37, 0.334],
        ],
      },
      text: 'Summary',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.297, 0.316],
          [0.36, 0.316],
          [0.36, 0.337],
          [0.297, 0.337],
        ],
      },
      text: 'Group',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.198, 0.316],
          [0.286, 0.316],
          [0.286, 0.334],
          [0.198, 0.334],
        ],
      },
      text: 'Product',
    },
    {
      probability: 0.9,
      segmentation: {
        bounding_box: [
          [0.311, 0.273],
          [0.41, 0.273],
          [0.41, 0.29],
          [0.311, 0.29],
        ],
      },
      text: 'Meantime',
    },
    {
      probability: 0.97,
      segmentation: {
        bounding_box: [
          [0.239, 0.272],
          [0.251, 0.272],
          [0.251, 0.289],
          [0.239, 0.289],
        ],
      },
      text: '2',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.419, 0.269],
          [0.469, 0.269],
          [0.469, 0.287],
          [0.419, 0.287],
        ],
      },
      text: 'Pale',
    },
    {
      probability: 0.9,
      segmentation: {
        bounding_box: [
          [0.626, 0.262],
          [0.686, 0.262],
          [0.686, 0.28],
          [0.626, 0.28],
        ],
      },
      text: '10.20',
    },
    {
      probability: 0.35,
      segmentation: {
        bounding_box: [
          [0.539, 0.22],
          [0.575, 0.22],
          [0.575, 0.236],
          [0.539, 0.236],
        ],
      },
      text: 'AcC',
    },
    {
      probability: 0.94,
      segmentation: {
        bounding_box: [
          [0.585, 0.219],
          [0.625, 0.219],
          [0.625, 0.235],
          [0.585, 0.235],
        ],
      },
      text: 'No:',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.634, 0.217],
          [0.681, 0.217],
          [0.681, 0.235],
          [0.634, 0.235],
        ],
      },
      text: '1532',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.21, 0.181],
          [0.28, 0.181],
          [0.28, 0.201],
          [0.21, 0.201],
        ],
      },
      text: 'Sylvia',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.479, 0.178],
          [0.504, 0.178],
          [0.504, 0.195],
          [0.479, 0.195],
        ],
      },
      text: '26',
    },
    {
      probability: 0.92,
      segmentation: {
        bounding_box: [
          [0.511, 0.174],
          [0.55, 0.174],
          [0.55, 0.194],
          [0.511, 0.194],
        ],
      },
      text: 'Feb',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.559, 0.173],
          [0.61, 0.173],
          [0.61, 0.192],
          [0.559, 0.192],
        ],
      },
      text: '2016',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.62, 0.172],
          [0.679, 0.172],
          [0.679, 0.19],
          [0.62, 0.19],
        ],
      },
      text: '15:20',
    },
    {
      probability: 0.79,
      segmentation: {
        bounding_box: [
          [0.21, 0.161],
          [0.352, 0.161],
          [0.352, 0.179],
          [0.21, 0.179],
        ],
      },
      text: 'ZA177466-POS',
    },
    {
      probability: 0.95,
      segmentation: {
        bounding_box: [
          [0.361, 0.16],
          [0.386, 0.16],
          [0.386, 0.178],
          [0.361, 0.178],
        ],
      },
      text: '03',
    },
    {
      probability: 0.78,
      segmentation: {
        bounding_box: [
          [0.396, 0.114],
          [0.434, 0.114],
          [0.434, 0.131],
          [0.396, 0.131],
        ],
      },
      text: 'W1B',
    },
    {
      probability: 0.85,
      segmentation: {
        bounding_box: [
          [0.443, 0.111],
          [0.479, 0.111],
          [0.479, 0.129],
          [0.443, 0.129],
        ],
      },
      text: '5QH',
    },
    {
      probability: 0.94,
      segmentation: {
        bounding_box: [
          [0.34, 0.097],
          [0.364, 0.097],
          [0.364, 0.114],
          [0.34, 0.114],
        ],
      },
      text: '34',
    },
    {
      probability: 0.9,
      segmentation: {
        bounding_box: [
          [0.371, 0.091],
          [0.456, 0.091],
          [0.456, 0.111],
          [0.371, 0.111],
        ],
      },
      text: 'Kingley',
    },
    {
      probability: 0.93,
      segmentation: {
        bounding_box: [
          [0.465, 0.086],
          [0.532, 0.086],
          [0.532, 0.107],
          [0.465, 0.107],
        ],
      },
      text: 'Street',
    },
    {
      probability: 0.71,
      segmentation: {
        bounding_box: [
          [0.396, 0.068],
          [0.477, 0.068],
          [0.477, 0.089],
          [0.396, 0.089],
        ],
      },
      text: 'clachan',
    },
  ],
}
