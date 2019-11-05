import {IRegion, IRegionBehavior} from "../region";
import * as R from 'ramda';
import {nop} from "@uxland/uxl-utilities";
export class AutoPopulateBehavior implements IRegionBehavior{
    constructor(private targetRegion: IRegion){}
    async attach(): Promise<void> {
        let views = this.targetRegion.regionManager.getRegisteredViews(this.targetRegion.name);
        return R.pipe(
            R.map<any, Promise<any>>(view => this.targetRegion.addView(view.key, view.view)),
            R.bind(Promise.all, Promise),
            R.then(nop)
        )(views);
    }

    detach(): Promise<void> {
        return  Promise.resolve();
    }
}