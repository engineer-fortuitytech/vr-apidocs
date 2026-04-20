import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  OpenApiSpec,
  OpenApiOperation,
  OpenApiParameter,
  StatusMode,
  CodeSamples,
  Endpoint,
  EndpointGroup,
  HttpMethod,
  EndpointParam,
  METHOD_ORDER
} from '../../types/types';

const OPENAPI_URL = 'https://appetitecheck-uat.fortuitytech.com';

const RISK_ALLOWED_TAGS = ['RiskAppetiteChecker', 'Occupancy', 'Product'];

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

@Component({
  selector: 'app-risk',
  imports: [CommonModule],
  templateUrl: './risk.html',
  styleUrl: './risk.css',
})
export class Risk implements OnInit {

  loading = true;
  loadError: string | null = null;

  spec: OpenApiSpec | null = null;
  baseUrl = 'auto-detected from OpenAPI';

  endpointGroups: EndpointGroup[] = [];

  statusMode: StatusMode = 'checking';
  statusText = 'Checking…';
  statusDescription = 'Pinging API definition to check availability.';
  statusLastChecked: string | null = null;
  statusSourceLabel = 'health endpoint';

  sampleRows: SampleRow[] = [
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

  roofShapeValues: FieldValue[] = [
    { value: 'Flat', description: 'Horizontal or very low-slope roof' },
    { value: 'Gabled', description: 'Two-sided pitched roof meeting at a central ridge' },
    { value: 'Hip', description: 'All four sides slope downward to the walls' },
    { value: 'Mansard', description: 'Double-pitched roof with a steep lower slope' },
    { value: 'Gambrel', description: 'Barn-style double-pitched roof' },
    { value: 'Stepped', description: 'Multiple flat sections at different heights' },
    { value: 'Shed', description: 'Single sloping plane, one ridge' },
    { value: 'Sawtooth', description: 'Series of ridges resembling saw teeth' },
    { value: 'Bowstring', description: 'Arched truss roof structure' },
  ];

  roofCoverValues: FieldValue[] = [
    { value: 'Asphalt Shingles', description: 'Standard asphalt composition shingles' },
    { value: 'Built-up roof without gravel', description: 'Multiple plies of bitumen without gravel surfacing' },
    { value: 'Built-up roof with gravel', description: 'Multiple plies of bitumen with aggregate surfacing' },
    { value: 'Metal', description: 'Standing seam or corrugated metal panels' },
    { value: 'Modified Bitumen', description: 'Polymer-modified asphalt membrane' },
    { value: 'Single Ply - TPO', description: 'Thermoplastic polyolefin membrane' },
    { value: 'Single Ply - EPDM', description: 'Synthetic rubber (ethylene propylene diene monomer) membrane' },
    { value: 'Single Ply - PVC', description: 'Polyvinyl chloride membrane' },
    { value: 'Tile', description: 'Clay or concrete tile' },
    { value: 'Wood Shake/Shingles', description: 'Split or sawn wood roofing material' },
    { value: 'Slate', description: 'Natural or synthetic slate tiles' },
  ];

  exteriorMaterialValues: FieldValue[] = [
    { value: 'Frame', description: 'Combustible wood frame construction (ISO Class 1)' },
    { value: 'Joisted Masonry', description: 'Masonry exterior walls with wood/combustible floor and roof (ISO Class 2)' },
    { value: 'Light Metal Frame', description: 'Metal frame with non-combustible exterior but combustible floor/roof (ISO Class 3A)' },
    { value: 'Non-combustible', description: 'Non-combustible or slow-burning materials — steel frame (ISO Class 3)' },
    { value: 'Masonry Non-Combustible', description: 'Masonry walls with non-combustible floor and roof (ISO Class 4)' },
    { value: 'Modified Fire Resistive', description: 'Fire-resistive construction with some combustible elements (ISO Class 5)' },
    { value: 'Fire Resistive', description: 'Reinforced concrete or protected steel — fully fire-resistive (ISO Class 6)' },
  ];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSpec();
  }

  get statusPillClasses(): string {
    if (this.statusMode === 'up') return 'border-emerald-500/60 bg-emerald-900/60 text-emerald-100';
    if (this.statusMode === 'down') return 'border-red-500/70 bg-red-900/60 text-red-100';
    if (this.statusMode === 'degraded') return 'border-amber-500/70 bg-amber-900/60 text-amber-100';
    return 'border-slate-500/60 bg-slate-900/80 text-slate-200';
  }

  get statusDotClasses(): string {
    if (this.statusMode === 'up') return 'h-2 w-2 rounded-full bg-emerald-400 animate-pulse';
    if (this.statusMode === 'down') return 'h-2 w-2 rounded-full bg-red-400 animate-pulse';
    if (this.statusMode === 'degraded') return 'h-2 w-2 rounded-full bg-amber-400 animate-pulse';
    return 'h-2 w-2 rounded-full bg-slate-400 animate-pulse';
  }

  private setStatus(mode: StatusMode, text: string, description: string, sourceLabel: string): void {
    this.statusMode = mode;
    this.statusText = text;
    this.statusDescription = description;
    this.statusSourceLabel = sourceLabel;
    this.statusLastChecked = new Date().toLocaleTimeString();
    this.cdr.detectChanges();
  }

  private getBaseUrlFromSpec(spec: OpenApiSpec): string {
    if (spec.servers && spec.servers.length > 0 && spec.servers[0].url) return spec.servers[0].url;
    if (spec.host) {
      const scheme = (spec.schemes && spec.schemes[0]) || 'https';
      return `${scheme}://${spec.host}${spec.basePath || ''}`;
    }
    try { return new URL(OPENAPI_URL).origin; } catch { return ''; }
  }

