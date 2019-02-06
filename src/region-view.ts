import {Constructor, LitElement} from "lit-element";
import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import {property} from "lit-element/lib/decorators";
import {propertiesObserver} from '@uxland/uxl-utilities/properties-observer';
import {MixinFunction} from "@uxland/uxl-utilities/types";
export interface IRegionView {
    active: boolean;
    activeChanged(current: boolean, previous: boolean);

}
export interface RegionViewConstructor extends LitElement{
    new(...args: any[]): IRegionView & LitElement;
}
export interface IRegionViewMixin<T = any> extends IRegionView, LitElement{
    new(): IRegionViewMixin<T> & T & LitElement;
}
export type RegionViewFunction = MixinFunction<RegionViewConstructor>;

export const regionView: RegionViewFunction = dedupingMixin((superClass: Constructor<LitElement>) =>{
    class RegionView extends propertiesObserver(superClass) implements IRegionView{
        @property({type: Boolean})
        active: boolean;
        activeChanged(current: boolean, previous: boolean){}
    }
    return <any>RegionView;
} );


