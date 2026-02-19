import { Injectable } from '@angular/core';
import { API_SAMPLES, SAMPLE_RESPONSE, type ApiSample, type SampleId } from '../types/samples';

@Injectable({
  providedIn: 'root',
})
export class ExampleService {

  private requestById: Map<SampleId, ApiSample>;
  private responseById: Map<SampleId, ApiSample> = new Map(SAMPLE_RESPONSE.map(s => [s.id, s]));


  constructor() {
    this.requestById = new Map(API_SAMPLES.map(s => [s.id, s]));
  }

  listRequestSamples(): ApiSample[] {
    return Array.from(this.requestById.values());
  }

  listResponseSamples(): ApiSample[] {
    return Array.from(this.responseById.values());
  }

  getSampleRequest(id: SampleId): ApiSample {
    const req = this.requestById.get(id);
    if (!req) {
      throw new Error(`Request sample with id ${id} not found`);
    }
    return req;
  }

  getSampleResponse(id: SampleId): ApiSample {
    const res = this.responseById.get(id);  
    if (!res) {
      throw new Error(`Response sample with id ${id} not found`);
    }
    return res;
  }
}

export const exampleService = new ExampleService();
