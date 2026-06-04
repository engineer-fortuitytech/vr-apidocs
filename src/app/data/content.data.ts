export interface FieldValue {
  value: string;
  description: string;
}

export interface SampleRow {
  id: string;
  title: string;
  description: string;
  method: string;
  path: string;
  request: string;
  response: string;
  expanded: boolean;
}

export interface PageContent {
  sampleRows: SampleRow[];
  roofShapeValues: FieldValue[];
  roofCoverValues: FieldValue[];
  exteriorMaterialValues: FieldValue[];
  deductibleOptions?: FieldValue[];
}

export interface MainFeature {
  title: string;
  description: string;
}

export interface MainSubstep {
  label: string;
  endpoint?: string;
}

export interface MainStep {
  title: string;
  description: string;
  code?: string;
  substeps?: MainSubstep[];
}

export interface MainHero {
  badge: string;
  title: string;
  description: string;
  tags: string[];
}

export interface MainContent {
  hero: MainHero;
  steps: MainStep[];
  features: MainFeature[];
  useCases: MainFeature[];
}

export interface AllContent {
  main: MainContent;
  bop: PageContent;
  cpp: PageContent;
  risk: PageContent;
}

export const ROOF_SHAPE_VALUES: FieldValue[] = [
  { value: 'Flat', description: 'Horizontal or very low-slope roof' },
  { value: 'Gable end without bracing', description: 'Two-sided pitched roof meeting at a central ridge' },
  { value: 'Gable end with bracing', description: 'Two-sided pitched roof meeting at a central ridge with additional structural support' },
  { value: 'Hip', description: 'All four sides slope downward to the walls' },
  { value: 'Mansard', description: 'Double-pitched roof with a steep lower slope' },
  { value: 'Gambrel', description: 'Barn-style double-pitched roof' },
  { value: 'Stepped', description: 'Multiple flat sections at different heights' },
  { value: 'Shed', description: 'Single sloping plane, one ridge' },
  { value: 'Pyramid', description: 'Pyramid-shaped roof structure' },
  { value: 'Complex', description: 'Complex roof structure with multiple intersecting planes' },
];

export const ROOF_COVER_VALUES: FieldValue[] = [
  { value: 'Asphalt Shingles', description: 'Standard asphalt composition shingles' },
  { value: 'Built-up roof without gravel', description: 'Multiple plies of bitumen without gravel surfacing' },
  { value: 'Built-up roof with gravel', description: 'Multiple plies of bitumen with aggregate surfacing' },
  { value: 'Light Metal Panels', description: 'Standing seam or corrugated metal panels' },
  { value: 'Standing Seam Metal Roofs', description: 'Metal roofs with interlocking seams' },
  { value: 'Hurricane Wind-Rated Roof Coverings', description: 'Roof coverings that meet specific wind resistance standards' },
  { value: 'Single Ply Membrane', description: 'Thermoplastic polyolefin membrane' },
  { value: 'Single Ply Membrane Ballasted', description: 'Polyvinyl chloride membrane' },
  { value: 'Clay/Concrete Tiles', description: 'Clay or concrete tile' },
  { value: 'Wooden Shingles', description: 'Split or sawn wood roofing material' },
  { value: 'Slate', description: 'Natural or synthetic slate tiles' },
];

export const EXTERIOR_MATERIAL_VALUES: FieldValue[] = [
  { value: 'Frame', description: 'Combustible wood frame construction (ISO Class 1)' },
  { value: 'Joisted Masonry', description: 'Masonry exterior walls with wood/combustible floor and roof (ISO Class 2)' },
  { value: 'Light Metal Frame', description: 'Metal frame with non-combustible exterior but combustible floor/roof (ISO Class 3A)' },
  { value: 'Non-combustible', description: 'Non-combustible or slow-burning materials — steel frame (ISO Class 3)' },
  { value: 'Masonry Non-Combustible', description: 'Masonry walls with non-combustible floor and roof (ISO Class 4)' },
  { value: 'Modified Fire Resistive', description: 'Fire-resistive construction with some combustible elements (ISO Class 5)' },
  { value: 'Fire Resistive', description: 'Reinforced concrete or protected steel — fully fire-resistive (ISO Class 6)' },
];

