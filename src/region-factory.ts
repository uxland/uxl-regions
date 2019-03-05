import {Region, RegionDefinition} from "./region";
import {IRegionManager} from "./region-manager";
import {RegionAdapterRegistry} from "./region-adapter-registry";
import {invariant} from '@uxland/uxl-utilities/invariant';

const createAdapter = (definition: RegionDefinition, target: Element,adapterRegistry: RegionAdapterRegistry) =>{
    let adapterFactory = adapterRegistry.getAdapterFactory(target);
    invariant(typeof adapterFactory === 'function', 'No region adapter factory found for the host');
    return adapterFactory(definition, <any>target);
};
export const regionFactory = (definition: RegionDefinition, host: Element, regionManager: IRegionManager, adapterRegistry: RegionAdapterRegistry) =>{
    let target = host.shadowRoot.querySelector(`#${definition.targetId}`);
    let adapter = definition.adapterFactory ? definition.adapterFactory(definition, <any>target) : createAdapter(definition, target, adapterRegistry);
    invariant(adapter, 'No region adapter found for the host');
    let targetRegionManager = definition.scoped ? regionManager.createRegionManager() : regionManager;
    let region = new Region(definition.name, targetRegionManager, target as any, adapter, definition);
    targetRegionManager.add(definition.name, region);
    return region;
};