import {ViewComponent, ViewDefinition} from "../view-definition";
import {AdapterBase} from "./adapter-base";

export class SingleActiveAdapter extends AdapterBase{

    activateView(view: HTMLElement & ViewComponent) {
        this.host.uxlRegion.currentActiveViews.filter(v => v !== view.view)
            .forEach(v => this.host.uxlRegion.deactivate(v));
        super.activateView(view);
    }

    deactivateView(view: HTMLElement & ViewComponent) {
        super.deactivateView(view);
        let defaultView = this.host.uxlRegion.currentViews.find(v => v.isDefault);
        defaultView && view.view !== defaultView && this.host.uxlRegion.activate(defaultView);
    }

    async viewAdded(view: ViewDefinition) {
        if(!this.host.uxlRegion.currentActiveViews.length && view.isDefault)
            await this.host.uxlRegion.activate(view);
    }
}
export const factory = (definition, target) => new SingleActiveAdapter(target);
