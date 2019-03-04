import {IRegionAdapter, IRegionHost, RegionDefinition} from "./region";

//export type adapterFactory = (definition: RegionDefinition, target: Element & IRegionHost) => IRegionAdapter;
export interface adapterFactory {
    (definition: RegionDefinition, target: Element & IRegionHost): IRegionAdapter;
    test?: (target: Element) => boolean;
}
const defaultAdapterKey = 'default';

export class RegionAdapterRegistry {
    adapterRegistry = new Map<any, adapterFactory>();

    registerAdapterFactory(key: any, adapter: adapterFactory) {
        this.adapterRegistry.set(key, adapter);
    }
    private getCustomAdapterFactory = (host: Element) =>{
        for (let entry of this.adapterRegistry){
            if(typeof entry[0] === 'string' && entry[0] !== defaultAdapterKey && entry[1].test && entry[1].test(host)){
                return entry[1]
            }
        }
    }
    private getFactory(host: Element): adapterFactory{
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

    getAdapterFactory(host: Element): adapterFactory {
        let res = this.getCustomAdapterFactory(host);
        return res || this.getFactory(host);
    }

    registerDefaultAdapterFactory(factory: adapterFactory) {
        this.adapterRegistry.set(defaultAdapterKey, factory);
    }
}
export const regionAdapterRegistry = new RegionAdapterRegistry();