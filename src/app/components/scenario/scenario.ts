import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { exampleService } from '../../services/example';

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
          requestExample: exampleService.getSampleRequest('occupancy.search').code,
          responseExample: exampleService.getSampleResponse('occupancy.search').code
        },
        {
          title: 'Step 2 · Risk Appetite Check API',
          description:
            'Send the classification result to the Risk Appetite Check API to determine if the risk fits current underwriting appetite.',
          requestExample: exampleService.getSampleRequest('appetite.check').code,
          responseExample: exampleService.getSampleResponse('appetite.check').code
        },
        {
          title: 'Step 3 · Quote API (create quote when appetite is approved)',
          description:
            'If the appetite decision is APPROVED, create the quote using the Quote API.',
          requestExample: exampleService.getSampleRequest('bop.create.quote').code,
          responseExample: exampleService.getSampleResponse('bop.create.quote').code
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
