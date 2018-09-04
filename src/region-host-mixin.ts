import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import {IRegion, RegionDefinition} from "./region";
import {regionsProperty} from "./region-decorator";
import {IRegionManager, regionManager} from "./region-manager";
import {regionFactory} from "./region-factory";
import {regionAdapterRegistry, RegionAdapterRegistry} from "./region-adapter-registry";
import {factory} from "./adapters/multiple-active-adapter";
import {LitElement} from "@polymer/lit-element";

export interface IRegionHostMixin<T = any> extends LitElement{
    new() : IRegionHostMixin<T> & T & LitElement;
}
const getUxlRegions: (item: any) => {[key: string]: RegionDefinition} = item => item.constructor[regionsProperty] || {};
export const RegionHostMixin = <T>(regionManager: IRegionManager, adapterRegistry: RegionAdapterRegistry)  => dedupingMixin(parent =>{
    class mixin extends parent{
        connectedCallback(){
            super.connectedCallback();
            let regions = getUxlRegions(this);
            Object.keys(regions).forEach(name =>{
                let region = regionFactory(regions[name], <any>this, regionManager, adapterRegistry);
                this[name] = region;
                let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
                behaviors.forEach(b => b.attach());
            });
        }
        disconnectedCallback(){
            super.disconnectedCallback();
            let regions = getUxlRegions(this);
            Object.keys(regions).forEach(name =>{
                let region = this[name] as IRegion;
                if(region){
                    region.regionManager.remove(region);
                    let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
                    behaviors.forEach(b => b.detach());
                }

            })
        }
    }
    return (<any>mixin) as IRegionHostMixin<T>;
});
regionAdapterRegistry.registerDefaultAdapterFactory(factory)

export const RegionHost: <T>(parent: any) => IRegionHostMixin<T> = <T>(parent) => RegionHostMixin<T>(regionManager, regionAdapterRegistry)(parent);


