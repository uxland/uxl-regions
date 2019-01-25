import {RegionHost} from "../../../src/region-host-mixin";
import {LitElement, html} from "lit-element";
import {customElement} from "lit-element/lib/decorators";
import {region} from "../../../src/region-decorator";
import {IRegion} from "../../../src";
@customElement('region-app')
export class RegionApp extends RegionHost(LitElement){
    @region({name: 'region', targetId: 'region-host'})
    region: IRegion;

    render(){
        return html`<div id='region-host'></div>`;
    }
}
