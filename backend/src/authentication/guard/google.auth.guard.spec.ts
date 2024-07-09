import { GoogleAuthGuard } from './google.auth.guard';

describe('AuthenticationGuard', () => {
  it('should be defined', () => {
    expect(new GoogleAuthGuard()).toBeDefined();
  });
});
