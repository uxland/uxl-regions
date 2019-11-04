import { IRegion, RegionDefinition } from './region';
import { regionsProperty } from './region-decorator';
import { IRegionManager, regionManager } from './region-manager';
import { regionFactory } from './region-factory';
import { regionAdapterRegistry, RegionAdapterRegistry } from './region-adapter-registry';
import { factory } from './adapters/multiple-active-adapter';
import { Constructor, LitElement} from 'lit-element';
import {MixinFunction, dedupingMixin, microTask} from '@uxland/uxl-utilities';
import * as R from 'ramda';
export interface IRegionHostMixin<T = any> extends LitElement {
  new (): IRegionHostMixin<T> & T & LitElement;
}
export interface RegionHostMixin extends LitElement {
  regionsCreated(): void;
}
export interface RegionHostMixinConstructor extends LitElement {
  new (...args: any[]): RegionHostMixin & LitElement;
}

const requiresCreation: (component: RegionHostMixin) => (definition: RegionDefinition) => boolean = component => definition => R.pipe(R.prop(definition.name), R.isNil)(component);
const requiresDeletion: (component: RegionHostMixin) => (definition: RegionDefinition) => boolean = component => definition =>
    !requiresCreation(component)(definition) && R.isNil(component.shadowRoot.querySelector(`#${definition.name}`));
const deleteRegion: (component: RegionHostMixin) => (definition: RegionDefinition) => Promise<RegionDefinition> = component => definition =>  {
    let region: IRegion = component[definition.name];
    region.regionManager.remove(region);
    let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
    behaviors.forEach(b => b.detach());
    return Promise.resolve(definition);
};
const createRegion: (component: RegionHostMixin, rm: IRegionManager, registry: RegionAdapterRegistry) => (definition: RegionDefinition) => Promise<RegionDefinition> = (component, rm, registry) => definition =>
    regionFactory(definition, component, rm, registry)
        .then(region =>{
            if(region){
                component[definition.name] = region;
                let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
                behaviors.forEach(b => b.attach());
            }
        })
        .catch()
        .then(R.always(definition));

const handleRegionCreation = (component: RegionHostMixin, regionManager1: IRegionManager, registry: RegionAdapterRegistry) => {
    const creationRequired = requiresCreation(component);
    const deletionRequired = requiresDeletion(component);
    const deletion = deleteRegion(component);
    const creation = createRegion(component, regionManager1, registry);
    return (definition: RegionDefinition) => R.cond([
        [creationRequired, creation],
        [deletionRequired, deletion],
        [R.T, R.always(Promise.resolve(definition))]
    ]
    )(definition)
};

export type RegionHostMixinFunction = MixinFunction<RegionHostMixinConstructor>;

const getUxlRegions: (item: any) => { [key: string]: RegionDefinition } = item => item.constructor[regionsProperty] || {};
export const RegionHostMixin: (regionManager: IRegionManager, adapterRegistry: RegionAdapterRegistry) => RegionHostMixinFunction = (
  regionManager1,
  adapterRegistry
) =>
  dedupingMixin((superClass: Constructor<LitElement>) => {
    class RegionHostMixinClass extends superClass implements RegionHostMixin {

      protected updated(_changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(_changedProperties);
        let regions = getUxlRegions(this);
        const handleCreation = handleRegionCreation(this, regionManager1, adapterRegistry);
        microTask.run( async () =>{
            await R.pipe(R.values, R.forEach(handleCreation))(regions);
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
