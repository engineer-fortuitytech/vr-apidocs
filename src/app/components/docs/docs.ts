import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
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

// === CONFIG ===

const APPETITE_OPENAPI_URL = 'https://appetitecheck-uat.fortuitytech.com/';
const OPENAPI_URL =
  //(window as any).APPETITE_OPENAPI_URL ||
  'https://appetitecheck-uat.fortuitytech.com';

// Optional health endpoint (e.g. '/health')
const HEALTHCHECK_PATH: string | null =
  (window as any).APPETITE_HEALTH_PATH || null;



@Component({
  selector: 'app-docs',
  imports: [CommonModule],
  templateUrl: './docs.html',
  styleUrl: './docs.css',
})
export class Docs  implements OnInit {
  title = 'Breeze API';

  loading = true;
  loadError: string | null = null;

  spec: OpenApiSpec | null = null;
  baseUrl = 'auto-detected from OpenAPI';

  endpointGroups: EndpointGroup[] = [];

  // Status panel state
  statusMode: StatusMode = 'checking';
  statusText = 'Checking…';
  statusDescription = 'Pinging API definition to check availability.';
  statusLastChecked: string | null = null;
  statusSourceLabel = 'health endpoint';

  constructor(private http: HttpClient,
              private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSpec();
    this.toggleAllEndpointGroups(false);
  }

  // --- Status helpers ---

  get statusPillClasses(): string {
    if (this.statusMode === 'up') {
      return 'border-emerald-500/60 bg-emerald-900/60 text-emerald-100';
    }
    if (this.statusMode === 'down') {
      return 'border-red-500/70 bg-red-900/60 text-red-100';
    }
    if (this.statusMode === 'degraded') {
      return 'border-amber-500/70 bg-amber-900/60 text-amber-100';
    }
    // checking
    return 'border-slate-500/60 bg-slate-900/80 text-slate-200';
  }

  get statusDotClasses(): string {
    if (this.statusMode === 'up') {
      return 'h-2 w-2 rounded-full bg-emerald-400 animate-pulse';
    }
    if (this.statusMode === 'down') {
      return 'h-2 w-2 rounded-full bg-red-400 animate-pulse';
    }
    if (this.statusMode === 'degraded') {
      return 'h-2 w-2 rounded-full bg-amber-400 animate-pulse';
    }
    return 'h-2 w-2 rounded-full bg-slate-400 animate-pulse';
  }

  private setStatus(
    mode: StatusMode,
    text: string,
    description: string,
    sourceLabel: string
  ): void {
    this.statusMode = mode;
    this.statusText = text;
    this.statusDescription = description;
    this.statusSourceLabel = sourceLabel;
    this.statusLastChecked = new Date().toLocaleTimeString();
    this.cdr.detectChanges();
  }

  private getBaseUrlFromSpec(spec: OpenApiSpec): string {
    if (spec.servers && spec.servers.length > 0 && spec.servers[0].url) {
      return spec.servers[0].url;
    }

    if (spec.host) {
      const scheme = (spec.schemes && spec.schemes[0]) || 'https';
      const basePath = spec.basePath || '';
      return `${scheme}://${spec.host}${basePath}`;
    }

    try {
      const url = new URL(OPENAPI_URL);
      return url.origin;
    } catch {
      return '';
    }
  }

  private buildCodeSamples(
    method: HttpMethod,
    fullUrl: string
  ): CodeSamples {
    const curl =
      `curl -X ${method.toUpperCase()} "${fullUrl}" \\\n` +
      `  -H "accept: application/json"`;

    const js =
      `fetch("${fullUrl}", {\n` +
      `  method: "${method.toUpperCase()}",\n` +
      `  headers: {\n` +
      `    "accept": "application/json"\n` +
      `  }\n` +
      `})\n` +
      `  .then(response => response.json())\n` +
      `  .then(console.log)\n` +
      `  .catch(console.error);`;

    const python =
      `import requests\n\n` +
      `url = "${fullUrl}"\n` +
      `headers = {"accept": "application/json"}\n\n` +
      `response = requests.${method}(url, headers=headers)\n\n` +
      `print(response.status_code)\n` +
      `print(response.json())`;

    return { curl, js, python };
  }

  private mapParams(params: OpenApiParameter[] | undefined): EndpointParam[] {
    if (!params || params.length === 0) return [];
    return params.map(p => {
      let type = '';
      if (p.schema?.type) {
        type = p.schema.type;
      } else if (p.schema?.$ref) {
        type = p.schema.$ref.split('/').pop() || '';
      }

      return {
        name: p.name,
        in: p.in,
        type,
        required: !!p.required,
        description: p.description || ''
      };
    });
  }

