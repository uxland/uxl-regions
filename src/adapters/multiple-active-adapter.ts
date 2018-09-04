import {AdapterBase} from "./adapter-base";
import {ViewComponent, ViewDefinition} from "../view-definition";
import {viewSortHintComparer} from "../utilities/view-sort-hint-comparer";
import {adapterFactory} from "../region-adapter-registry";

export class MultipleActiveAdapter extends AdapterBase{
    async viewAdded(view: ViewDefinition){
        await this.host.uxlRegion.activate(view);
    }

    protected addViewToHost(view: HTMLElement & ViewComponent){
        let sortedViews = this.host.uxlRegion.currentActiveViews.sort(viewSortHintComparer);
        let index = sortedViews.indexOf(view.view);
        if(index >= this.host.children.length)
            super.addViewToHost(view);
        else
            this.host.insertBefore(view, this.host.children[index]);
    }
}
export const factory: adapterFactory = (definition, target) => new MultipleActiveAdapter(target);