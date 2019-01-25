import {customElement} from 'lit-element/lib/decorators'
import {html, LitElement} from 'lit-element/lit-element'
import {region} from "../src/region-decorator";
import {regionManager} from "../src/region-manager";
import {RegionHost} from "../src/region-host-mixin";
import {IRegion} from "../src";
@customElement('demo-app')
export class DemoApp extends RegionHost(LitElement){
    _render(props: DemoApp){
        return html `<div id="multi-region"></div>`
    }
    @region({name: 'multiRegion', targetId: 'multi-region'})
    multiRegion: IRegion;
}
const spanFactory = (content) => () =>{
    let span = document.createElement('span');
    span.textContent = content;
    return <any>span
}
regionManager.registerViewWithRegion('multiRegion', 'view1', {sortHint: '001', factory: spanFactory('view1')});
regionManager.registerViewWithRegion('multiRegion', 'view2', {sortHint: '003', factory: spanFactory('view2')});
regionManager.registerViewWithRegion('multiRegion', 'view3', {sortHint: '000', factory: spanFactory('view3')});
regionManager.registerViewWithRegion('multiRegion', 'view4', {sortHint: '002', factory: spanFactory('view4')});