export const CPP_DEDUCTIBLE_OPTIONS: FieldValue[] = [
  { value: 'All Other Wind Deductible', description: '$10,000, $25,000, $50,000, $100,000' },
  { value: 'Named Storm Deductible', description: '3%, 5%, 10%' },
  { value: 'All Other Perils Deductible', description: '$1,000, $2,500, $5,000, $10,000' }
];

export const BOP_DEDUCTIBLE_OPTIONS: FieldValue[] = [
  { value: 'Windstorm or Hail Deductible', description: 'None, 1%, 2%, 5%, 10%' },
  { value: 'Named Storm Deductible', description: '3%, 5%, 10%' },
  { value: 'All Other Perils Deductible', description: '$2,500, $5,000, $7,500, $10,000' }
];

export const BOP_SAMPLE_ROWS: SampleRow[] = [
  {
    id: 'occupancy-search',
    title: 'Search Occupancy',
    description: 'Find class IDs, GL and NAICS codes for a business description.',
    method: 'POST',
    path: '/v1/Occupancy/SearchOccupancyData',
    request: `POST /v1/Occupancy/SearchOccupancyData
{
  "searchText": "pizza restaurant",
  "numResults": 3,
  "lineOfBusiness": "BOP"
}`,
    response: `{
  "results": [
    {
      "score": 425.68,
      "classId": "8cdb763a94e373b056da0f48b882c72b3f9014447586fb29f9fedb91d443e7f1",
      "occupancy_class": "Restaurant-Limited-Cooking",
      "occupancy_category": "Pizza Shops",
      "licenseClass": ["BOP", "CPP"],
      "eligible": "Yes",
      "classification": {
        "id": "Pizza Shops",
        "description": "Pizza Shops",
        "glClassCode": "9211",
        "naicsCode": "722210",
        "eligible": "Yes",
        "maxLiabLimit": "1000000/1000000/1000000",
        "occupantLiabilityBase": "SALES"
      }
    }
  ]
}`,
    expanded: false
  },
  {
    id: 'check-appetite',
    title: 'Check Appetite (BOP)',
    description: 'Submit a location with occupancies to determine BOP underwriting appetite.',
    method: 'POST',
    path: '/v1/BOPAppetiteChecker/CheckAppetite',
    request: `POST /v1/BOPAppetiteChecker/CheckAppetite
{
  "businessName": "Main Street Pizza",
  "state": "FL",
  "effectiveDate": "2026-06-01",
  "locations": [
    {
      "locationNumber": 1,
      "buildingNumber": 1,
      "buildingDescription": "Restaurant Building",
      "yearBuilt": 2005,
      "tiv": 850000,
      "constructionType": "Joisted Masonry",
      "roofReplacementYear": 2018,
      "roofCover": "Built-up roof without gravel",
      "roofShape": "Flat",
      "squareFootage": 3200,
      "stories": 1,
      "occupancyType": "Restaurant",
      "classId": "8cdb763a94e373b056da0f48b882c72b3f9014447586fb29f9fedb91d443e7f1",
      "buildingAddress": {
        "street1": "450 Main St",
        "city": "Orlando",
        "state": "FL",
        "postal": "32801",
        "county": "Orange County"
      },
      "propertyCoverages": [
        { "name": "Coverage A", "description": "Building", "type": "fixed", "limit": 850000, "deductible": 0 },
        { "name": "Coverage C", "description": "Business Personal Property", "type": "fixed", "limit": 100000, "deductible": 0 }
      ]
    }
  ]
}`,
    response: `{
  "bopAppetiteCheckResult": [
    {
      "checkId": "fbed2705-598e-4378-8409-86918e081f8a",
      "underwritingIndication": "Approve",
      "quoteUrl": "https://appetitecheck-uat.fortuitytech.com/v1/BOPAppetiteChecker/GetAppetiteCheck/fbed2705-598e-4378-8409-86918e081f8a",
      "quoteUnderwriting": [
        { "decision": "Approve", "source": "TIV", "reason": "TIV: $850,000.00" },
        { "decision": "Approve", "source": "Roof Cover Step", "reason": "Built-up roof without gravel is eligible" },
        { "decision": "Approve", "source": "State Eligibility", "reason": "State Eligibility: FL" },
        { "decision": "Approve", "source": "Occupancy Type", "reason": "Occupancy Type: Restaurant" }
      ]
    }
  ]
}`,
    expanded: false
  },
  {
    id: 'create-rated-quote',
    title: 'Create Rated Quote (BOP)',
    description: 'Generate a rated BOP quote from an approved appetite check ID.',
    method: 'POST',
    path: '/v1/BOPAppetiteChecker/CreateRatedQuote',
    request: `POST /v1/BOPAppetiteChecker/CreateRatedQuote
{
  "appetiteCheckId": "fbed2705-598e-4378-8409-86918e081f8a",
  "producerId": "28543",
  "verificationQuestion": "Yes",
  "coverageType": "WNDAOP",
  "deductibles":[
    {
        "name":"Windstorm or Hail Deductible",
        "value":"1"   
    },
    {
        "name":"Named Storm Deductible",
        "value":"3"
    },
    {
        "name":"All Other Perils Deductible",
        "value":"2500"
    }
  ]
}`,
    response: `{
  "CheckId": "fbed2705-598e-4378-8409-86918e081f8a",
  "QuoteId": "QT-00007652",
  "QuoteLocation": "https://vru-uat.guidewire.net/coreapi/v5/applications/12002",
  "QuoteType": "WNDAOP",
  "QuoteOptions": [
    {
      "CoverageName": "PolicyWIND",
      "CoverageDescription": "Wind/Hail Coverage",
      "CoveragePremium": "2900.00",
      "DeductibleOptions": [
        { "DeductibleName": "Deductible1", "DeductibleAmount": "3", "DeductibleType": "percentage", "DeductibleDisplay": "3%" }
      ]
    },
    {
      "CoverageName": "PolicyAOP",
      "CoverageDescription": "All Other Perils",
      "CoveragePremium": "480.00",
      "DeductibleOptions": [
        { "DeductibleName": "Deductible1", "DeductibleAmount": "10000", "DeductibleType": "currency", "DeductibleDisplay": "$10,000.00" }
      ]
    },
    {
      "CoverageName": "Cyber",
      "CoverageDescription": "Cyber Liability",
      "CoveragePremium": "224.00",
      "DeductibleOptions": [
        { "DeductibleName": "Deductible1", "DeductibleAmount": "1000", "DeductibleType": "currency", "DeductibleDisplay": "$1,000.00" }
      ]
    }
  ]
}`,
    expanded: false
  }
];

