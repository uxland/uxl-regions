import {assert} from 'chai';
import {SelectableAdapter} from "../../../src/adapters/selectable-adapter";
import *as sinon from 'sinon';
import {IRegion} from "@uxland/uxl-regions/region";

describe('When instantiating SelectableAdapter class', () =>{
   it('should set attrForSelected property', () =>{
       let adapter = new SelectableAdapter(<any>{});
       assert.equal(adapter.host['attrForSelected'], 'name');
   });

});
describe('Given an instance of SelectableAdapter class', () =>{
    describe('and a view is activated',() =>{
        it('should set adapter.attrForSelected property to view', async() =>{
            let adapter = new SelectableAdapter(<any>{contains: () => true, uxlRegion: {currentActiveViews: []}});
            let view = {viewKey: 'my-view'};
            await adapter.activateView(<any>view);
            assert.equal(view['name'], 'my-view')
        })
        it('should set host selected property to viewKey',async()=>{
            let adapter = new SelectableAdapter(<any>{contains: () => true, uxlRegion: {currentActiveViews: []}});
            let view = {viewKey: 'my-view'};
            await adapter.activateView(<any>view);
            assert.equal(adapter.host['selected'], 'my-view');
        });
        it('should deactivate current active view', async() =>{
            let region = {currentActiveViews: [{view: 'selected-view'}], deactivate: sinon.stub()};
            let adapter = new SelectableAdapter(<any>{contains: () => true, selected: 'selected-view', uxlRegion: region});
            let view = {viewKey: 'my-view'};
            await adapter.activateView(<any>view);
            assert.isTrue(region.deactivate.calledOnce);
        });
    })
    describe('and view is deactivated', () =>{
        it('should do nothing if host selected is different than viewKey', async() =>{
            let adapter = new SelectableAdapter(<any>{contains: () => true, selected: 'other-view'});
            let view = {viewKey: 'my-view'};
            await adapter.deactivateView(<any>view);
            assert.equal(adapter.host['selected'], 'other-view');
        })
        it('should set host selected property to null if host selected property current value equals viewKey', async() =>{
            let adapter = new SelectableAdapter(<any>{contains: () => true, selected: 'my-view', uxlRegion:{currentViews: []}});
            let view = {viewKey: 'my-view'};
            await adapter.deactivateView(<any>view);
            assert.isNull(adapter.host['selected']);
        });
        it('should activate default view if any', async() =>{
            let defaultView = {viewKey: 'default-view', isDefault: true};
            let view = {viewKey: 'my-view'};
            let region = {currentViews: [defaultView], activate: sinon.stub()};
            let adapter = new SelectableAdapter(<any>{contains: () => true, selected: 'my-view', uxlRegion:region});
            await adapter.deactivateView(<any>view);
            assert.isTrue(region.activate.calledOnceWith(defaultView))
        })
    })
})