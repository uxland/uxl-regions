import {IRegion, IRegionBehavior} from "../../../src";
import * as defaultRegitry from "../../../src/behaviors/default-registry";
import * as sinon from 'sinon';
import {AdapterBase} from "../../../src/adapters/adapter-base";
import {expect} from 'chai';

describe('Given an instance of AdapterBase class', () =>{
    it('should initialize behaviors from default registry', () =>{
        let region: any = <any>{};
        class Behavior1 implements IRegionBehavior{
            constructor(public region: IRegion){}
            attach(): void {
            }

            detach(): void {
            }
        }
        class Behavior2 implements IRegionBehavior{
            constructor(public region: IRegion){}
            attach(): void {
            }

            detach(): void {
            }
        }
        sinon.stub(defaultRegitry.defaultBehaviorRegistry, 'behaviors').get(() => [Behavior1, Behavior2]);
        let adapter = new AdapterBase(<any>{uxlRegion: region});
        expect(adapter.behaviors.length).to.be.equal(2);
        expect(adapter.behaviors[0].constructor).to.be.equal(Behavior1);
        expect((adapter.behaviors[0] as Behavior1).region).to.equal(region);
        expect(adapter.behaviors[1].constructor).to.be.equal(Behavior2);
        expect((adapter.behaviors[1] as Behavior2).region).to.equal(region);
    })
    describe('and a view is activated', () =>{
        it('should append view to host', () =>{
            let region = {activate: sinon.spy(), deactivate: sinon.spy(), currentActiveViews: []}
            let host = {appendChild: sinon.stub(), contains: sinon.stub(), uxlRegion: region}
            let adapter = new AdapterBase(<any> host);
            let view: any = document.createElement('div');
            adapter.activateView(view);
            expect(host.appendChild.calledOnceWith(view)).to.be.true;
        })
        it('should not append view if already contained in host', () =>{
            let region = {activate: sinon.spy(), deactivate: sinon.spy(), currentActiveViews: []};
            let host = {appendChild: sinon.stub(), contains: sinon.stub().returns(true), uxlRegion: region};
            let adapter = new AdapterBase(<any> host);
            let view: any = document.createElement('div');
            adapter.activateView(view);
            expect(host.appendChild.calledOnceWith(view)).to.be.false;
        });
        it('should set hidden atribute to false', () =>{
            let region = {activate: sinon.spy(), deactivate: sinon.spy(), currentActiveViews: []};
            let host = {appendChild: sinon.stub(), contains: sinon.stub().returns(true), uxlRegion: region};
            let adapter = new AdapterBase(<any> host);
            let view: any = document.createElement('div');
            adapter.activateView(view);
            expect(view.hidden).to.be.false;
        })
    })
    describe('and view is deactivated', () =>{
        describe('and view definition removeFromDOMwhenDeactivated` is true', () =>{
            it('should remove view from host', () =>{
                let region = {currentViews: [], viewRemovedFromDom: sinon.stub()};
                let host = { removeChild: sinon.stub(), appendChild: sinon.stub(), contains: sinon.stub().returns(true), uxlRegion: region };
                let view: any = document.createElement('div');
                view.view = {removeFromDomWhenDeactivated: true};
                let adapter = new AdapterBase(<any> host);
                adapter.deactivateView(view);
                expect(host.removeChild.calledOnceWith(view)).to.be.true;
            })
            it('should notify region', () =>{
                let region = {currentViews: [], viewRemovedFromDom: sinon.stub()};
                let host = { removeChild: sinon.stub(), appendChild: sinon.stub(), contains: sinon.stub().returns(true), uxlRegion: region };
                let view: any = document.createElement('div');
                view.view = {removeFromDomWhenDeactivated: true};
                let adapter = new AdapterBase(<any> host);
                adapter.deactivateView(view);
                expect(region.viewRemovedFromDom.calledOnceWith(view.view)).to.be.true;
            })
        })

        it('should set hidden attribute to true', () =>{
            let region = {currentViews: []};
            let host = { removeChild: sinon.stub(), appendChild: sinon.stub(), contains: sinon.stub().returns(true), uxlRegion: region };
            let view: any = document.createElement('div');
            view.view = {};
            let adapter = new AdapterBase(<any> host);
            adapter.deactivateView(view);
            expect(view.hidden).to.be.true;
        })
    })
    afterEach(() => {
        sinon.restore();
        sinon.reset();
    })
})