export const CPP_SAMPLE_ROWS: SampleRow[] = [
  {
    id: 'occupancy-search',
    title: 'Search Occupancy',
    description: 'Find class IDs, GL and NAICS codes for a business description.',
    method: 'POST',
    path: '/v1/Occupancy/SearchOccupancyData',
    request: `POST /v1/Occupancy/SearchOccupancyData
{
  "searchText": "hardware store",
  "numResults": 3,
  "lineOfBusiness": "CPP"
}`,
    response: `{
  "results": [
    {
      "score": 410.25,
      "classId": "15c678ed6073f6386204ad7c28b228e35d885c07ab22b6b05246aa4a777d5a13",
      "occupancy_class": "Mercantile",
      "occupancy_category": "Hardware Stores",
      "licenseClass": ["CPP"],
      "eligible": "Yes",
      "classification": {
        "id": "Hardware Stores",
        "description": "Hardware Stores",
        "glClassCode": "10111",
        "naicsCode": "444130",
        "eligible": "Yes",
        "cppOccupancy": "Mercantile",
        "cppClass": "Hardware Stores"
      }
    }
  ]
}`,
    expanded: false
  },
  {
    id: 'check-appetite',
    title: 'Check Appetite (CPP)',
    description: 'Submit a building and occupancy to determine CPP underwriting appetite.',
    method: 'POST',
    path: '/v2/AppetiteChecker/CheckAppetite',
    request: `POST /v2/AppetiteChecker/CheckAppetite
{
  "businessName": "Ace Hardware - Main St",
  "state": "TX",
  "effectiveDate": "2026-06-01",
  "buildings": [
    {
      "locationNumber": 1,
      "buildingNumber": 1,
      "buildingDescription": "Main Store",
      "yearBuilt": 1998,
      "tiv": 1500000,
      "constructionType": "Masonry Non-Combustible",
      "roofReplacementYear": 2015,
      "roofCover": "Metal",
      "roofShape": "Flat",
      "squareFootage": 8500,
      "stories": 1,
      "occupancyType": "Mercantile",
      "classId": "15c678ed6073f6386204ad7c28b228e35d885c07ab22b6b05246aa4a777d5a13",
      "buildingAddress": {
        "street1": "1200 Main St",
        "city": "Austin",
        "state": "TX",
        "postal": "78701",
        "county": "Travis County"
      },
      "propertyCoverages": [
        { "name": "Coverage A", "description": "Building", "type": "fixed", "limit": 1500000, "deductible": 0 },
        { "name": "Coverage C", "description": "Business Personal Property", "type": "fixed", "limit": 250000, "deductible": 0 }
      ]
    }
  ]
}`,
    response: `{
  "cppAppetiteCheckResult": [
    {
      "checkId": "4923910d-3861-4ecc-b78a-fe724bd16bd1",
      "underwritingIndication": "Approve",
      "quoteUrl": "https://appetitecheck-uat.fortuitytech.com/v2/AppetiteChecker/GetAppetiteCheck/4923910d-3861-4ecc-b78a-fe724bd16bd1",
      "quoteUnderwriting": [
        { "decision": "Approve", "source": "TIV", "reason": "TIV: $1,500,000.00" },
        { "decision": "Approve", "source": "Roof Cover Step", "reason": "Metal roof cover is eligible" },
        { "decision": "Approve", "source": "State Eligibility", "reason": "State Eligibility: TX" }
      ],
      "buildings": [
        {
          "underwritingIndication": "Approve",
          "building": { "buildingId": "b1d2c3e4-...", "buildingDescription": "Main Store" },
          "underwritingReasons": [
            { "decision": "Approve", "source": "Request Validation Step", "reason": "Request is valid" }
          ]
        }
      ]
    }
  ]
}`,
    expanded: false
  },
  {
    id: 'create-rated-quote',
    title: 'Create Rated Quote (CPP)',
    description: 'Generate a rated CPP quote from an approved appetite check ID.',
    method: 'POST',
    path: '/v2/AppetiteChecker/CreateRatedQuote',
    request: `POST /v2/AppetiteChecker/CreateRatedQuote
{
  "appetiteCheckId": "4923910d-3861-4ecc-b78a-fe724bd16bd1",
  "producerId": "19712",
  "verificationQuestion": "Yes",
  "coverageType": "WNDAOP",
  "deductibles":[
    {
        "name":"All Other Wind Deductible",
        "value":"10000"   
    },
    {
        "name":"Named Storm Deductible",
        "value":"3"
    },
    {
        "name":"All Other Perils Deductible",
        "value":"2500"
    }
  ]
}`,
    response: `{
  "CheckId": "4923910d-3861-4ecc-b78a-fe724bd16bd1",
  "QuoteId": "QT-00009811",
  "QuoteLocation": "https://vru-uat.guidewire.net/coreapi/v5/applications/13005",
  "QuoteType": "WNDAOP",
  "QuoteOptions": [
    {
      "CoverageName": "PolicyWIND",
      "CoverageDescription": "Wind/Hail Coverage",
      "CoveragePremium": "1840.00",
      "DeductibleOptions": [
        { "DeductibleName": "Deductible1", "DeductibleAmount": "3", "DeductibleType": "percentage", "DeductibleDisplay": "3%" }
      ]
    },
    {
      "CoverageName": "PolicyAOP",
      "CoverageDescription": "All Other Perils",
      "CoveragePremium": "390.00",
      "DeductibleOptions": [
        { "DeductibleName": "Deductible1", "DeductibleAmount": "5000", "DeductibleType": "currency", "DeductibleDisplay": "$5,000.00" }
      ]
    }
  ]
}`,
    expanded: false
  }
];

