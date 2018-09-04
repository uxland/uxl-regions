import {ViewComponent, ViewDefinition} from "../view-definition";
import {defaultBehaviorRegistry} from "../behaviors/default-registry";
import {IRegionAdapter, IRegionBehavior, IRegionHost} from "../region";

export class AdapterBase implements IRegionAdapter{
    constructor(public host: IRegionHost){
    }

    get behaviors(): IRegionBehavior[]{
        return defaultBehaviorRegistry.behaviors.map(b => new b(this.host.uxlRegion));
    };

    activateView(view: HTMLElement & ViewComponent) {
        if(!this.host.contains(view))
            this.addViewToHost(view);
        view.hidden = false;
    }

    deactivateView(view: HTMLElement & ViewComponent) {
        if(view.view.removeFromDomWhenDeactivated){
            this.host.removeChild(view);
            this.host.uxlRegion.viewRemovedFromDom(view.view);
        }
        else
            view.hidden = true;
    }

    viewAdded(view: ViewDefinition) {
    }

    protected addViewToHost(view: HTMLElement & ViewComponent){
        this.host.appendChild(view);
    }
}