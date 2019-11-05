import {IRegion, IRegionBehavior, RegionDefinition} from './region';
import { regionsProperty } from './region-decorator';
import { IRegionManager, regionManager } from './region-manager';
import { regionFactory } from './region-factory';
import { regionAdapterRegistry, RegionAdapterRegistry } from './region-adapter-registry';
import { factory } from './adapters/multiple-active-adapter';
import { Constructor, LitElement } from 'lit-element';
import {MixinFunction, dedupingMixin, microTask, debounce, Debouncer, timeOut} from '@uxland/uxl-utilities';
import * as R from 'ramda';
export interface IRegionHostMixin<T = any> extends LitElement {
  new (): IRegionHostMixin<T> & T & LitElement;
}
export interface RegionHostMixin extends LitElement {
  regionsCreated(newRegions: IRegion[]): void;
}
export interface RegionHostMixinConstructor extends LitElement {
  new (...args: any[]): RegionHostMixin & LitElement;
}
interface RegionDefinitionArgs {
  key: string;
  definition: RegionDefinition;
}
const requiresCreation: (component: RegionHostMixin) => (definition: RegionDefinitionArgs) => boolean = component => definition =>
  R.pipe(
    R.prop(definition.definition.name),
    R.isNil
  )(component);
const requiresDeletion: (component: RegionHostMixin) => (definition: RegionDefinitionArgs) => boolean = component => definition =>
  !requiresCreation(component)(definition) && R.isNil(component.shadowRoot.querySelector(`#${definition.definition.targetId}`));

const deleteRegion: (component: RegionHostMixin) => (definition: RegionDefinitionArgs) => Promise<RegionDefinitionArgs> = component => args => {
  let region: IRegion = component[args.key];
  region.regionManager.remove(region);
  let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
  delete component[args.key];
  return R.pipe(
      R.map((b: IRegionBehavior) => b.detach),
      R.bind(Promise.all, Promise),
      R.then(() => delete component[args.key]),
      R.then(R.always(undefined))
  )(behaviors);
};
const createRegion: (
  component: RegionHostMixin,
  rm: IRegionManager,
  registry: RegionAdapterRegistry
) => (definitionArgs: RegionDefinitionArgs) => Promise<RegionDefinitionArgs> = (component, rm, registry) => definitionArgs =>
  regionFactory(definitionArgs.definition, component, rm, registry)
    .then(region => {
      if (region) {
        component[definitionArgs.key] = region;
        let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
        return R.pipe(
            R.map((b: IRegionBehavior) => b.attach()),
            R.bind(Promise.all, Promise),
            R.then(R.always(region))
        )(behaviors);
      }
      else return undefined;
    })
    .catch(R.always(undefined));

const handleRegionCreation = (component: RegionHostMixin, regionManager1: IRegionManager, registry: RegionAdapterRegistry) => {
  const creationRequired = requiresCreation(component);
  const deletionRequired = requiresDeletion(component);
  const deletion = deleteRegion(component);
  const creation = createRegion(component, regionManager1, registry);
  return (args: RegionDefinitionArgs) =>
    R.cond([[creationRequired, creation], [deletionRequired, deletion], [R.T, R.always(Promise.resolve(undefined))]])(args);
};

export type RegionHostMixinFunction = MixinFunction<RegionHostMixinConstructor>;

type RegionDefinitions = {[key: string]: RegionDefinition};
const getUxlRegions: (item: any) => RegionDefinitions = item => item.constructor[regionsProperty] || {};
const toRegionDefinitionArgs: (regions: RegionDefinitions) => RegionDefinitionArgs[] = regions => R.pipe(R.keys, R.map(key => <RegionDefinitionArgs>{key, definition: regions[key]}))(regions);
export const RegionHostMixin: (regionManager: IRegionManager, adapterRegistry: RegionAdapterRegistry) => RegionHostMixinFunction = (
  regionManager1,
  adapterRegistry
) =>
  dedupingMixin((superClass: Constructor<LitElement>) => {
    class RegionHostMixinClass extends superClass implements RegionHostMixin {
      private debounce: null;
      protected updated(_changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(_changedProperties);
        this.create();
      }
      private createRegions(): Promise<any>{
          let regions = getUxlRegions(this);
          const handleCreation = handleRegionCreation(this, regionManager1, adapterRegistry);
          return R.pipe(
                  toRegionDefinitionArgs,
                  R.forEach(handleCreation),
                  R.bind(Promise.all, Promise),
                  R.then(R.reject(R.isNil)),
                  R.then(R.bind(this.regionsCreated, this))
              )(regions);
      }
      private create(){
          this.debounce = <any>Debouncer.debounce(this.debounce, timeOut.after(100), () => this.runRegionCreation());
      }
      private runRegionCreation(){
         return new Promise<any>(resolve => {
             this.createRegions()
                 .then(resolve)
                 .catch(resolve)
         });

      }
      regionsCreated(newRegions: IRegion[]) {
      }
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

