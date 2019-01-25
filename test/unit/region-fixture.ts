import {assert, expect, use as chaiUse} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chaiUse(chaiAsPromised['default']);
import {Region} from "../../src/region";
import * as sinon from 'sinon';
import * as validateView from '../../src/validate-view';
import * as viewFactory from "../../src/view-factory";
import {IRegionAdapter, ViewComponent} from "../../src";
import {SinonStub} from "sinon";

const mockViewName = 'my-view';
const mockReginName = 'my-region';
describe('Given an instance of Region', () => {
    let validateViewStub: sinon.SinonStub;
    const adapterFactory: () => IRegionAdapter = () => (<any>{
        activateView: sinon.stub(),
        deactivateView: sinon.stub(),
        viewAdded: sinon.stub()
    });
    const regionFactory = () => new Region(mockReginName, null, document.createElement('div') as any, adapterFactory(), {name: mockReginName, targetId: ''});
    beforeEach(() => {
        sinon.restore();
        sinon.reset();
        validateViewStub = sinon.stub(validateView, 'validateView').returns(true);
    });
    describe('and a view is added', () => {

        it('should store it internally', async () => {
            let region = regionFactory();
            let view = {};
            let result = await region.addView(mockViewName, view);
            assert.strictEqual(result, region);
            assert.strictEqual(region.getView(mockViewName), view);
        });
        it('should validate view', async() => {
            let region = regionFactory();
            await region.addView(mockViewName, {});
            assert.isTrue(validateViewStub.calledOnce);
        });
        it('should notify adapter', async() => {
            let region = regionFactory();
            let view = {};
            await region.addView(mockViewName, {});
            assert.isTrue((<SinonStub>region.adapter.viewAdded).calledOnceWith(view));
        });
        it('should raise error if validate view raises', async() => {
            validateViewStub.throws(Error);
            let view = {};
            let region = regionFactory();
            expect(region.addView(mockViewName, {})).to.eventually.be.rejectedWith(Error);
            assert.isFalse((<SinonStub>region.adapter.viewAdded).calledOnceWith(view));
        });
        it('should raise error if a view with same key is already added', () => {
            let region = regionFactory();
            sinon.stub(region, 'getView').withArgs(mockViewName).returns({});
            expect(region.addView(mockViewName, {})).to.eventually.be.rejectedWith(Error).which.property('message').eq(`Already exists a view with key ${mockViewName}`);
            assert.isFalse((<SinonStub>region.adapter.viewAdded).calledOnce);
            assert.doesNotThrow(() => region.addView(mockViewName + '1', {}));
            assert.isTrue((<SinonStub>region.adapter.viewAdded).calledOnce);
        });
    });
    describe('and a view is removed', () => {
        it('should remove it from view collection', () => {
            let region = regionFactory();
            sinon.stub(region, 'deactivate');
            region['views'] = {[mockViewName]: {}};
            region.removeView(mockViewName);
            assert.isUndefined(region.getView(mockViewName));
        });
        it('should deactivate it', () => {
            let region = regionFactory();
            let view = {htmlTag: 'div'};
            region['views'] = {[mockViewName]: view};
            let spy = sinon.stub(region, 'deactivate');
            region.removeView(mockViewName);
            assert.isTrue(spy.calledOnceWith(view));
        });
    });
    describe('and a view is activated', () => {
        describe('by key', () => {
            it('should be added to the active views collection', async () => {
                let region = regionFactory();
                sinon.stub(viewFactory, 'viewFactory').returns(<any>document.createElement('my-view'));
                let view = {};
                region['views'] = {[mockViewName]: view};
                await region.activate(mockViewName);
                assert.exists(region.currentActiveViews.find(v => v === view));
            });
            it('should be added only once', async () => {
                let view = {};
                let region = regionFactory();
                sinon.stub(region, 'getView').withArgs(mockViewName).returns(view);
                sinon.stub(viewFactory, 'viewFactory').returns(<any>document.createElement('my-view'));
                await region.activate(mockViewName);
                await region.activate(mockViewName);
                await region.activate(mockViewName);
                assert.equal(region.currentActiveViews.filter(v => v === view).length, 1);
            });
            it('should raise error if region does not contain view', async () => {
                let region = regionFactory();
                sinon.stub(viewFactory, 'viewFactory').returns(<any>document.createElement('my-view'));
                const otherViewKey = `${mockViewName}1`;
                sinon.stub(region, 'getView').withArgs(mockViewName).returns({}).withArgs(otherViewKey).returns(undefined);
                let p = region.activate(mockViewName);
                await  expect(p).to.be.fulfilled;
                p = region.activate(otherViewKey);
                await expect(p).to.eventually.be.rejectedWith(Error).which.property('message').eq(`Region does not contain a view with key ${otherViewKey}`);
            });
        });
        describe('by view', () => {
            it('should be added to the active views collection', async () => {
                let view = {};
                let region = regionFactory();
                region['views'] = {[mockViewName]: view};
                sinon.stub(viewFactory, 'viewFactory').returns(<any>document.createElement('my-view'));
                await region.activate(view);
                assert.isTrue(region.currentActiveViews.some(v => v === view));
            });
            it('should be added only once', async () => {
                let view = {};
                let region = regionFactory();
                sinon.stub(viewFactory, 'viewFactory').returns(<any>document.createElement('my-view'));
                region['views'] = {[mockViewName]: view};
                await region.activate(view);
                await region.activate(view);
                await region.activate(view);
                assert.equal(region.currentActiveViews.filter(v => v === view).length, 1);
            });
            it('should raise error if region does not contain view', async () => {
                let region = regionFactory();
                expect(region.activate({})).to.eventually.be.rejectedWith(Error).with.property('message').eq('Region does not contain this view');
            });
        });
        it('should create view component if no created previously', async () => {
            let stub = sinon.stub(viewFactory, 'viewFactory').returns(Promise.resolve(<any>document.createElement('my-view')));
            let region = regionFactory();
            let view = {};
            sinon.stub(region, 'getView').withArgs(mockViewName).returns(view);
            sinon.stub(region['components'], 'has').returns(false);
            await region.activate(mockViewName);
            assert.isTrue(region.currentActiveViews.indexOf(view) >= 0);
            // @ts-ignore
            assert.isTrue(stub.calledOnceWith(view));
        });
        it('should not create view component if created previously', async () => {
            let stub = sinon.stub(viewFactory, 'viewFactory').returns(<any>document.createElement('my-view'));
            let region = regionFactory();
            let view = {};
            sinon.stub(region, 'getView').withArgs(mockViewName).returns(view);
            sinon.stub(region['components'], 'has').withArgs(view).returns(true);
            sinon.stub(region['components'], 'get').withArgs(view).returns(<any>{});
            await region.activate(mockViewName);
            assert.isTrue(region.currentActiveViews.indexOf(view) >= 0);
            // @ts-ignore
            assert.isFalse(stub.calledOnceWith(view));
        });
        it('should set activate to true to view component', async () => {
            let region = regionFactory();
            let view = {};
            let component = <ViewComponent>{};
            sinon.stub(region, 'getView').withArgs(mockViewName).returns(view);
            sinon.stub(region['components'], 'has').withArgs(view).returns(true);
            sinon.stub(region['components'], 'get').withArgs(view).returns(<any>component);
            await region.activate(mockViewName);
            assert.isTrue(component.active);
        });
        it('should notify adapter', async () => {
            let region = regionFactory();
            let view = {};
            let component = <ViewComponent>{};
            sinon.stub(region, 'getView').withArgs(mockViewName).returns(view);
            sinon.stub(region['components'], 'has').withArgs(view).returns(true);
            sinon.stub(region['components'], 'get').withArgs(view).returns(<any>component);
            await region.activate(mockViewName);
            assert.isTrue((<SinonStub>region.adapter.activateView).calledOnceWith(component));
        });
    });
    describe('and a view is deactivated', () => {
        it('should be removed from active views', () => {
            let region = regionFactory();
            let view = {};
            let component = {};
            region['views'] = {[mockViewName]: view};
            region['activeViews'] = [view];
            expect(region.currentActiveViews).eql([view]);
            sinon.stub(region['components'], 'get').withArgs(view).returns(<any>component);
            region.deactivate(view);
            assert.equal(region.currentActiveViews.indexOf(view), -1);
            region['activeViews'] = [view];
            expect(region.currentActiveViews).eql([view]);
            region.deactivate(mockViewName);
            assert.equal(region.currentActiveViews.indexOf(view), -1);
        });
        it('should deactivate component', () =>{
            let region = regionFactory();
            let view = {};
            let component = <ViewComponent>{};
            region['views'] = {[mockViewName]: view};
            region['activeViews'] = [view];
            sinon.stub(region['components'], 'get').withArgs(view).returns(<any>component);
            region.deactivate(view);
            assert.isFalse(component.active);
            region['activeViews'] = [view];
            region.deactivate(mockViewName);
            assert.isFalse(component.active);
        });
        it('should notify adapter', () =>{
            let region = regionFactory();
            let view = {};
            let component = <ViewComponent>{};
            region['views'] = {[mockViewName]: view};
            region['activeViews'] = [view];
            sinon.stub(region['components'], 'get').withArgs(view).returns(<any>component);
            region.deactivate(view);
            assert.isTrue((<SinonStub>region.adapter.deactivateView).calledOnceWith(<any>component));
            region['activeViews'] = [view];
            (<SinonStub>region.adapter.deactivateView).resetHistory();
            region.deactivate(mockViewName);
            assert.isTrue((<SinonStub>region.adapter.deactivateView).calledOnceWith(<any>component));
        });
        it('should not deactivate component neither notify adapter if component related to view not found', () =>{
            let region = regionFactory();
            let view = {};
            region.deactivate(view);
            assert.isFalse((<SinonStub>region.adapter.deactivateView).called);
            region.deactivate(mockViewName);
            assert.isFalse((<SinonStub>region.adapter.deactivateView).called);
        });

    });
    it('contains view test', () =>{
        let region = regionFactory();
        let view = {};
        region['views']['my-view'] = view;
        assert.isFalse(region.containsView('my-view2'));
        assert.isFalse(region.containsView(<any>{}));
        assert.isTrue(region.containsView('my-view'));
        assert.isTrue(region.containsView(view));
    });
    describe('isAtiveView suite', () =>{
        it('should raise exception if view does not exists', () =>{
            let region = regionFactory();
            sinon.stub(region, 'containsView').returns(false);
            expect(() => region.isViewActive('my-view2')).to.throw(Error).with.property('message').eq(`region ${mockReginName} doest not contain this view`);
            expect(() => region.isViewActive({})).to.throw(Error).with.property('message').eq(`region ${mockReginName} doest not contain this view`);
            sinon.reset();
            sinon.restore();
            sinon.stub(region, 'containsView').returns(true);
            expect(() => region.isViewActive('my-view2')).to.not.throw(Error);
            expect(() => region.isViewActive({})).to.not.throw(Error);
        });
        it('should return true if is in activeView list', () =>{
            let view: any = {};
            let region = regionFactory();
            region['views'] = {[mockViewName]: view};
            region['activeViews'] =  [view];
            sinon.stub(region, 'containsView').returns(true);
            assert.isTrue(region.isViewActive(mockViewName));
            assert.isTrue((region.isViewActive(view)));
            assert.isFalse(region.isViewActive('my-view-fake'));
            assert.isFalse((region.isViewActive({})));
        })

    });
    describe('toggleViewActive', () =>{
        it('should raise exception if view does not exists', () => {
            let region = regionFactory();
            sinon.stub(region, 'containsView').returns(false);
            expect(() => region.toggleViewActive('my-view2')).to.throw(Error).with.property('message').eq(`region ${mockReginName} doest not contain this view`);
            expect(() => region.toggleViewActive({})).to.throw(Error).with.property('message').eq(`region ${mockReginName} doest not contain this view`);
            sinon.reset();
            sinon.restore();
            sinon.stub(region, 'containsView').returns(true);
            sinon.stub(region, 'activate');
            sinon.stub(region, 'deactivate');
            expect(() => region.toggleViewActive('my-view2')).to.not.throw(Error);
            expect(() => region.toggleViewActive({})).to.not.throw(Error);
        });
        it('should call deactivate view if view is active', () =>{
            let region = regionFactory();
            sinon.stub(region, 'containsView').returns(true);
            sinon.stub(region, 'isViewActive').returns(true);
            let activateSpy = sinon.stub(region, 'activate');
            let deactivateSpy = sinon.stub(region, 'deactivate');

            let result = region.toggleViewActive(mockViewName);

            assert.isFalse(result);
            assert.isTrue(deactivateSpy.calledOnceWith(mockViewName));
            assert.isFalse(activateSpy.called);

        });
        it('should call activate view if view is not active', () =>{
            let region = regionFactory();
            sinon.stub(region, 'containsView').returns(true);
            sinon.stub(region, 'isViewActive').returns(false);
            let activateSpy = sinon.stub(region, 'activate');
            let deactivateSpy = sinon.stub(region, 'deactivate');

            let result = region.toggleViewActive(mockViewName);

            assert.isTrue(result);
            assert.isTrue(activateSpy.calledOnceWith(mockViewName));
            assert.isFalse(deactivateSpy.called);

        });
    })
});
/**TODO**/
/** Test view is instantiated on activate**/