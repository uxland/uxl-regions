import {IRegion, IRegionBehavior} from "../region";
export class AutoPopulateBehavior implements IRegionBehavior{
    constructor(private targetRegion: IRegion){}
    attach(): void {
        let views = this.targetRegion.regionManager.getRegisteredViews(this.targetRegion.name);
        views.forEach(view => this.targetRegion.addView(view.key, view.view));
    }

    detach(): void {
    }
}