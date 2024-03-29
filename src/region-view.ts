import {Constructor, MixinFunction, dedupingMixin, propertiesObserver} from '@uxland/uxl-utilities';
import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {ViewDefinition} from './view-definition';
export interface IRegionView {
  active: boolean;
  activeChanged(current: boolean, previous: boolean);
  view: ViewDefinition;
  regionContext: any;
  regionContextChanged(current: any, previous: any);
}
export interface RegionViewConstructor extends LitElement {
  new (...args: any[]): IRegionView & LitElement;
}
export interface IRegionViewMixin<T = any> extends IRegionView, LitElement {
  new (): IRegionViewMixin<T> & T & LitElement;
}
export type RegionViewFunction = MixinFunction<RegionViewConstructor>;

export const regionView: RegionViewFunction = dedupingMixin(
  (superClass: Constructor<LitElement | any>) => {
    class RegionView extends propertiesObserver(superClass) implements IRegionView {
      @property({type: Boolean})
      active: boolean;
      activeChanged(current: boolean, previous: boolean) {}
      view: ViewDefinition;
      @property()
      regionContext: any;
      regionContextChanged(newContext: any, oldContext: any) {}
    }
    return <any>RegionView;
  }
);
