import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { CsrfStateGuard } from './csrf-state.guard';

describe('CsrfStateGuard', () => {
  let guard: CsrfStateGuard;
  let context: ExecutionContext;

  beforeEach(() => {
    guard = new CsrfStateGuard();
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          query: { state: 'mock-state' },
          session: { state: 'mock-state' },
        }),
      }),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when state is valid', () => {
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException when state is invalid', () => {
    const getRequestMock = jest.fn().mockReturnValue({
      query: { state: 'invalid-state' },
      session: { state: 'valid-state' },
    }) as unknown as () => Request;
    context.switchToHttp().getRequest<Request> = getRequestMock;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
