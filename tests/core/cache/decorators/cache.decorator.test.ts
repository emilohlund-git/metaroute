import { Cache } from '@core/cache/decorators/cache.decorator';
import { CacheOptions } from '@core/cache/interfaces/cache-options.interface';
import { CACHE_METADATA_KEY } from '@core/common/constants/metadata-keys.constants';
import 'reflect-metadata';

describe('Cache decorator', () => {
    it('should define metadata for the target with the given options', () => {
        const options: CacheOptions = { ttl: 60 };
        const target = {};
        const propertyKey = 'test';

        Cache(options)(target, propertyKey, {});

        const metadata = Reflect.getMetadata(CACHE_METADATA_KEY, target, propertyKey);
        expect(metadata).toEqual(options);
    });

    it('should overwrite existing metadata for the target', () => {
        const options1: CacheOptions = { ttl: 60 };
        const options2: CacheOptions = { ttl: 120 };
        const target = {};
        const propertyKey = 'test';

        Cache(options1)(target, propertyKey, {});
        Cache(options2)(target, propertyKey, {});

        const metadata = Reflect.getMetadata(CACHE_METADATA_KEY, target, propertyKey);
        expect(metadata).toEqual(options2);
    });
});