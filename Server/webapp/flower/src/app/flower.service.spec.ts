import { TestBed, inject } from '@angular/core/testing';

import { FlowerService } from './flower.service';

describe('FlowerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlowerService]
    });
  });

  it('should be created', inject([FlowerService], (service: FlowerService) => {
    expect(service).toBeTruthy();
  }));
});
