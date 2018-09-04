import {expect} from 'chai';
import {IRegion, IRegionBehavior} from "../../../src";
import * as sinon from 'sinon';
import * as defaultRegitry from '../../../src/behaviors/default-registry';
import {SingleActiveAdapter} from "../../../src/adapters/single-active-adapter";

describe('Given an instance of SingleActiveAdapter class', () =>{


    describe('and `viewAdded` method is invoked', () =>{
        describe('and region has already an active view', () =>{
            it('should do nothing', () =>{
                let region = {activate: sinon.spy(), deactivate: sinon.spy(), currentActiveViews: [{}]}
                let adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
                adapter.viewAdded(<any>{});
                expect(region.activate.called).to.be.false;
                expect(region.deactivate.called).to.be.false;
            });
        })
        describe('and region has no currently an active view', () =>{
            it('it should activate added view if is default', () =>{
                let region = {activate: sinon.spy(), deactivate: sinon.spy(), currentActiveViews: []}
                let adapter = new SingleActiveAdapter(<any>{uxlRegion: region});
                let view: any = {isDefault: true};
                adapter.viewAdded(view);
                expect(region.activate.calledOnceWith(view)).to.be.true;
            })
            it('should do nothing if added view is not default', () =>{
                let region = {activate: sinon.spy(), deactivate: sinon.spy(), currentActiveViews: []}
                let adapter = new SingleActiveAdapter(<any> {uxlRegion: region});
                adapter.viewAdded(<any>{isDefault: false});
                expect(region.activate.called).to.be.false;
                adapter.viewAdded(<any>{});
                expect(region.activate.called).to.be.false;
            })
        })
    })
    describe('and view is activated',() =>{
       it('should deactivate current activated view', () =>{
           let currentView = {htmlTag: 'my-view'};
           let region = {activate: sinon.spy(), deactivate: sinon.spy(), currentActiveViews: [currentView]}
           let adapter = new SingleActiveAdapter(<any> {uxlRegion: region, appendChild: sinon.stub(), contains: sinon.stub()});
           adapter.activateView(<any>{});
           expect(region.deactivate.calledOnceWith(currentView)).to.be.true;
           region.currentActiveViews = [];
           region.deactivate.resetHistory();
           adapter.activateView(<any>{});
           expect(region.deactivate.called).to.be.false;
       })
        it('should append view to host', () =>{
            let region = {activate: sinon.spy(), deactivate: sinon.spy(), currentActiveViews: []}
            let host = {appendChild: sinon.stub(), contains: sinon.stub(), uxlRegion: region};
            let adapter = new SingleActiveAdapter(<any> host);
            let view: any = document.createElement('div');
            adapter.activateView(view);
            expect(host.appendChild.calledOnceWith(view)).to.be.true;
        })
        it('should not append view if already contained in host', () =>{
            let region = {activate: sinon.spy(), deactivate: sinon.spy(), currentActiveViews: []}
            let host = {uxlRegion: region, appendChild: sinon.stub(), contains: sinon.stub().returns(true)}
            let adapter = new SingleActiveAdapter(<any> host);
            let view: any = document.createElement('div');
            adapter.activateView(view);
            expect(host.appendChild.calledOnceWith(view)).to.be.false;
        });
    });
    describe('and view is deactivated', () =>{
        it('should remove from host is view definition `removeFromDOMwhenDeactivated is true', () =>{
            let region = {currentViews: [], viewRemovedFromDom: sinon.stub()};
            let host = {removeChild: sinon.stub(), uxlRegion: region}
            let view: any = document.createElement('div');
            view.view = {removeFromDomWhenDeactivated: true};
            let adapter = new SingleActiveAdapter(<any> host);
            adapter.deactivateView(view);
            expect(host.removeChild.calledOnceWith(view)).to.be.true;
        })
        it('should activate defaultView if any in region', () =>{
            let view = {isDefault: true};
            let region = {currentViews: [view], activate: sinon.spy()};
            let adapter = new SingleActiveAdapter(<any> {uxlRegion: region});
            adapter.deactivateView(<any>{view: {}});
            expect(region.activate.calledOnceWith(view)).to.be.true;
        })
    })
    afterEach(() => {
        sinon.restore();
        sinon.reset();
    })
})