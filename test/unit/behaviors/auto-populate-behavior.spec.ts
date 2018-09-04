import {expect} from 'chai';
import {AutoPopulateBehavior} from "../../../src/behaviors/auto-populate-behavior";
import * as sinon from 'sinon';
describe('Given an instance of AutoPopulateBehavior', () =>{
    describe('and `attach` method is invoked', () =>{
        it('should add registered views to the target region', () =>{
            let views = [{key: 'v1', view: <any>{}}, {key: 'v2', view: <any>{}}];
            const regionName = 'region'
            let region ={
                regionManager:{getRegisteredViews: sinon.stub().returns(views)},
                addView: sinon.spy(),
                name: regionName
            };
            let behavior = new AutoPopulateBehavior(<any>region);
            behavior.attach();
            expect(region.regionManager.getRegisteredViews.calledOnceWith(regionName)).to.be.true;
            expect(region.addView.calledTwice);
            expect(region.addView.args[0]).to.deep.eq(['v1',{}]);
            expect(region.addView.args[1]).to.deep.eq(['v2',{}]);
        })
    })
})