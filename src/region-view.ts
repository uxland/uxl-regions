import {LitElement} from "lit-element";
import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import {property} from "lit-element/lib/decorators";
import {propertiesObserver} from '@uxland/uxl-utilities/properties-observer';
export interface IRegionView {
    active: boolean;
    activeChanged(current: boolean, previous: boolean);

}
export interface IRegionViewMixin<T = any> extends IRegionView, LitElement{
    new(): IRegionViewMixin<T> & T & LitElement;
}

export const RegionView: <T>(parent: any) => IRegionViewMixin<T> = dedupingMixin( p =>{
    class mixin extends propertiesObserver(p){
        @property()
        active: boolean;
        activeChanged(current: boolean, previous: boolean){}
    }
    return (<any> mixin) as IRegionViewMixin;
});

