import {expect} from 'chai';
import * as sinon from 'sinon';
import {IRegionHost} from "../../src";
import {regionFactory} from "../../src/region-factory";
import {RegionAdapterRegistry} from "../../src/region-adapter-registry";
const regionName = 'region';
describe('when invoking `regionFactory` method', () =>{
    beforeEach(() =>{
        sinon.reset();
        sinon.restore();
    })
    it('should create a new Region and add it to the regionManager', () =>{
        let regionManager: any = {add: sinon.stub()};
        let adapter = {};
        let registry = new RegionAdapterRegistry();
        let adapterFactory = sinon.stub().returns(adapter);
        sinon.stub(registry, 'getAdapterFactory').returns(adapterFactory);
        let target: IRegionHost = <any>document.createElement('div');
        let regionDefinition = {name: regionName, targetId: 'regionId'};
        let host: any = {shadowRoot: {querySelector: sinon.stub().withArgs('regionId').returns(target)}};

        let region = regionFactory(regionDefinition, host, regionManager, registry);
        expect(region.name).to.equal(regionName);
        expect(region.regionManager).to.equal(regionManager);
        expect(region.host).equal(target);
        expect(target.uxlRegion).equal(region);
        expect(region.adapter).equal(adapter);
        expect(adapterFactory.calledOnceWith(regionDefinition, target));
        expect(regionManager.add.calledOnceWith(regionName, region)).to.be.true;
    });
    it('should create a new RegionManager if scoped and add region to the scoped RegionManager', () =>{
        let scopedRegionManager = {add: sinon.stub()};
        let regionManager: any = {createRegionManager: sinon.stub().returns(scopedRegionManager)};
        let adapter = {};
        let registry = new RegionAdapterRegistry();
        let adapterFactory = sinon.stub().returns(adapter);
        sinon.stub(registry, 'getAdapterFactory').returns(adapterFactory);
        let target: IRegionHost = <any>document.createElement('div');
        let regionDefinition = {name: regionName, targetId: 'regionId', scoped: true};
        let host: any = {shadowRoot: {querySelector: sinon.stub().withArgs('regionId').returns(target)}};
        let region = regionFactory(regionDefinition, host, regionManager, registry);
        expect(region.regionManager).equal(scopedRegionManager);
        expect(scopedRegionManager.add.calledOnceWith(regionName, region)).to.be.true;
    });
    it('should raise error if no adapter factory for host', () =>{
        let regionManager: any = {};
        let registry = new RegionAdapterRegistry();
        sinon.stub(registry, 'getAdapterFactory').returns(null);
        let target: IRegionHost = <any>document.createElement('div');
        let regionDefinition = {name: regionName, targetId: 'regionId'};
        let host: any = {shadowRoot: {querySelector: sinon.stub().withArgs('regionId').returns(target)}};
        expect(() => regionFactory(regionDefinition, host, regionManager, registry)).to.throw(Error).with.property('message').eq('No region adapter factory found for the host');
    })
    it('should raise error if no adapter', () =>{
        let regionManager: any = {};
        let adapter = {};
        let registry = new RegionAdapterRegistry();
        //Adapter factory returns null
        let adapterFactory = sinon.stub().returns(null);
        sinon.stub(registry, 'getAdapterFactory').returns(adapterFactory);
        let target: IRegionHost = <any>document.createElement('div');
        let regionDefinition = {name: regionName, targetId: 'regionId'};
        let host: any = {shadowRoot: {querySelector: sinon.stub().withArgs('regionId').returns(target)}};
        expect(() => regionFactory(regionDefinition, host, regionManager, registry)).to.throw(Error).with.property('message').eq('No region adapter found for the host');
    })

});