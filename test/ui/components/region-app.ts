import {RegionHost} from "../../../src/region-host-mixin";
import {LitElement, html} from "@polymer/lit-element";
import {customElement} from "@uxland/uxl-polymer2-ts";
import {region} from "../../../src/region-decorator";
import {IRegion} from "../../../src";
@customElement('region-app')
export class RegionApp extends RegionHost<LitElement>(LitElement){
    @region({name: 'region', targetId: 'region-host'})
    region: IRegion;

    _render(props: RegionApp){
        return html`<div id='region-host'></div>`;
    }
}