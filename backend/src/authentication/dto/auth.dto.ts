import { Providers } from '../constants';

type supportedSources = (typeof Providers)[keyof typeof Providers];

export class OAuthDTO {
  sourceId: string;
  source: supportedSources;
  accessToken: string;
  refreshToken: string;
  expires: Date | null;
}
