import {RegionHost} from '../../../src';
import {customElement} from 'lit/decorators.js';
import {region} from '../../../src';
import {IRegion} from '../../../src';
import {LitElement, html} from 'lit';
@customElement('region-app')
export class RegionApp extends RegionHost(LitElement) {
  constructor() {
    super();
  }
  @region({name: 'region', targetId: 'region-host'})
  region: IRegion;

  render() {
    return html`<div id="region-host"></div>`;
  }
}
