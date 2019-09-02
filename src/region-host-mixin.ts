import { IRegion, RegionDefinition } from './region';
import { regionsProperty } from './region-decorator';
import { IRegionManager, regionManager } from './region-manager';
import { regionFactory } from './region-factory';
import { regionAdapterRegistry, RegionAdapterRegistry } from './region-adapter-registry';
import { factory } from './adapters/multiple-active-adapter';
import { Constructor, LitElement, PropertyValues } from 'lit-element';
import { MixinFunction, dedupingMixin, microTask } from '@uxland/uxl-utilities';

export interface IRegionHostMixin<T = any> extends LitElement {
  new (): IRegionHostMixin<T> & T & LitElement;
}
export interface RegionHostMixin extends LitElement {
  regionsCreated(): void;
}
export interface RegionHostMixinConstructor extends LitElement {
  new (...args: any[]): RegionHostMixin & LitElement;
}
export type RegionHostMixinFunction = MixinFunction<RegionHostMixinConstructor>;

const getUxlRegions: (item: any) => { [key: string]: RegionDefinition } = item => item.constructor[regionsProperty] || {};
export const RegionHostMixin: (regionManager: IRegionManager, adapterRegistry: RegionAdapterRegistry) => RegionHostMixinFunction = (
  regionManager1,
  adapterRegistry
) =>
  dedupingMixin((superClass: Constructor<LitElement>) => {
    class RegionHostMixinClass extends superClass implements RegionHostMixin {
      protected firstUpdated(changedProperties: PropertyValues): void {
        super.firstUpdated(changedProperties);
        let regions = getUxlRegions(this);
        microTask.run(async () => {
          for (let name in regions) {
            let region = await regionFactory(regions[name], this, regionManager, adapterRegistry);
            this[name] = region;
            let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
            behaviors.forEach(b => b.attach());
          }
          this.regionsCreated();
        });
      }
      regionsCreated() {}
      disconnectedCallback(): void {
        super.disconnectedCallback();
        let regions = getUxlRegions(this);
        Object.keys(regions).forEach(name => {
          let region = this[name] as IRegion;
          if (region) {
            region.regionManager.remove(region);
            let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
            behaviors.forEach(b => b.detach());
          }
        });
      }
    }
    return <any>RegionHostMixinClass;
  });

regionAdapterRegistry.registerDefaultAdapterFactory(factory);

export const RegionHost: RegionHostMixinFunction = RegionHostMixin(regionManager, regionAdapterRegistry);
