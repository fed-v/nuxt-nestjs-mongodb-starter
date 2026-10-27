import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

describe('UserService', () => {
  const stored = { id: 'abc123', name: 'Ada', email: 'ada@example.com' };
  const exec = jest.fn().mockResolvedValue([stored]);
  const limit = jest.fn().mockReturnValue({ exec });
  const skip = jest.fn().mockReturnValue({ limit });
  const find = jest.fn().mockReturnValue({ skip });
  const save = jest.fn().mockResolvedValue(stored);
  const userModel = jest.fn().mockImplementation(() => ({ save }));
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();
    Object.assign(userModel, { find });

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = moduleRef.get(UserService);
  });

  it('maps documents to response DTOs', async () => {
    await expect(service.findAll({})).resolves.toEqual([
      { _id: 'abc123', name: 'Ada', email: 'ada@example.com' },
    ]);
  });

  it('applies page and limit as skip/limit', async () => {
    await service.findAll({ page: 3, limit: 10 });

    expect(skip).toHaveBeenCalledWith(20);
    expect(limit).toHaveBeenCalledWith(10);
  });

  it('returns a response DTO from create', async () => {
    await expect(service.create({ name: 'Ada' })).resolves.toEqual({
      _id: 'abc123',
      name: 'Ada',
      email: 'ada@example.com',
    });
  });
});
