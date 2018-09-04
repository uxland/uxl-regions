import {ViewComponent, ViewDefinition} from "./view-definition";
import {validateView} from "./validate-view";
import {invariant} from "@uxland/uxl-utilities/invariant";
import {viewFactory} from "./view-factory";
import {IRegionManager} from "./region-manager";

export interface IRegionHost extends Element{
    uxlRegion: IRegion;
}
export interface IRegionBehavior {
    attach(): void;
    detach(): void;
}
export interface IRegionAdapter {
    activateView(view: HTMLElement & ViewComponent);
    deactivateView(view: HTMLElement & ViewComponent);
    viewAdded(view: ViewDefinition);
    behaviors: IRegionBehavior[];
}
export interface RegionDefinition {
    name: string;
    targetId: string;
    scoped?: boolean;
    options?: any;
}
export interface IRegion {
    name: string;
    regionManager: IRegionManager;
    host: HTMLElement & IRegionHost;
    adapter: IRegionAdapter;
    readonly currentActiveViews: ViewDefinition[];
    readonly currentViews: ViewDefinition[];
    addView(key: string, view: ViewDefinition): Promise<IRegion>;

    removeView(view: string): void;

    activate(view: string | ViewDefinition): Promise<IRegion>;

    deactivate(view: string | ViewDefinition): void;

    getView(key: string): ViewDefinition;

    viewRemovedFromDom(view: ViewDefinition);

    getKey(view: ViewDefinition): string;
}

export class Region implements IRegion{
    private views: {[key: string]: ViewDefinition} = {}
    private activeViews: ViewDefinition[] = [];

    private components = new WeakMap<ViewDefinition, HTMLElement & ViewComponent>();
    constructor(public name: string, public regionManager: IRegionManager, public host: HTMLDListElement & IRegionHost, public adapter: IRegionAdapter, public definition: RegionDefinition){
        this.host.uxlRegion = this;
    }

    async addView(key: string, view: ViewDefinition): Promise<IRegion> {
        validateView(view);
        invariant(typeof this.getView(key) === 'undefined', `Already exists a view with key ${key}`);
        this.views[key] = view;
        await this.adapter.viewAdded(view);
        return this;
    }

    removeView(view: string) {
        this.deactivate(this.getView(view));
        delete this.views[view as string];
    }

    async activate(view: string | ViewDefinition) {
        let vw: ViewDefinition = view as ViewDefinition;
        if (typeof view === 'string') {
            vw = this.getView(view);
            invariant(vw, `Region does not contain a view with key ${view}`);
        }
        else
            invariant(Object.keys(this.views).some(key => typeof this.views[key] !== 'undefined'), 'Region does not contain this view');
        if (!this.activeViews.some(v => v === vw)) {
            if (!this.components.has(vw)) {
                let element = await viewFactory(vw, this, typeof view === 'string' ? view : this.getKey(vw));
                this.components.set(vw, element);
            }
            let element = this.components.get(vw);
            this.activeViews.push(vw);
            element.active = true;
            this.adapter.activateView(element);
        }
        return this;
    }
    viewRemovedFromDom(view: ViewDefinition){
        this.components.delete(view);
    }
    deactivate(view: string | ViewDefinition) {
        let v: ViewDefinition = typeof view === 'string' ? this.getView(view) : view as ViewDefinition;
        let index = this.activeViews.indexOf(v);
        if (index !== -1)
            this.activeViews.splice(index, 1);
        let component = this.components.get(v);
        if (component) {
            component.active = false;
            this.adapter.deactivateView(component);
        }
    }

    getView(key: string): ViewDefinition {
        return this.views[key];
    }

    get currentViews(): ViewDefinition[]{
        return Object.keys(this.views).map(key => this.views[key]);
    }

    get currentActiveViews(): ViewDefinition[] {
        return [...this.activeViews];
    }
    getKey(view: ViewDefinition): string{
        return Object.keys(this.views).find(k => this.views[k] == view);
    }

}