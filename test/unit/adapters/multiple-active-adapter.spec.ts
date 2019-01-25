import {MultipleActiveAdapter} from "../../../src/adapters/multiple-active-adapter";
import * as sinon from 'sinon';
import {expect} from 'chai';

describe('Given an instance of MultipleActiveAdapter class', () =>{
    describe('and adding a view', () =>{
        it('should activate view in region', () =>{
            let region: any = {activate: sinon.stub()};
            let host = {uxlRegion: region};
            let adapter = new MultipleActiveAdapter(<any>host);
            let view: any = {};
            adapter.viewAdded(view);
            expect(region.activate.calledOnceWith(view));
        })
    });
    describe('when inserting a view in region host', () =>{
        it('should take sortHint into account', () =>{
            let views = [{sortHint: '000'}, {sortHint: '001'} , {sortHint: '002'}];
            let viewComponent = document.createElement('div');
            let host = document.createElement('div');
            let region = {currentActiveViews: views};
            host['uxlRegion'] = region;
            host.appendChild(viewComponent);
            let insertStub = sinon.stub(host, 'insertBefore');
            let newComponent = document.createElement('span');
            newComponent['view'] = views[0];
            let adapter = new MultipleActiveAdapter(<any>host);
            adapter['addViewToHost'](<any>newComponent);
            // @ts-ignore
            expect(insertStub.calledOnce).to.be.true;
            sinon.reset();
        })
    })
});