export const RISK_SAMPLE_ROWS: SampleRow[] = [
  {
    id: 'occupancy-search',
    title: 'Search Occupancy',
    description: 'Find class IDs, GL and NAICS codes for a business description.',
    method: 'POST',
    path: '/v1/Occupancy/SearchOccupancyData',
    request: `POST /v1/Occupancy/SearchOccupancyData
{
  "searchText": "auto repair shop",
  "numResults": 3,
  "lineOfBusiness": "ALL"
}`,
    response: `{
  "results": [
    {
      "score": 418.44,
      "classId": "a3f91cc2e08b45d27f6bc93841de0f2a7c5b12e3d94801fabc7652091e34d87f",
      "occupancy_class": "Mercantile",
      "occupancy_category": "Auto Repair Shops",
      "licenseClass": ["CPP"],
      "eligible": "Yes",
      "classification": {
        "id": "Auto Repair Shops",
        "description": "Auto Repair Shops",
        "glClassCode": "10101",
        "naicsCode": "811111",
        "eligible": "Yes",
        "cppOccupancy": "Mercantile",
        "cppClass": "Auto Repair Shops"
      }
    }
  ]
}`,
    expanded: false
  },
  {
    id: 'check-appetite',
    title: 'Check Appetite (Risk)',
    description: 'Submit locations with buildings and occupancies to check risk appetite.',
    method: 'POST',
    path: '/v1/RiskAppetiteChecker/CheckAppetite',
    request: `POST /v1/RiskAppetiteChecker/CheckAppetite
{
  "BusinessName": "Central Auto Repair",
  "State": "TX",
  "EffectiveDate": "2026-06-01",
  "Locations": [
    {
      "LocationName": "Location 1",
      "Operations": [
        {
          "LocationNumber": 1,
          "BuildingNumber": 1,
          "BuildingDescription": "Service Bay",
          "YearBuilt": 2000,
          "TIV": 1200000,
          "ConstructionType": "Masonry Non-Combustible",
          "RoofReplacementYear": 2012,
          "RoofCover": "Metal",
          "RoofShape": "Gabled",
          "SquareFootage": 5000,
          "Stories": 1,
          "OccupancyType": "Mercantile",
          "BuildingAddress": {
            "Street1": "800 Commerce Blvd",
            "City": "Houston",
            "State": "TX",
            "Postal": "77002",
            "County": "Harris County"
          },
          "BusinessClassifications": [
            {
              "ClassId": "a3f91cc2e08b45d27f6bc93841de0f2a7c5b12e3d94801fabc7652091e34d87f",
              "NumberOfEmployees": 8,
              "LiabilityBasisType": "Payroll",
              "LiabilityBasisAmount": 420000
            }
          ],
          "PropertyCoverages": [
            { "Name": "Coverage A", "Description": "Building", "Type": "fixed", "Limit": 1200000, "Deductible": 0 },
            { "Name": "Coverage C", "Description": "Business Personal Property", "Type": "fixed", "Limit": 150000, "Deductible": 0 }
          ]
        }
      ]
    }
  ]
}`,
    response: `{
  "riskAppetiteCheckId": "c7d2a1b4-3f8e-4c91-b205-d9e14f062378",
  "cppAppetiteCheckResult": [
    {
      "checkId": "c7d2a1b4-3f8e-4c91-b205-d9e14f062378",
      "underwritingIndication": "Approve",
      "quoteUrl": "https://appetitecheck-uat.fortuitytech.com/v1/RiskAppetiteChecker/GetAppetiteCheck/c7d2a1b4-3f8e-4c91-b205-d9e14f062378",
      "quoteUnderwriting": [
        { "decision": "Approve", "source": "TIV", "reason": "TIV: $1,200,000.00" },
        { "decision": "Approve", "source": "Roof Cover Step", "reason": "Metal roof cover is eligible" },
        { "decision": "Approve", "source": "Roof Shape Step", "reason": "Gabled roof shape is eligible" },
        { "decision": "Approve", "source": "State Eligibility", "reason": "State Eligibility: TX" }
      ],
      "buildings": [
        {
          "underwritingIndication": "Approve",
          "building": { "buildingId": "d1e2f3a4-...", "buildingDescription": "Service Bay" },
          "underwritingReasons": [
            { "decision": "Approve", "source": "Request Validation Step", "reason": "Request is valid" },
            { "decision": "Approve", "source": "Occupancy Type", "reason": "Occupancy Type: Mercantile" }
          ]
        }
      ]
    }
  ]
}`,
    expanded: false
  },
  {
    id: 'create-rated-quote',
    title: 'Create Rated Quote (Risk)',
    description: 'Generate a rated quote from an approved risk appetite check ID.',
    method: 'POST',
    path: '/v1/RiskAppetiteChecker/CreateRatedQuote',
    request: `POST /v1/RiskAppetiteChecker/CreateRatedQuote
{
  "appetiteCheckId": "c7d2a1b4-3f8e-4c91-b205-d9e14f062378",
  "producerId": "19712",
  "verificationQuestion": "Yes",
  "coverageType": "WNDAOP"
}`,
    response: `{
  "CheckId": "c7d2a1b4-3f8e-4c91-b205-d9e14f062378",
  "QuoteId": "QT-00008744",
  "QuoteLocation": "https://vru-uat.guidewire.net/coreapi/v5/applications/12558",
  "QuoteType": "WNDAOP",
  "QuoteOptions": [
    {
      "CoverageName": "PolicyWIND",
      "CoverageDescription": "Wind/Hail Coverage",
      "CoveragePremium": "2240.00",
      "DeductibleOptions": [
        { "DeductibleName": "Deductible1", "DeductibleAmount": "3", "DeductibleType": "percentage", "DeductibleDisplay": "3%" }
      ]
    },
    {
      "CoverageName": "PolicyAOP",
      "CoverageDescription": "All Other Perils",
      "CoveragePremium": "520.00",
      "DeductibleOptions": [
        { "DeductibleName": "Deductible1", "DeductibleAmount": "5000", "DeductibleType": "currency", "DeductibleDisplay": "$5,000.00" }
      ]
    },
    {
      "CoverageName": "PolicyEB",
      "CoverageDescription": "Equipment Breakdown",
      "CoveragePremium": "25.00",
      "DeductibleOptions": [
        { "DeductibleName": "Deductible1", "DeductibleAmount": "5000", "DeductibleType": "currency", "DeductibleDisplay": "$5,000.00" }
      ]
    }
  ]
}`,
    expanded: false
  }
];

