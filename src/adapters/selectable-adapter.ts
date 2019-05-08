import {IRegionHost} from "../region";
import {ViewComponent} from "../view-definition";
import {SingleActiveAdapter} from "./single-active-adapter";

export class SelectableAdapter extends SingleActiveAdapter{
    protected attrForSelected: string = 'name';
    protected attrForSelectedProperty = 'attrForSelected';
    protected selectedProperty = 'selected';
    constructor(host: IRegionHost){
        super(host);
        host[this.attrForSelectedProperty] = this.attrForSelected;
    }
    activateView(view: HTMLElement & ViewComponent) {
        this.host.uxlRegion.currentActiveViews.filter(v => v !== view.view)
            .forEach(v => this.host.uxlRegion.deactivate(v));
        if(!this.host.contains(view))
            this.addViewToHost(view);
        if(!view[this.attrForSelected])
            view[this.attrForSelected] = view.viewKey;
        this.host[this.selectedProperty] = view.viewKey;
    }
    deactivateView(view: HTMLElement & ViewComponent){
        if(this.host[this.selectedProperty] === view.viewKey){
            this.host[this.selectedProperty] = null;
            super.deactivateView(view);
        }

    }
}
export const factory = (definition, target) => new SelectableAdapter(target);