import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistService {
  private blacklistedTokens: string[] = [];

  addToBlacklist(token: string) {
    this.blacklistedTokens.push(token);
  }

  isTokenBlacklisted(token: string) {
    return this.blacklistedTokens.includes(token);
  }
}