export const MAIN_CONTENT: MainContent = {
  hero: {
    badge: 'Breeze API',
    title: 'Integrate Breeze Commercial Insurance Products into your apps.',
    description: "The Breeze API lets you search for business classifications, request appetite checks for businesses you'd like to quote, and power builds multiple product quotes on demand. Use it from mobile, web, or backend services with a simple REST interface.",
    tags: ['REST · JSON', 'Auth: API key (header)', 'Environment: Production'],
  },
  steps: [
    {
      title: 'Get an API key',
      description: "Obtain your API key from the Velocity Risk Partner team and store it securely. You'll send it as a header on every request:",
      code: 'x-api-key: <YOUR_API_KEY>',
    },
    {
      title: 'Call endpoints from your app',
      description: "Use the REST endpoints to find business classifications, request appetite checks for businesses you'd like to quote, and create multiple quote types. The API speaks standard JSON over HTTPS.",
      substeps: [
        { label: 'Search for Occupancy using the SearchOccupancyData endpoint.', endpoint: '/v1/Occupancy/SearchOccupancyData' },
        { label: "Once you've identified the classId of the Occupancy(ies) you wish to write, add the location and Occupancy(ies) to the Check Appetite payload." },
        { label: "If your request is Approved, submit the Appetite check using the returned Check Id and your producer code to create a quote for the approved Product (e.g. BOP /v1/BOPAppetiteChecker/CreateQuoteOptions, CPP /v2/AppetiteChecker/CreateRatedQuote/)." },
      ],
    },
    {
      title: 'Handle responses gracefully',
      description: 'Responses return machine-friendly JSON plus HTTP status codes. You can plug results directly into UI components like "Approved quote" or "Occupancy Accepted".',
    },
  ],
  features: [
    {
      title: 'Structured appetite checks',
      description: 'Check Appetite for CPP and BOP products with a single API call, using structured signals like business type, size, and risk factors.',
    },
    {
      title: 'Simplify Quoting',
      description: 'Receive indicative quotes for BOP and CPP products and create and submit a quote to underwriting with a single API call.',
    },
    {
      title: 'Operational monitoring',
      description: 'A built-in health check lets you quickly verify API availability from your dashboards or uptime monitors.',
    },
  ],
  useCases: [
    {
      title: 'Occupancy Availability',
      description: 'Quickly check if a business is within appetite for CPP or BOP products based on natural language inputs.',
    },
    {
      title: 'Appetite Verification',
      description: 'Verify if a business and/or property location is within appetite for CPP and BOP products with a single API call.',
    },
    {
      title: 'Chatbots / assistants',
      description: 'Let conversational agents call the API to help users find relevant insurance products, check appetite, and get quotes in real time.',
    },
  ],
};

