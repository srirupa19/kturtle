import { TestBed } from '@angular/core/testing';

import { TurtleService } from './turtle.service';

describe('TurtleService', () => {
  let service: TurtleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurtleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