  private buildCodeSamples(method: HttpMethod, fullUrl: string): CodeSamples {
    const curl = `curl -X ${method.toUpperCase()} "${fullUrl}" \\\n  -H "accept: application/json"`;
    const js =
      `fetch("${fullUrl}", {\n  method: "${method.toUpperCase()}",\n  headers: {\n    "accept": "application/json"\n  }\n})\n  .then(response => response.json())\n  .then(console.log)\n  .catch(console.error);`;
    const python =
      `import requests\n\nurl = "${fullUrl}"\nheaders = {"accept": "application/json"}\n\nresponse = requests.${method}(url, headers=headers)\n\nprint(response.status_code)\nprint(response.json())`;
    return { curl, js, python };
  }

  private mapParams(params: OpenApiParameter[] | undefined): EndpointParam[] {
    if (!params || params.length === 0) return [];
    return params.map(p => ({
      name: p.name,
      in: p.in,
      type: p.schema?.type || (p.schema?.$ref ? p.schema.$ref.split('/').pop() || '' : ''),
      required: !!p.required,
      description: p.description || ''
    }));
  }

  private buildEndpoint(spec: OpenApiSpec, method: HttpMethod, path: string, operation: OpenApiOperation): Endpoint {
    const baseUrl = this.getBaseUrlFromSpec(spec);
    const fullUrl = `${baseUrl || ''}${path}`;
    return {
      method,
      path,
      summary: operation.summary || '',
      description: operation.description || '',
      operationId: operation.operationId || `${method.toUpperCase()} ${path}`,
      params: this.mapParams(operation.parameters),
      code: this.buildCodeSamples(method, fullUrl),
      activeTab: 'curl',
      expanded: false
    };
  }

  private processSpec(spec: OpenApiSpec): void {
    this.baseUrl = this.getBaseUrlFromSpec(spec) || 'not specified in spec';
    const paths = spec.paths;
    if (!paths) { this.endpointGroups = []; return; }

    const groupsMap = new Map<string, Endpoint[]>();

    Object.keys(paths).forEach(path => {
      const pathItem = paths[path]!;
      METHOD_ORDER.forEach(method => {
        const op = pathItem[method];
        if (!op) return;
        const tag = (op.tags && op.tags[0]) || 'General';
        if (!RISK_ALLOWED_TAGS.includes(tag)) return;
        const endpoint = this.buildEndpoint(spec, method, path, op);
        if (!groupsMap.has(tag)) groupsMap.set(tag, []);
        groupsMap.get(tag)!.push(endpoint);
      });
    });

    const orderedTags = RISK_ALLOWED_TAGS.filter(t => groupsMap.has(t));
    this.endpointGroups = orderedTags.map(tag => ({
      tag,
      endpoints: groupsMap.get(tag) || [],
      expanded: false
    }));
  }

  private checkStatus(baseUrlFromSpec: string): void {
    const urlToCheck = (baseUrlFromSpec || OPENAPI_URL).replace(/\/$/, '') + '/health';
    this.statusMode = 'checking';
    this.http.get(urlToCheck, { observe: 'response', responseType: 'text' }).subscribe({
      next: res => {
        if (res.status >= 200 && res.status < 300) {
          this.setStatus('up', 'Operational', 'API is responding normally.', 'health endpoint');
        } else if (res.status >= 500) {
          this.setStatus('down', 'Unavailable', `Server responded with status ${res.status}.`, 'health endpoint');
        } else {
          this.setStatus('degraded', 'Degraded', `Received status ${res.status} from health check.`, 'health endpoint');
        }
      },
      error: () => this.setStatus('down', 'Unavailable', 'Could not reach API. Check network or base URL.', 'health endpoint')
    });
  }

  private loadSpec(): void {
    this.loading = true;
    this.loadError = null;
    this.http.get<OpenApiSpec>(OPENAPI_URL + '/swagger/v1/swagger.json').subscribe({
      next: spec => {
        this.spec = spec;
        this.loading = false;
        this.processSpec(spec);
        const baseUrlFromSpec = this.getBaseUrlFromSpec(spec);
        this.baseUrl = baseUrlFromSpec || 'not specified in spec';
        this.cdr.detectChanges();
        this.checkStatus(baseUrlFromSpec);
      },
      error: err => {
        console.error('Error loading OpenAPI spec:', err);
        this.loading = false;
        this.loadError = 'Could not load API definition. Check the OPENAPI_URL or your network.';
        this.setStatus('down', 'Unavailable', 'OpenAPI document could not be loaded.', 'swagger json');
      }
    });
  }

  toggleSampleRow(row: SampleRow): void {
    row.expanded = !row.expanded;
    this.cdr.detectChanges();
  }

  toggleEndpointGroup(group: EndpointGroup): void {
    group.expanded = !group.expanded;
    this.cdr.detectChanges();
  }

  setActiveTab(endpoint: Endpoint, tab: 'curl' | 'js' | 'python'): void {
    endpoint.activeTab = tab;
  }

  isActiveTab(endpoint: Endpoint, tab: 'curl' | 'js' | 'python'): boolean {
    return endpoint.activeTab === tab;
  }

  trackByTag(_index: number, group: EndpointGroup): string { return group.tag; }
  trackByEndpoint(_index: number, endpoint: Endpoint): string { return `${endpoint.method}:${endpoint.path}`; }
}
