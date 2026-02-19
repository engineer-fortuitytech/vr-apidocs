

export type SampleId = "occupancy.search" | "appetite.check" | "bop.create.quote" | "cpp.create.quote";

export type ApiSample = {
    id: SampleId;
    title?: string;
    description?: string;
    language?: "json" | "bash"
    url?: string;
    code: string;
}

export const API_SAMPLES: ApiSample[] = [
    {
        id: "occupancy.search",
        title: "Search for occupancy",
        description: "Find class id, GL and NAICS codes for a business",
        language: "json",
        url: "/v1/Occupancy/SearchOccupancyData",
        code: `
POST: /v1/Occupancy/SearchOccupancyData
{
 "searchText": "pizza restaurant",
 "numResults": 5,
 "lineOfBusiness": "ALL"
}
`
    },
    {
        id: "appetite.check",
        title: "Request an appetite check",
        description: "Reviews a business classification(s) and location(s) to determine if it fits our risk appetite",
        language: "json",
        url: "/v1/RiskAppetiteChecker/CheckAppetite",
        code: `
POST: /v1/RiskAppetiteChecker/CheckAppetite
{
"Locations": [
    {
        "LocationName": "Location 1",
        "Operations": [
            {
                "PropertyCoverages": [
                    {
                        "Name": "Coverage A",
                        "Description": "Building",
                        "Type": "fixed",
                        "Limit": 1200000,
                        "Deductible": 0
                    },
                    {
                        "Name": "Coverage C",
                        "Description": "Business Personal Property Contents Limit",
                        "Type": "fixed",
                        "Limit": 0,
                        "Deductible": 0
                    },
                    {
                        "Name": "Coverage D",
                        "Description": "Business Income",
                        "Type": "fixed",
                        "Limit": 800000,
                        "Deductible": 0
            }   
                ],
                "BusinessClassifications": [
                    {
                        "ClassId": "feb9305f0e53a936f9be40f4ad75d1f32a4a56d18f34286a9f95c865adb975ff",
                        "NumberOfEmployees": 0,
                        "LiabilityBasisType": "Payroll",
                        "LiabilityBasisAmount": 300000
                    }
                ],
                "LocationNumber": 1,
                "BuildingNumber": 1,
                "BuildingDescription": "Building2",
                "YearBuilt": 1950,
                "TIV": 0,
                "ConstructionType": "Masonry Non-Combustible",
                "RoofReplacementYear": 1950,
                "ElectricUpdateYear": 1950,
                "PlumbingUpdateYear": 1950,
                "HeatingUpdateYear": 1950,
                "RoofCover": "Built-up roof without gravel",
                "RoofShape": "Stepped",
                "SquareFootage": 2001,
                "Stories": 1,
                "BuildingHasStudentHousing": "No",
                "BuildingHasHUDTenants": "No",
                "BuildingHasConvertedDwelling": "No",
                "OccupancyType": "Mercantile",
                "OccupantType":"Owner",
                "BuildingAddress": {
                    "Street1": "3500 FM 365",
                    "Street2": null,
                    "City": "Port Arthur",
                    "State": "TX",
                    "Postal": "77642-7721",
                    "County": "Jefferson County",
                    "Location": {
                        "Latitude": 29.952012,
                        "Longitude": -93.987138
                    }
                }
            ]
        }
    }
],
"BusinessName": "test",
"State": "TX",
"EffectiveDate": "2025-05-28"
}`
    },
    {
        id: "bop.create.quote",
        title: "Create a BOP quote",
        description: "Submit an appetite check request with additional details to generate a BOP quote",
        language: "json",
        url: "/v1/BOPAppetiteChecker/CreateQuoteOptions",
        code: `
{
    "appetiteCheckId": "fbed2705-598e-4378-8409-86918e081f8a",
    "producerId": "28543",
    "verificationQuestion": "Yes",
    "coverageType": "WNDAOP"
}`
    },
    {
        id: "cpp.create.quote",
        title: "Create a CPP quote",
        description: "Submit an appetite check request with additional details to generate a CPP quote",
        language: "json",
        url: "/v2/AppetiteChecker/CreateRatedQuote/",
        code: `
{
    "appetiteCheckId": "4923910d-3861-4ecc-b78a-fe724bd16bd1",
    "producerId": "19712",
    "verificationQuestion": "Yes",
    "coverageType": "WNDAOP"
}`
    }
];

