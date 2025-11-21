import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ScenarioStep {
  title: string;
  description: string;
  requestExample: string;
  responseExample: string;
}

interface Scenario {
  id: string;
  name: string;
  summary: string;
  details: string;
  steps: ScenarioStep[];
}

@Component({
  selector: 'app-scenarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './scenario.html'
})
export class Scenarios {
  scenarios: Scenario[] = [
    {
      id: 'single-building-single-occupancy',
      name: 'Single Building, Single Occupancy',
      summary: 'One building, one line of business / occupancy type.',
      details:
        'Use this flow when your account has a single building with a single occupancy, such as a standalone restaurant or small retail shop.',
      steps: [
        {
          title: 'Step 1 · Classification API (per business class)',
          description:
            'Classify the building / occupancy once for the single business class in the quote.',
          requestExample: `POST /api/classification
Content-Type: application/json

{
  "quoteId": "Q-1001",
  "businessClassCode": "RESTAURANT",
  "naics": "722511",
  "location": {
    "address": "123 Main St",
    "city": "Anywhere",
    "state": "NY",
    "postalCode": "10001"
  },
  "building": {
    "buildingId": "B1",
    "yearBuilt": 1995,
    "stories": 1,
    "constructionType": "Masonry"
  },
  "occupancy": {
    "occupancyType": "Restaurant",
    "squareFeet": 3000
  }
}`,
          responseExample: `200 OK
Content-Type: application/json

{
  "quoteId": "Q-1001",
  "businessClassCode": "RESTAURANT",
  "classificationId": "CLF-9001",
  "hazardTier": "MEDIUM",
  "recommendedProgram": "Standard Restaurant",
  "messages": [
    {
      "code": "INFO_CLASS_OK",
      "severity": "INFO",
      "text": "Classification completed successfully."
    }
  ]
}`
        },
        {
          title: 'Step 2 · Risk Appetite Check API',
          description:
            'Send the classification result to the Risk Appetite Check API to determine if the risk fits current underwriting appetite.',
          requestExample: `POST /api/appetite/check
Content-Type: application/json

{
  "quoteId": "Q-1001",
  "classificationId": "CLF-9001",
  "requestedEffectiveDate": "2025-01-01",
  "limits": {
    "propertyLimit": 1000000,
    "businessIncomeLimit": 250000
  },
  "deductibles": {
    "allOtherPerils": 5000
  },
  "accountCharacteristics": {
    "lossFreeYears": 5,
    "priorCarrier": "Sample Mutual",
    "sprinklered": true
  }
}`,
          responseExample: `200 OK
Content-Type: application/json

{
  "quoteId": "Q-1001",
  "appetiteDecision": "APPROVED",
  "appetiteScore": 0.87,
  "appetiteBands": [
    {
      "dimension": "HazardTier",
      "value": "MEDIUM",
      "score": 0.8
    },
    {
      "dimension": "LimitAdequacy",
      "value": "WITHIN_GUIDELINES",
      "score": 0.9
    }
  ],
  "messages": [
    {
      "code": "APPROVED_STANDARD",
      "severity": "INFO",
      "text": "Risk is within standard appetite."
    }
  ]
}`
        },
        {
          title: 'Step 3 · Quote API (create quote when appetite is approved)',
          description:
            'If the appetite decision is APPROVED, create the quote using the Quote API.',
          requestExample: `POST /api/quotes
Content-Type: application/json

{
  "quoteId": "Q-1001",
  "accountNumber": "ACCT-5001",
  "appetiteDecision": "APPROVED",
  "locations": [
    {
      "locationId": "LOC-1",
      "buildingId": "B1",
      "address": "123 Main St",
      "city": "Anywhere",
      "state": "NY",
      "postalCode": "10001",
      "occupancyType": "Restaurant",
      "squareFeet": 3000
    }
  ],
  "coverages": {
    "propertyLimit": 1000000,
    "businessIncomeLimit": 250000
  }
}`,
          responseExample: `201 Created
Content-Type: application/json

{
  "quoteId": "Q-1001",
  "quoteNumber": "QP-2025-00001",
  "status": "QUOTED",
  "premium": {
    "writtenPremium": 4800.0,
    "fees": 100.0,
    "total": 4900.0
  },
  "links": {
    "quoteSummaryUrl": "https://appetite-check.example.com/quotes/QP-2025-00001"
  }
}`
        }
      ]
    },
    {
      id: 'single-building-multiple-occupancy',
      name: 'Single Building, Multiple Occupancy',
      summary: 'One building with several occupancies (e.g., ground floor retail, upper floor offices).',
      details:
        'Use this flow when a single building has multiple distinct occupancies that need to be classified separately but rated together.',
      steps: [
        {
          title: 'Step 1 · Classification API (one call per occupancy)',
          description:
            'Call the Classification API for each occupancy in the building. Each occupancy receives its own classificationId.',
          requestExample: `POST /api/classification
Content-Type: application/json

{
  "quoteId": "Q-2001",
  "businessClassCode": "MIXED_USE",
  "naics": "531120",
  "location": {
    "address": "200 Market St",
    "city": "Anycity",
    "state": "IL",
    "postalCode": "60601"
  },
  "building": {
    "buildingId": "B1",
    "yearBuilt": 1985,
    "stories": 3,
    "constructionType": "Frame"
  },
  "occupancy": {
    "occupancyId": "OCC-1",
    "occupancyType": "GroundFloorRetail",
    "squareFeet": 4000
  }
}`,
          responseExample: `200 OK
Content-Type: application/json

{
  "quoteId": "Q-2001",
  "occupancyId": "OCC-1",
  "classificationId": "CLF-9101",
  "hazardTier": "HIGH",
  "recommendedProgram": "Retail - Main Street",
  "messages": []
}
// Repeat for OCC-2 (Offices), etc.`
        },
        {
          title: 'Step 2 · Risk Appetite Check API (multi-occupancy payload)',
          description:
            'Send all classificationIds for the building in a single appetite check request so the engine can evaluate the combined risk.',
          requestExample: `POST /api/appetite/check
Content-Type: application/json

{
  "quoteId": "Q-2001",
  "classificationRefs": [
    { "occupancyId": "OCC-1", "classificationId": "CLF-9101" },
    { "occupancyId": "OCC-2", "classificationId": "CLF-9102" }
  ],
  "requestedEffectiveDate": "2025-01-01",
  "limits": {
    "propertyLimit": 2000000
  },
  "deductibles": {
    "allOtherPerils": 10000
  }
}`,
          responseExample: `200 OK
Content-Type: application/json

{
  "quoteId": "Q-2001",
  "appetiteDecision": "REFERRED",
  "appetiteScore": 0.62,
  "drivers": [
    {
      "occupancyId": "OCC-1",
      "reason": "High fire load in retail occupancy."
    }
  ],
  "messages": [
    {
      "code": "REFER_HIGH_HAZARD",
      "severity": "WARN",
      "text": "Mixed-use building with high-hazard retail should be referred."
    }
  ]
}`
        },
        {
          title: 'Step 3 · Quote API',
          description:
            'If appetite is APPROVED or REFERRED_WITHIN_TOLERANCE, proceed to quote and capture occupancy-level details.',
          requestExample: `POST /api/quotes
Content-Type: application/json

{
  "quoteId": "Q-2001",
  "accountNumber": "ACCT-6001",
  "appetiteDecision": "REFERRED",
  "locations": [
    {
      "locationId": "LOC-1",
      "buildingId": "B1",
      "address": "200 Market St",
      "city": "Anycity",
      "state": "IL",
      "postalCode": "60601",
      "occupancies": [
        {
          "occupancyId": "OCC-1",
          "occupancyType": "GroundFloorRetail",
          "squareFeet": 4000
        },
        {
          "occupancyId": "OCC-2",
          "occupancyType": "Offices",
          "squareFeet": 6000
        }
      ]
    }
  ],
  "coverages": {
    "propertyLimit": 2000000
  }
}`,
          responseExample: `201 Created
Content-Type: application/json

{
  "quoteId": "Q-2001",
  "quoteNumber": "QP-2025-00021",
  "status": "REFERRED",
  "underwriterQueue": "Midwest-Mixed-Use",
  "premium": {
    "writtenPremium": 12500.0,
    "fees": 250.0,
    "total": 12750.0
  }
}`
        }
      ]
    },
    {
      id: 'multiple-locations-single-occupancy',
      name: 'Multiple Locations, Single Occupancy',
      summary: 'Several locations, each with the same occupancy type (e.g., a chain of similar stores).',
      details:
        'Use this when you have multiple locations with essentially the same occupancy (e.g., ten convenience stores) and want a single account-level appetite decision.',
      steps: [
        {
          title: 'Step 1 · Classification API (per location)',
          description:
            'Call the Classification API once per location to capture address and building characteristics for each store.',
          requestExample: `POST /api/classification
Content-Type: application/json

{
  "quoteId": "Q-3001",
  "businessClassCode": "CONVENIENCE_STORE",
  "location": {
    "locationId": "LOC-1",
    "address": "10 Elm St",
    "city": "Town A",
    "state": "OH",
    "postalCode": "43001"
  },
  "building": {
    "yearBuilt": 2005,
    "constructionType": "Masonry"
  },
  "occupancy": {
    "occupancyType": "ConvenienceStore",
    "squareFeet": 2500
  }
}
// Repeat for LOC-2, LOC-3, etc.`,
          responseExample: `200 OK
Content-Type: application/json

{
  "quoteId": "Q-3001",
  "locationId": "LOC-1",
  "classificationId": "CLF-9301",
  "hazardTier": "LOW",
  "messages": []
}`
        },
        {
          title: 'Step 2 · Risk Appetite Check API (account-level)',
          description:
            'Send all location-level classificationIds in one account-level appetite request.',
          requestExample: `POST /api/appetite/check
Content-Type: application/json

{
  "quoteId": "Q-3001",
  "accountLevel": true,
  "locationClassifications": [
    { "locationId": "LOC-1", "classificationId": "CLF-9301" },
    { "locationId": "LOC-2", "classificationId": "CLF-9302" },
    { "locationId": "LOC-3", "classificationId": "CLF-9303" }
  ],
  "limits": {
    "propertyLimitPerLocation": 750000,
    "aggregatePropertyLimit": 2250000
  }
}`,
          responseExample: `200 OK
Content-Type: application/json

{
  "quoteId": "Q-3001",
  "appetiteDecision": "APPROVED",
  "appetiteScore": 0.93,
  "locationScores": [
    { "locationId": "LOC-1", "score": 0.95 },
    { "locationId": "LOC-2", "score": 0.92 },
    { "locationId": "LOC-3", "score": 0.91 }
  ]
}`
        },
        {
          title: 'Step 3 · Quote API',
          description:
            'If appetite is APPROVED, create a single quote with multiple locations attached.',
          requestExample: `POST /api/quotes
Content-Type: application/json

{
  "quoteId": "Q-3001",
  "accountNumber": "ACCT-7001",
  "appetiteDecision": "APPROVED",
  "locations": [
    { "locationId": "LOC-1", "classificationId": "CLF-9301" },
    { "locationId": "LOC-2", "classificationId": "CLF-9302" },
    { "locationId": "LOC-3", "classificationId": "CLF-9303" }
  ],
  "coverages": {
    "propertyLimitPerLocation": 750000,
    "aggregatePropertyLimit": 2250000
  }
}`,
          responseExample: `201 Created
Content-Type: application/json

{
  "quoteId": "Q-3001",
  "quoteNumber": "QP-2025-00045",
  "status": "QUOTED",
  "premium": {
    "writtenPremium": 16500.0,
    "total": 16500.0
  }
}`
        }
      ]
    },
    {
      id: 'multiple-locations-multiple-occupancy',
      name: 'Multiple Locations, Multiple Occupancy',
      summary: 'Complex accounts with multiple locations and multiple occupancies per location.',
      details:
        'Use this flow for larger, more complex schedules where each location may have multiple occupancies. You still follow the same 3-step pattern but with richer payloads.',
      steps: [
        {
          title: 'Step 1 · Classification API (per occupancy per location)',
          description:
            'For each occupancy at each location, call the Classification API and capture a classificationId.',
          requestExample: `POST /api/classification
Content-Type: application/json

{
  "quoteId": "Q-4001",
  "businessClassCode": "MIXED_PORTFOLIO",
  "location": {
    "locationId": "LOC-1",
    "address": "500 Center Ave",
    "city": "Metro City",
    "state": "CA",
    "postalCode": "90001"
  },
  "building": {
    "buildingId": "B1",
    "yearBuilt": 1975,
    "stories": 5,
    "constructionType": "ReinforcedConcrete"
  },
  "occupancy": {
    "occupancyId": "OCC-1",
    "occupancyType": "Retail",
    "squareFeet": 8000
  }
}
// Repeat per occupancy per location.`,
          responseExample: `200 OK
Content-Type: application/json

{
  "quoteId": "Q-4001",
  "locationId": "LOC-1",
  "occupancyId": "OCC-1",
  "classificationId": "CLF-9501",
  "hazardTier": "HIGH"
}`
        },
        {
          title: 'Step 2 · Risk Appetite Check API (schedule-level)',
          description:
            'Send the full schedule (locations + occupancies + classificationIds) into the appetite check.',
          requestExample: `POST /api/appetite/check
Content-Type: application/json

{
  "quoteId": "Q-4001",
  "schedule": [
    {
      "locationId": "LOC-1",
      "occupancies": [
        { "occupancyId": "OCC-1", "classificationId": "CLF-9501" },
        { "occupancyId": "OCC-2", "classificationId": "CLF-9502" }
      ]
    },
    {
      "locationId": "LOC-2",
      "occupancies": [
        { "occupancyId": "OCC-3", "classificationId": "CLF-9503" }
      ]
    }
  ],
  "limits": {
    "aggregatePropertyLimit": 5000000
  }
}`,
          responseExample: `200 OK
Content-Type: application/json

{
  "quoteId": "Q-4001",
  "appetiteDecision": "APPROVED_WITH_CONDITIONS",
  "conditions": [
    {
      "code": "REDUCE_LIMIT",
      "text": "Reduce aggregate property limit to 4M or higher deductible."
    }
  ],
  "scheduleScores": [
    { "locationId": "LOC-1", "score": 0.7 },
    { "locationId": "LOC-2", "score": 0.8 }
  ]
}`
        },
        {
          title: 'Step 3 · Quote API',
          description:
            'If the appetite decision and conditions are acceptable, create the quote and attach the full schedule.',
          requestExample: `POST /api/quotes
Content-Type: application/json

{
  "quoteId": "Q-4001",
  "accountNumber": "ACCT-8001",
  "appetiteDecision": "APPROVED_WITH_CONDITIONS",
  "locations": [
    {
      "locationId": "LOC-1",
      "occupancies": [
        { "occupancyId": "OCC-1", "classificationId": "CLF-9501" },
        { "occupancyId": "OCC-2", "classificationId": "CLF-9502" }
      ]
    },
    {
      "locationId": "LOC-2",
      "occupancies": [
        { "occupancyId": "OCC-3", "classificationId": "CLF-9503" }
      ]
    }
  ],
  "coverages": {
    "aggregatePropertyLimit": 4000000
  }
}`,
          responseExample: `201 Created
Content-Type: application/json

{
  "quoteId": "Q-4001",
  "quoteNumber": "QP-2025-00088",
  "status": "QUOTED",
  "conditionsApplied": true,
  "premium": {
    "writtenPremium": 32000.0,
    "total": 32000.0
  }
}`
        }
      ]
    }
  ];

  activeScenarioId = this.scenarios[0].id;

  get activeScenario(): Scenario {
    return this.scenarios.find(s => s.id === this.activeScenarioId)!;
  }

  setActiveScenario(id: string): void {
    this.activeScenarioId = id;
  }
}
