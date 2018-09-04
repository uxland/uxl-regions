import {Region, RegionDefinition} from "./region";
import {IRegionManager} from "./region-manager";
import {RegionAdapterRegistry} from "./region-adapter-registry";
import {invariant} from '@uxland/uxl-utilities/invariant';

export const regionFactory = (definition: RegionDefinition, host: Element, regionManager: IRegionManager, adapterRegistry: RegionAdapterRegistry) =>{
    let target = host.shadowRoot.querySelector(`#${definition.targetId}`);
    let adapterFactory = adapterRegistry.getAdapterFactory(target);
    invariant(typeof adapterFactory === 'function', 'No region adapter factory found for the host');
    let adapter = adapterFactory(definition, <any>target);
    invariant(adapter, 'No region adapter found for the host');
    let targetRegionManager = definition.scoped ? regionManager.createRegionManager() : regionManager;
    let region = new Region(definition.name, targetRegionManager, target as any, adapter, definition);
    targetRegionManager.add(definition.name, region);
    return region;
};