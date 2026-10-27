import {
  ArgumentsHost,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ApiExceptionFilter } from './api-exception.filter';

function createHost() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ method: 'GET', url: '/users' }),
    }),
  } as unknown as ArgumentsHost;

  return { host, status, json };
}

describe('ApiExceptionFilter', () => {
  let filter: ApiExceptionFilter;

  beforeEach(() => {
    filter = new ApiExceptionFilter();
    jest.spyOn(filter['logger'], 'error').mockImplementation();
  });

  it('maps known HTTP statuses to their error code', () => {
    const { host, status, json } = createHost();

    filter.catch(new NotFoundException(), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json.mock.calls[0][0]).toMatchObject({
      success: false,
      error: { code: 'NOT_FOUND' },
      path: '/users',
    });
  });

  it('maps 409 to CONFLICT instead of the generic API_ERROR', () => {
    const { host, json } = createHost();

    filter.catch(new ConflictException(), host);

    expect(json.mock.calls[0][0].error.code).toBe('CONFLICT');
  });

  it('hides unexpected errors behind a 500 and logs them', () => {
    const { host, status, json } = createHost();

    filter.catch(new Error('db exploded'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json.mock.calls[0][0].error).toMatchObject({
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    });
    expect(filter['logger'].error).toHaveBeenCalled();
  });
});
