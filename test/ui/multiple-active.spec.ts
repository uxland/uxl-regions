import {regionManager} from "../../src/region-manager";
import {RegionApp} from "./components/region-app";

const {expect} = chai;

const delay = (amount = 100) => new Promise(resolve => setTimeout(resolve, amount));

describe('When having a multiple active region', () =>{
    beforeEach(() =>{
        regionManager.clear();
    });
    it('registered views should be added once a region is created', async() =>{
        regionManager.registerViewWithRegion('region', 'view1', {htmlTag: 'test-view1'});
        regionManager.registerViewWithRegion('region', 'view2', {htmlTag: 'test-view2'});
        regionManager.registerViewWithRegion('region', 'view3', {htmlTag: 'test-view3'});
        regionManager.registerViewWithRegion('region', 'view4', {htmlTag: 'test-view4'});
        let f: HTMLDivElement = fixture('test-fixture');
        f.appendChild(document.createElement('region-app'));
        let app: RegionApp = <any>f.querySelector('region-app');
        await delay();
        await app.updateComplete;
        expect(app.region).exist;
        expect(app.region.host.children.length).to.eq(4);
    });
    it('registered views should be added sorted by sortHint', async() =>{
        regionManager.registerViewWithRegion('region', 'view1', {htmlTag: 'test-view1', sortHint: '0003'});
        regionManager.registerViewWithRegion('region', 'view2', {htmlTag: 'test-view2', sortHint: '0004'});
        regionManager.registerViewWithRegion('region', 'view3', {htmlTag: 'test-view3', sortHint: '0001'});
        regionManager.registerViewWithRegion('region', 'view4', {htmlTag: 'test-view4', sortHint: '0002'});
        let f: HTMLDivElement = fixture('test-fixture');
        f.appendChild(document.createElement('region-app'));
        let app: RegionApp = <any>f.querySelector('region-app');
        await delay();
        await app.updateComplete;
        expect(app.region).exist;
        expect(app.region.host.children.length).to.eq(4);
        expect(app.region.host.children.item(0).localName).to.eq('test-view3');
        expect(app.region.host.children.item(1).localName).to.eq('test-view4');
        expect(app.region.host.children.item(2).localName).to.eq('test-view1');
        expect(app.region.host.children.item(3).localName).to.eq('test-view2');
    });
    it('adding views', async() =>{
        let f: HTMLDivElement = fixture('test-fixture');
        f.appendChild(document.createElement('region-app'));
        let app: RegionApp= <any>f.querySelector('region-app');
        await app.updateComplete;
        await app.region.addView('view1', {htmlTag: 'test-view1', sortHint: '003'});
        await delay();
        await app.updateComplete;
        expect(app.region.host.children.item(0).localName).to.be.eq('test-view1');
        await app.region.addView('view2', {htmlTag: 'test-view2', sortHint: '002'});
        expect(app.region.host.children.item(0).localName).to.be.eq('test-view2');
        expect(app.region.host.children.item(1).localName).to.be.eq('test-view1');
    });
    it('deactivating views', async() =>{
        let f: HTMLDivElement = fixture('test-fixture');
        f.appendChild(document.createElement('region-app'));
        let app: RegionApp= <any>f.querySelector('region-app');
        const viewFactory = (text) =>{
          let span: HTMLSpanElement = document.createElement('span');
          span.textContent = text;
          return span;
        };
        await delay();
        await app.updateComplete;
        await app.region.addView('view1', {factory: () => <any>viewFactory('view1'), sortHint: '001'});
        await app.region.addView('view2', {factory: () => <any>viewFactory('view2'), sortHint: '002'});
        await app.region.addView('view3', {factory: () => <any>viewFactory('view3'), sortHint: '003'});
        await app.updateComplete;
        expect(app.region.host.children.item(0).localName).to.be.eq('span');
        expect(app.region.host.children.item(1).localName).to.be.eq('span');
        expect(app.region.host.children.item(2).localName).to.be.eq('span');
        app.region.deactivate('view2');
        await app.updateComplete;
        expect(app.region.host.childElementCount).to.be.equal(3);
        expect((<HTMLElement>app.region.host.childNodes[1]).hidden).to.be.true;
        await app.region.activate('view2');
        await app.updateComplete;
        expect((<HTMLElement>app.region.host.childNodes[1]).hidden).to.be.false
    });
});

//ToDO: comprovar que s'oculten els elements. Comprovar que si s'elimina un component del dom també s'elimina de la llista d'elements de la regió