export const SAMPLE_RESPONSE: ApiSample[] = [
    {
        id: "occupancy.search",
        title: "Sample response",
        description: "Example of a response from the appetite check endpoint",
        language: "json",
        code: `
{
    "results": [
        {
            "score": 425.6802,
            "classId": "8cdb763a94e373b056da0f48b882c72b3f9014447586fb29f9fedb91d443e7f1",
            "occupancy_class": "Restaurant-Limited-Cooking",
            "occupancy_category": "Pizza Shops",
            "licenseClass": [
                "BOP",
                "CPP"
            ],
            "eligible": "Yes",
            "descriptions": [
                "Pizza Shops",
                "722210",
                "9211",
                "pizza shop",
                "pizza restaurants",
                "pizzeria",
                "pizzerias",
                "takeout pizza",
                "pizza delivery",
                "slice shop",
                "pizza place",
                "pizza parlor",
                "family pizza",
                "artisan pizza",
                "gourmet pizza"
            ],
            "classification": {
                "id": "Pizza Shops",
                "description": "Pizza Shops",
                "glClassCode": "9211",
                "naicsCode": "722210",
                "eligible": "Yes",
                "maxLiabLimit": "1000000/1000000/1000000",
                "occupantLiabilityBase": "SALES",
                "lessorLiabilityBase": "LOI",
                "cppOccupancy": "Restaurant",
                "cppClass": "Fast Food Restaurants",
                "cppClassId": "15c678ed6073f6386204ad7c28b228e35d885c07ab22b6b05246aa4a777d5a13",
                "hierarchy": "108"
            }
        },
        {
            "score": 415.6222,
            "classId": "cec85d878fb4093fe762ec355e150710221657fe40d41ab60ecc5988a1d2c7f1",
            "occupancy_class": "Restaurant-Fast-Food",
            "occupancy_category": "Pizza Shops",
            "licenseClass": [
                "BOP",
                "CPP"
            ],
            "eligible": "Yes",
            "descriptions": [
                "Pizza Shops",
                "722210",
                "9201",
                "pizza shop",
                "pizzerias",
                "pizza restaurant",
                "pizza places",
                "pizza takeout",
                "pizza delivery",
                "slice shop",
                "pizza parlor",
                "Italian restaurant",
                "artisan pizza",
                "gourmet pizza"
            ],
            "classification": {
                "id": "Pizza Shops",
                "description": "Pizza Shops",
                "glClassCode": "9201",
                "naicsCode": "722210",
                "eligible": "Yes",
                "maxLiabLimit": "1000000/1000000/1000000",
                "occupantLiabilityBase": "SALES",
                "lessorLiabilityBase": "LOI",
                "cppOccupancy": "Restaurant",
                "cppClass": "Fast Food Restaurants",
                "cppClassId": "15c678ed6073f6386204ad7c28b228e35d885c07ab22b6b05246aa4a777d5a13",
                "hierarchy": "108"
            }
        },
        {
            "score": 275.1352,
            "classId": "15c678ed6073f6386204ad7c28b228e35d885c07ab22b6b05246aa4a777d5a13",
            "occupancy_class": "Restaurant",
            "occupancy_category": "Fast Food Restaurants",
            "licenseClass": [
                "CPP"
            ],
            "eligible": "Yes",
            "descriptions": [
                "Fast Food Restaurants",
                "fast food",
                "burger joint",
                "french fries",
                "drive-thru",
                "quick service",
                "takeout",
                "sandwich shop",
                "taco stand",
                "pizza place",
                "chicken restaurant"
            ],
            "classification": {
                "id": "Fast Food Restaurants",
                "description": "Fast Food Restaurants"
            }
        },
        {
            "score": 156.43098,
            "classId": "847c0714d09f19507db4e9bf423be58fd92bc885f02b65333549840c3de7e636",
            "occupancy_class": "Restaurant-Casual-Dining",
            "occupancy_category": "Family-style Restaurants - Bring Your Own Alcohol Establishments - With no sales of alcoholic beverages",
            "licenseClass": [
                "BOP",
                "CPP"
            ],
            "eligible": "Yes",
            "descriptions": [
                "Family-style Restaurants - Bring Your Own Alcohol Establishments - With no sales of alcoholic beverages",
                "72210",
                "9691",
                "family restaurant",
                "family-style restaurant",
                "BYO restaurant",
                "bring your own alcohol restaurant",
                "BYO family restaurant",
                "bring your own alcohol establishment",
                "family dining",
                "casual dining",
                "restaurant",
                "restaurants"
            ],
            "classification": {
                "id": "Family-style Restaurants - Bring Your Own Alcohol Establishments - With no sales of alcoholic beverages",
                "description": "Family-style Restaurants - Bring Your Own Alcohol Establishments - With no sales of alcoholic beverages",
                "glClassCode": "9691",
                "naicsCode": "72210",
                "eligible": "Yes",
                "maxLiabLimit": "1000000/1000000/1000000",
                "occupantLiabilityBase": "SALES",
                "lessorLiabilityBase": "LOI",
                "cppOccupancy": "Restaurant",
                "cppClass": "Restaurants",
                "cppClassId": "e4d39cc522ad392c1efe023cb0b6ba77a802bcd9253cbf8084ce0297bcefe569",
                "hierarchy": "9"
            }
        },
        {
            "score": 133.52757,
            "classId": "65bdc0af6ea74325851250d022c0b824f69a19b301cdd80a1284e4cb5868d5bb",
            "occupancy_class": "Restaurant-Casual-Dining",
            "occupancy_category": "Family-style Restaurants - With sales of alcoholic beverages up to 50% of total sales",
            "licenseClass": [
                "BOP",
                "CPP"
            ],
            "eligible": "Yes",
            "descriptions": [
                "Family-style Restaurants - With sales of alcoholic beverages up to 50% of total sales",
                "72210",
                "9661",
                "family restaurant",
                "family dining",
                "pub",
                "tavern",
                "casual dining",
                "restaurant with bar",
                "family-style eatery",
                "bar and grill",
                "brasserie",
                "bistro"
            ],
            "classification": {
                "id": "Family-style Restaurants - With sales of alcoholic beverages up to 50% of total sales",
                "description": "Family-style Restaurants - With sales of alcoholic beverages up to 50% of total sales",
                "glClassCode": "9661",
                "naicsCode": "72210",
                "eligible": "Yes",
                "maxLiabLimit": "1000000/1000000/1000000",
                "occupantLiabilityBase": "SALES",
                "lessorLiabilityBase": "LOI",
                "cppOccupancy": "Restaurant",
                "cppClass": "Restaurants",
                "cppClassId": "e4d39cc522ad392c1efe023cb0b6ba77a802bcd9253cbf8084ce0297bcefe569",
                "hierarchy": "10"
            }
        }
    ]
}`

    },
    {
        id: "appetite.check",
        title: "Sample Appetite Check response",
        description: "Example of a response from the appetite check endpoint",
        language: "json",
        code: `
{
    "riskAppetiteCheckId": "20ef54df-057f-44e7-986c-b995127395fb",
    "bopAppetiteCheckResult": [
        {
            "checkId": "20ef54df-057f-44e7-986c-b995127395fb",
            "underwritingIndication": "Decline",
            "quoteUrl": "https://appetitecheck-uat.fortuitytech.com",
            "quoteUnderwriting": [
                {
                    "decision": "Decline",
                    "source": "Request is not Eligible for BOP Appetite Check",
                    "reason": "No eligible BOP class codes found for the provided classifications."
                }
            ]
        }
    ],
    "cppAppetiteCheckResult": [
        {
            "checkId": "d680dbe9-0943-4af9-985c-bea1e8a757ed",
            "underwritingIndication": "Decline",
            "quoteUrl": "https://appetitecheck-uat.fortuitytech.com/v2/AppetiteChecker/GetAppetiteCheck/d680dbe9-0943-4af9-985c-bea1e8a757ed",
            "quoteUnderwriting": [
                {
                    "decision": "Approve",
                    "source": "TIV",
                    "reason": "TIV: Total TIV is $6,600,000.00"
                },
                {
                    "decision": "Decline",
                    "source": "VR Appetite Score Step",
                    "reason": "One or more buildings are Declined for Appetite Score."
                },
                {
                    "decision": "Decline",
                    "source": "Coverage Eligibility Step",
                    "reason": "Policy is ineligible for coverage"
                }
            ],
            "buildings": [
                {
                    "appetiteCheckDateTime": "2026-02-18T23:02:39.9794248+00:00",
                    "underwritingIndication": "Decline",
                    "building": {
            "propertyCoverages": [
                {
                    "name": "Coverage A",
                    "description": "Building",
                    "type": "fixed",
                    "limit": 5800000,
                    "deductible": 0
                },
                {
                    "name": "Coverage C",
                    "description": "Business Personal Property Contents Limit",
                    "type": "fixed",
                    "limit": 0,
                    "deductible": 0
                },
                {
                    "name": "Coverage D",
                    "description": "Business Income",
                    "type": "fixed",
                    "limit": 800000,
                    "deductible": 0
                }
            ],
            "buildingId": "1d00f650-2f4b-4878-b25b-0d883ba12591",
            "locationNumber": 1,
            "buildingNumber": 0,
            "buildingDescription": "South Park Centre 2 LTD",
            "yearBuilt": 1997,
            "tiv": 6600000,
            "constructionType": "Joisted Masonry",
            "roofReplacementYear": 1997,
            "electricUpdateYear": 1997,
            "plumbingUpdateYear": 1997,
            "heatingUpdateYear": 1997,
            "roofCover": "Built-up roof without gravel",
            "roofShape": "Flat",
            "squareFootage": 39500,
            "stories": 2,
            "occupancyType": "Condominiums",
            "cppClass": "Condominium Association",
            "classId": "846ae3a5e5f28796b4fa4b44cdae70279da13113a4ca3a4265d25959d2062696",
            "buildingAddress": {
                "street1": "4700 Riverside Dr",
                "street2": "",
                "city": "Palm Beach Gardens",
                "state": "FL",
                "postal": "33410",
                "county": "Palm Beach",
                "location": {
                    "latitude": 26.831967,
                    "longitude": -80.096502
                }
            }
        },
        "underwritingReasons": [
            {
                "decision": "Approve",
                "source": "Request Validation Step",
                "reason": "Approve: Request is valid"
            },
            {
                "decision": "Skip",
                "source": "HazardHub",
                "reason": "Location Set - Latitude: 26.831967, Longitude: -80.096502, County: Palm Beach"
            },
            {
                "decision": "Approve",
                "source": "Product State Eligibility Step",
                "reason": "Product State Eligibility: Approve"
            },
            {
                "decision": "Approve",
                "source": "Roof Cover Step",
                "reason": "Built-up roof without gravel roof cover is eligible"
            },
            {
                "decision": "Approve",
                "source": "Roof Shape Step",
                "reason": "Flat roof cover is eligible"
            },
            {
                "decision": "Approve",
                "source": "Exterior Material Step",
                "reason": "Joisted Masonry Exterior Material is eligible "
            },
            {
                "decision": "Approve",
                "source": "Year Built / Construction Exclusion Step",
                "reason": "Exterior Material is Joisted Masonry and Year Built is 1997"
            },
            {
                "decision": "Approve",
                "source": "State Eligibility",
                "reason": "State Eligibility: FL"
            },
            {
                "decision": "Approve",
                "source": "Tier Eligibility - Check Zip Code Tier",
                "reason": "Tier Eligibility - Check Zip Code Tier: Zip Code 33410 is in Tier: Approved Tier"
            },
            {
                "decision": "Approve",
                "source": "HazardHub",
                "reason": "Protection Class is HH1"
            },
            {
                "decision": "Approve",
                "source": "HazardHub",
                "reason": "Distance to Coast is 3.42 miles.  Zone: Tri-County, County: Palm Beach County, Year Built: 1997, Construction Type: Joisted Masonry "
            },
            {
                "decision": "Skip",
                "source": "Roof Age",
                "reason": "Roof Age Eligiblity is not configured for FL"
            },
            {
                "decision": "Approve",
                "source": "Roof Condition Score Step",
                "reason": "Roof Condition: Good"
            },
            {
                "decision": "Approve",
                "source": "Occupancy Type",
                "reason": "Occupancy Type: Condominiums with Building Age: 1997"
            },
            {
                "decision": "Approve",
                "source": "FL Condominium Rule Step",
                "reason": "FL Condominium Rule Step: Building Age: 29, Occupancy Type: Condominiums, County: Palm Beach"
            },
            {
                "decision": "Skip",
                "source": "Ineligible County",
                "reason": "Ineligible County is not configured"
            },
            {
                "decision": "Skip",
                "source": "Moratorium Check Step",
                "reason": "Moratorium Check Step is not in Effect for FL"
            },
            {
                "decision": "Approve",
                "source": "Minimum Valuation Step",
                "reason": "Valuation: $4,937,500.00, Coverage A: $5,800,000.00, Minimum Valuation: $250,000.00"
            },
            {
                "decision": "Decline",
                "source": "VR Appetite Score Step",
                "reason": "Building South Park Centre 2 LTD with Roof Age 29 is between 26 - 9999 and VR Appetite Score: 6 is less than 8"
            },
            {
                "decision": "Decline",
                "source": "Coverage Eligibility Step",
                "reason": "Building is ineligible for coverage"
            }
        ],
        "dataProviderResponse": [
            {
                "providerName": "HazardHub",
                "providerResponse": "92ec753e-85f8-4213-9c7b-f9e6a502fb9a",
                "providerResponseId": "92ec753e-85f8-4213-9c7b-f9e6a502fb9a"
            },
            {
                "providerName": "CapeAnalytics",
                "providerResponse": "aa6ad346-77fd-4eb5-9d7b-f9b8f836fe8d",
                "providerResponseId": "aa6ad346-77fd-4eb5-9d7b-f9b8f836fe8d"
            },
            {
                "providerName": "VRAppetiteScore-Local",
                "providerResponse": "ba835182-b03a-4d78-8409-d2fd4eacccfa",
                "providerResponseId": "ba835182-b03a-4d78-8409-d2fd4eacccfa"
            }
        ]
    }
]
        }
    ]
}`
    },
    {
        id: "bop.create.quote",
        title: "Sample BOP quote response",
        description: "Example of a response from the BOP quote endpoint",
        language: "json",
        code: `
{
    "CheckId": "bcbae5bf-3c16-4649-851a-c2f752bdb86b",
    "QuoteId": "QT-00007652",
    "QuoteLocation": "https://vru-uat.mu-1-us-west-2.guidewire.net/coreapi/v5/applications/12002",
    "QuoteType": "WNDAOP",
    "QuoteOptions": [
        {
            "CoverageName": "PolicyWIND",
            "CoverageCode": "PolicyWIND",
            "CoverageDescription": "Wind/Hail Coverage",
            "CoveragePremium": "2900.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "3",
                    "DeductibleType": "percentage",
                    "DeductibleDisplay": "3%"
                }
            ]
        },
        {
            "CoverageName": "PolicyAOP",
            "CoverageCode": "PolicyAOP",
            "CoverageDescription": "All Other Perils",
            "CoveragePremium": "480.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "10000",
                    "DeductibleType": "currency",
                    "DeductibleDisplay": "$10,000.00"
                }
            ]
        },
        {
            "CoverageName": "GROUND",
            "CoverageCode": "GROUND",
            "CoverageDescription": "Florida Ground Cover Collapse Coverage",
            "CoveragePremium": "0.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "10000",
                    "DeductibleType": "currency",
                    "DeductibleDisplay": "$10,000.00"
                }
            ]
        },
        {
            "CoverageName": "PolicyEB",
            "CoverageCode": "PolicyEB",
            "CoverageDescription": "Equipment Breakdown",
            "CoveragePremium": "25.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "10000",
                    "DeductibleType": "currency",
                    "DeductibleDisplay": "$10,000.00"
                }
            ]
        },
        {
            "CoverageName": "AddCov",
            "CoverageCode": "AddCov",
            "CoverageDescription": "Additional Coverage and Sublimits Package",
            "CoveragePremium": "0.00",
            "DeductibleOptions": []
        },
        {
            "CoverageName": "Cyber",
            "CoverageCode": "Cyber",
            "CoverageDescription": "Cyber Liability",
            "CoveragePremium": "224.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "1000",
                    "DeductibleType": "currency",
                    "DeductibleDisplay": "$1,000.00"
                }
            ]
        }
    ]
}`
    },
    {
        id: "cpp.create.quote",
        title: "Sample CPP quote response",
        description: "Example of a response from the CPP quote endpoint",
        language: "json",
        code: `
{
    "CheckId": "bcbae5bf-3c16-4649-851a-c2f752bdb86b",
    "QuoteId": "QT-00007652",
    "QuoteLocation": "https://vru-uat.mu-1-us-west-2.guidewire.net/coreapi/v5/applications/12002",
    "QuoteType": "WNDAOP",
    "QuoteOptions": [
        {
            "CoverageName": "PolicyWIND",
            "CoverageCode": "PolicyWIND",
            "CoverageDescription": "Wind/Hail Coverage",
            "CoveragePremium": "2900.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "3",
                    "DeductibleType": "percentage",
                    "DeductibleDisplay": "3%"
                }
            ]
        },
        {
            "CoverageName": "PolicyAOP",
            "CoverageCode": "PolicyAOP",
            "CoverageDescription": "All Other Perils",
            "CoveragePremium": "480.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "10000",
                    "DeductibleType": "currency",
                    "DeductibleDisplay": "$10,000.00"
                }
            ]
        },
        {
            "CoverageName": "GROUND",
            "CoverageCode": "GROUND",
            "CoverageDescription": "Florida Ground Cover Collapse Coverage",
            "CoveragePremium": "0.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "10000",
                    "DeductibleType": "currency",
                    "DeductibleDisplay": "$10,000.00"
                }
            ]
        },
        {
            "CoverageName": "PolicyEB",
            "CoverageCode": "PolicyEB",
            "CoverageDescription": "Equipment Breakdown",
            "CoveragePremium": "25.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "10000",
                    "DeductibleType": "currency",
                    "DeductibleDisplay": "$10,000.00"
                }
            ]
        },
        {
            "CoverageName": "AddCov",
            "CoverageCode": "AddCov",
            "CoverageDescription": "Additional Coverage and Sublimits Package",
            "CoveragePremium": "0.00",
            "DeductibleOptions": []
        },
        {
            "CoverageName": "Cyber",
            "CoverageCode": "Cyber",
            "CoverageDescription": "Cyber Liability",
            "CoveragePremium": "224.00",
            "DeductibleOptions": [
                {
                    "DeductibleName": "Deductible1",
                    "DeductibleDescription": "",
                    "DeductibleAmount": "1000",
                    "DeductibleType": "currency",
                    "DeductibleDisplay": "$1,000.00"
                }
            ]
        }
    ]
}`
    }
]