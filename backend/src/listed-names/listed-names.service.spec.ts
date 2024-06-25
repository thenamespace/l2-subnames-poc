import { Test, TestingModule } from '@nestjs/testing';
import { ListedNamesService } from './listed-names.service';

describe('ListedNamesService', () => {
  let service: ListedNamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListedNamesService],
    }).compile();

    service = module.get<ListedNamesService>(ListedNamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
