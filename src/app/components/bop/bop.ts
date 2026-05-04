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
import {
  type FieldValue,
  type SampleRow,
  CONTENT,
} from '../../data/content.data';

export type { FieldValue, SampleRow };

const OPENAPI_URL = 'https://appetitecheck-uat.fortuitytech.com';

const BOP_ALLOWED_TAGS = ['BOPAppetiteChecker', 'Occupancy', 'Product'];

const BOP_ALLOWED_OPERATIONS = [
  'CheckAppetite',
  'UpdateAppetiteCheck',
  'GetAppetiteCheck',
  'GetRatedQuote',
  'CreateRatedQuote'
];

@Component({
  selector: 'app-bop',
  imports: [CommonModule],
  templateUrl: './bop.html',
  styleUrl: './bop.css',
})
export class Bop implements OnInit {

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

  sampleRows: SampleRow[] = CONTENT.bop.sampleRows.map(r => ({ ...r }));

  roofShapeValues: FieldValue[] = CONTENT.bop.roofShapeValues;
  roofCoverValues: FieldValue[] = CONTENT.bop.roofCoverValues;
  exteriorMaterialValues: FieldValue[] = CONTENT.bop.exteriorMaterialValues;

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

  private isAllowedPath(tag: string, path: string): boolean {
    if (tag !== 'BOPAppetiteChecker') return true;
    const lower = path.toLowerCase();
    return BOP_ALLOWED_OPERATIONS.some(op => lower.includes(op.toLowerCase()));
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
        if (!BOP_ALLOWED_TAGS.includes(tag)) return;
        if (!this.isAllowedPath(tag, path)) return;
        const endpoint = this.buildEndpoint(spec, method, path, op);
        if (!groupsMap.has(tag)) groupsMap.set(tag, []);
        groupsMap.get(tag)!.push(endpoint);
      });
    });

    const orderedTags = BOP_ALLOWED_TAGS.filter(t => groupsMap.has(t));
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
