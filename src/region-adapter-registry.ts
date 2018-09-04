import {IRegionAdapter, IRegionHost, RegionDefinition} from "./region";

export type adapterFactory = (definition: RegionDefinition, target: Element & IRegionHost) => IRegionAdapter;

const defaultAdapterKey = 'default';

export class RegionAdapterRegistry {
    adapterRegistry = new Map<any, adapterFactory>();

    registerAdapterFactory(key: any, adapter: adapterFactory) {
        this.adapterRegistry.set(key, adapter);
    }

    getAdapterFactory(host: Element): adapterFactory {
        if (this.adapterRegistry.has(host.constructor))
            return this.adapterRegistry.get(host.constructor);
        if (this.adapterRegistry.has(host.localName))
            return this.adapterRegistry.get(host.localName);
        if (this.adapterRegistry.has(host.tagName))
            return this.adapterRegistry.get(host.tagName);
        if (this.adapterRegistry.has(defaultAdapterKey))
            return this.adapterRegistry.get(defaultAdapterKey);
        return null;
    }

    registerDefaultAdapterFactory(factory: adapterFactory) {
        this.adapterRegistry.set(defaultAdapterKey, factory);
    }
}
export const regionAdapterRegistry = new RegionAdapterRegistry();