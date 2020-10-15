import ICacheProvider from '../models/ICacheProvider';

interface ICachedData {
  [key: string]: string;
}

class FakeCacheProvider implements ICacheProvider {
  private cachedData: ICachedData = {};

  public async save(key: string, value: any): Promise<void> {
    this.cachedData[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cachedData[key];

    if (!data) return null;

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cachedData[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cachedData).filter((key) =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach((key) => delete this.cachedData[key]);
  }
}

export default FakeCacheProvider;
