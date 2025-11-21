export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head';

export interface OpenApiParameter {
  name: string;
  in: string;
  required?: boolean;
  description?: string;
  schema?: {
    type?: string;
    $ref?: string;
  };
}

export interface OpenApiOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: OpenApiParameter[];
}

export interface OpenApiPaths {
  [path: string]: {
    [method in HttpMethod]?: OpenApiOperation;
  };
}

export interface OpenApiSpec {
  openapi?: string;
  swagger?: string;
  servers?: { url: string }[];
  host?: string;
  basePath?: string;
  schemes?: string[];
  paths?: OpenApiPaths;
}

export type StatusMode = 'checking' | 'up' | 'down' | 'degraded';

export interface CodeSamples {
  curl: string;
  js: string;
  python: string;
}

export interface EndpointParam {
  name: string;
  in: string;
  type: string;
  required: boolean;
  description: string;
}

export interface Endpoint {
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  operationId: string;
  params: EndpointParam[];
  code: CodeSamples;
  activeTab: 'curl' | 'js' | 'python';
  expanded: boolean;
}

export interface EndpointGroup {
  tag: string;
  endpoints: Endpoint[];
  expanded: boolean;

}

export const METHOD_ORDER: HttpMethod[] = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'head'
];