  private buildEndpoint(
    spec: OpenApiSpec,
    method: HttpMethod,
    path: string,
    operation: OpenApiOperation
  ): Endpoint {
    const baseUrl = this.getBaseUrlFromSpec(spec);
    const fullUrl = `${baseUrl || ''}${path}`;
    const opId = operation.operationId || `${method.toUpperCase()} ${path}`;

    return {
      method,
      path,
      summary: operation.summary || '',
      description: operation.description || '',
      operationId: opId,
      params: this.mapParams(operation.parameters),
      code: this.buildCodeSamples(method, fullUrl),
      activeTab: 'curl',
      expanded: false
    };
  }

  toggleEndpointGroup(endpointGroup: EndpointGroup): void {
    endpointGroup.expanded = !endpointGroup.expanded;
    this.cdr.detectChanges();
  }

  toggleAllEndpointGroups(expanded: boolean): void {
    const allExpanded = this.endpointGroups.every(g => g.expanded);
    this.endpointGroups.forEach(g => (g.expanded = !allExpanded));
    this.cdr.detectChanges();
  }

  private processSpec(spec: OpenApiSpec): void {
    this.baseUrl = this.getBaseUrlFromSpec(spec) || 'not specified in spec';
    const paths = spec.paths;

    if (!paths) {
      this.endpointGroups = [];
      return;
    }

    const groupsMap = new Map<string, Endpoint[]>();

    Object.keys(paths).forEach(path => {
      const pathItem = paths[path]!;
      METHOD_ORDER.forEach(method => {
        const op = pathItem[method];
        if (!op) return;
        const tag = (op.tags && op.tags[0]) || 'General';
        const endpoint = this.buildEndpoint(spec, method, path, op);

        if (!groupsMap.has(tag)) {
          groupsMap.set(tag, []);
        }
        groupsMap.get(tag)!.push(endpoint);
      });
    });

    const groupNames = Array.from(groupsMap.keys()).sort();
    this.endpointGroups = groupNames.map(tag => ({
      tag,
      endpoints: groupsMap.get(tag) || [],
      expanded: false
    }));
  }

  private checkStatus(baseUrlFromSpec: string): void {
    const urlToCheck =
      baseUrlFromSpec && HEALTHCHECK_PATH
        ? baseUrlFromSpec.replace(/\/$/, '') + '/health'
        : OPENAPI_URL + '/health';
    
    console.log('Checking status at:', urlToCheck);

    const label =
      baseUrlFromSpec && HEALTHCHECK_PATH ? 'health endpoint' : 'health endpoint';

    this.statusMode = 'checking';
    this.statusText = 'Checking…';
    this.statusDescription = 'Pinging API definition to check availability.';
    this.statusSourceLabel = label;

    this.http.get(urlToCheck, { observe: 'response', responseType: 'text' }).subscribe({
      next: res => {
        // Angular HttpResponse has "ok" only in browser fetch, so check status
        if (res.status >= 200 && res.status < 300) {
          this.setStatus('up', 'Operational', 'API is responding normally.', label);
        } else if (res.status >= 500) {
          this.setStatus(
            'down',
            'Unavailable',
            `Server responded with status ${res.status}.`,
            label
          );
        } else {
          this.setStatus(
            'degraded',
            'Degraded',
            `Received status ${res.status} from health check.`,
            label
          );
        }
      },
      error: err => {
        console.error('Health check failed:', err);
        this.setStatus(
          'down',
          'Unavailable',
          'Could not reach API. Check network or base URL.',
          label
        );
      }
    });
  }

  private loadSpec(): void {
    this.loading = true;
    this.loadError = null;
    const specUrl = OPENAPI_URL+'/swagger/v1/swagger.json';
    this.http.get<OpenApiSpec>(specUrl).subscribe({
      next: spec => {
        this.spec = spec;
        this.loading = false;
        this.processSpec(spec);
        const baseUrlFromSpec = this.getBaseUrlFromSpec(spec);
        this.baseUrl = baseUrlFromSpec || 'not specified in spec';
        console.log('base url from spec:', this.baseUrl);
        this.cdr.detectChanges();
        this.checkStatus(baseUrlFromSpec);
      },
      error: err => {
        console.error('Error loading OpenAPI spec:', err);
        this.loading = false;
        this.loadError =
          'Could not load API definition. Check the OPENAPI_URL or your network.';
        this.setStatus(
          'down',
          'Unavailable',
          'OpenAPI document could not be loaded.',
          'swagger json'
        );
      }
    });
  }

  // --- Template helpers ---

  setActiveTab(endpoint: Endpoint, tab: 'curl' | 'js' | 'python'): void {
    endpoint.activeTab = tab;
  }

  isActiveTab(endpoint: Endpoint, tab: 'curl' | 'js' | 'python'): boolean {
    return endpoint.activeTab === tab;
  }

  trackByTag(_index: number, group: EndpointGroup): string {
    return group.tag;
  }

  trackByEndpoint(_index: number, endpoint: Endpoint): string {
    return `${endpoint.method}:${endpoint.path}:${endpoint.operationId}`;
  }

}
