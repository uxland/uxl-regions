import {IRegionHost} from "../../src";
import {regionFactory} from "../../src";
import {RegionAdapterRegistry} from "../../src";
import {when} from 'jest-when';
const regionName = 'region';
describe('when invoking `regionFactory` method', () =>{
    beforeEach(() =>{
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create a new Region and add it to the regionManager', () =>{
        let regionManager: any = {add: jest.fn()};
        let adapter = {};
        let registry = new RegionAdapterRegistry();
        let adapterFactory = jest.fn().mockReturnValue(adapter);
        jest.spyOn(registry, 'getAdapterFactory').mockReturnValue(<any>adapterFactory);
        let target: IRegionHost = <any>document.createElement('div');
        let regionDefinition = {name: regionName, targetId: 'regionId'};
        const fn = jest.fn();
        when(fn).calledWith('regionId').mockReturnValue(target);
        let host: any = {shadowRoot: {querySelector: fn}};

        let region = regionFactory(regionDefinition, host, regionManager, registry);
        expect(region.name).toEqual(regionName);
        expect(region.regionManager).toBe(regionManager);
        expect(region.host).toBe(target);
        expect(target.uxlRegion).toEqual(region);
        expect(region.adapter).toBe(adapter);
        expect(adapterFactory).toBeCalledWith(regionDefinition, target);
        expect(regionManager.add).toBeCalledWith(regionName, region);
    });
    it('should create a new RegionManager if scoped and add region to the scoped RegionManager', () =>{
        let scopedRegionManager = {add: jest.fn()};
        let regionManager: any = {createRegionManager: jest.fn().mockReturnValue(scopedRegionManager)};
        let adapter = {};
        let registry = new RegionAdapterRegistry();
        let adapterFactory = jest.fn().mockReturnValue(adapter);
        jest.spyOn(registry, 'getAdapterFactory').mockReturnValue(adapterFactory);
        let target: IRegionHost = <any>document.createElement('div');
        let regionDefinition = {name: regionName, targetId: 'regionId', scoped: true};
        const fn = jest.fn();
        when(fn).calledWith('regionId').mockReturnValue(target);

        let host: any = {shadowRoot: {querySelector: fn}};
        let region = regionFactory(regionDefinition, host, regionManager, registry);
        expect(region.regionManager).toBe(scopedRegionManager);
        expect(scopedRegionManager.add).toBeCalledWith(regionName, region);
    });
    it('should raise error if no adapter factory for host', () =>{
        let regionManager: any = {};
        let registry = new RegionAdapterRegistry();
        jest.spyOn(registry, 'getAdapterFactory').mockReturnValue(null);
        let target: IRegionHost = <any>document.createElement('div');
        let regionDefinition = {name: regionName, targetId: 'regionId'};
        const fn = jest.fn();
        when(fn).calledWith('regionId').mockReturnValue(target);
        let host: any = {shadowRoot: {querySelector: fn}};
        expect(() => regionFactory(regionDefinition, host, regionManager, registry)).toThrow('No region adapter factory found for the host');
    });
    it('should raise error if no adapter', () =>{
        let regionManager: any = {};
        let adapter = {};
        let registry = new RegionAdapterRegistry();
        //Adapter factory returns null
        let adapterFactory = jest.fn().mockReturnValue(null);
        jest.spyOn(registry, 'getAdapterFactory').mockReturnValue(adapterFactory);
        let target: IRegionHost = <any>document.createElement('div');
        let regionDefinition = {name: regionName, targetId: 'regionId'};
        const fn = jest.fn();
        when(fn).calledWith('regionId').mockReturnValue(target);

        let host: any = {shadowRoot: {querySelector: fn}};
        expect(() => regionFactory(regionDefinition, host, regionManager, registry)).toThrow('No region adapter found for the host');
    });
});