export const CONTENT: AllContent = {
  main: MAIN_CONTENT,
  bop: {
    sampleRows: BOP_SAMPLE_ROWS,
    roofShapeValues: ROOF_SHAPE_VALUES,
    roofCoverValues: ROOF_COVER_VALUES,
    exteriorMaterialValues: EXTERIOR_MATERIAL_VALUES,
    deductibleOptions: BOP_DEDUCTIBLE_OPTIONS,
  },
  cpp: {
    sampleRows: CPP_SAMPLE_ROWS,
    roofShapeValues: ROOF_SHAPE_VALUES,
    roofCoverValues: ROOF_COVER_VALUES,
    exteriorMaterialValues: EXTERIOR_MATERIAL_VALUES,
    deductibleOptions: CPP_DEDUCTIBLE_OPTIONS,
  },
  risk: {
    sampleRows: RISK_SAMPLE_ROWS,
    roofShapeValues: ROOF_SHAPE_VALUES,
    roofCoverValues: ROOF_COVER_VALUES,
    exteriorMaterialValues: EXTERIOR_MATERIAL_VALUES,
  },
};

export function getPageContent(page?: string): PageContent | MainContent | AllContent {
  if (page && page in CONTENT) {
    return CONTENT[page as keyof AllContent];
  }
  return CONTENT;
}
