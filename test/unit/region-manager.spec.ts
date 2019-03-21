import {IRegion, regionManager, RegionManager} from "../../src";

const mockRegionName = 'mock-region';
const mockViewName = 'my-view';
describe('Given an instance of RegionManager', () => {
    const mockRegion: IRegion = <any>{
        addView: () => {
        }
    };
    const createMockRegion = () => {
        return <any>{
            addView: () => this
        };
    };
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });
    describe('and a region is added', () => {
        it('should store it internally', () => {
            let regionManager = new RegionManager();
            regionManager.add(mockRegionName, mockRegion);
            expect(regionManager.getRegion(mockRegionName)).toBe(mockRegion);
            const mockRegion2: IRegion = <any>{};
            regionManager.add('my-region2', mockRegion2);
            expect(regionManager.getRegion('my-region2')).toBe(mockRegion2);
        });
        it('should raise error if already exists a region with the given name', () => {
            let regionManager = new RegionManager();
            regionManager.add(mockRegionName, mockRegion);
            expect(() => regionManager.add(mockRegionName, <any>{})).toThrow(Error);
        });
    });
    describe('and a region is removed', () => {
        it('should remove a region by name if argument is an string', () => {
            let regionManager = new RegionManager();
            regionManager.add(mockRegionName, mockRegion);
            expect(regionManager.getRegion(mockRegionName)).toBeDefined();
            let result = regionManager.remove(mockRegionName);
            expect(regionManager.getRegion(mockRegionName)).toBeUndefined();
            expect(result).toBe(mockRegion);
        });
        it('should remove a region if argument is an object', () => {
            let regionManager = new RegionManager();
            regionManager.add(mockRegionName, mockRegion);
            expect(regionManager.getRegion(mockRegionName)).toBeDefined();
            let result = regionManager.remove(mockRegion);
            expect(regionManager.getRegion(mockRegionName)).toBeUndefined();
            expect(result).toBe(mockRegion);
        });
        it('should return undefined if region does not exist', () => {
            let regionManager = new RegionManager();
            expect(regionManager.remove(mockRegionName)).toBeUndefined();
            expect(regionManager.remove(mockRegion)).toBeUndefined();
        });
        it('should remove region from registry', () => {
            let regionManager = new RegionManager();
            let spy = jest.spyOn(mockRegion, 'addView');
            regionManager.add(mockRegionName, mockRegion);
            regionManager.remove(mockRegion);
            regionManager.registerViewWithRegion(mockRegionName, mockViewName, <any>{});
            expect(spy).not.toBeCalled();
            regionManager.add(mockRegionName, mockRegion);
            regionManager.remove(mockRegionName);
            expect(spy).not.toBeCalled();

        })
    });
    describe('and a view is added into a region', () => {
        it('should raise error if region does not exist', () => {
            let regionManager = new RegionManager();
            expect(() => regionManager.addViewToRegion(mockRegionName, mockViewName, <any>{})).toThrow(Error);
        });
        it('should invoke addView into the target region', () => {
            let spy = jest.spyOn(mockRegion, 'addView');
            let view = <any>{};
            let regionManager = new RegionManager();
            jest.spyOn(regionManager, 'getRegion').mockReturnValue(mockRegion);
            let result = regionManager.addViewToRegion(mockRegionName, mockViewName, view);
            expect(spy).toBeCalledWith(mockViewName, view);
            expect(result).toBe(regionManager);
        });
    });
    describe('and a view is registered into a region', () => {
        it('should be added to view registry', () => {
            let view = <any>{};
            let regionManager = new RegionManager();
            let result = regionManager.registerViewWithRegion(mockRegionName, mockViewName, view);
            expect(regionManager.getRegisteredViews(mockRegionName).find(v => v.view === view)).toEqual({
                key: mockViewName,
                view
            });
            expect(regionManager.getRegisteredViews(mockRegionName).find(v => v.key === mockViewName)).toEqual({
                key: mockViewName,
                view
            });
            expect(result).toBe(regionManager);
        });
        it('should be added to view if region already exists', () => {
            let regionManager1 = new RegionManager();
            let regionManager2 = new RegionManager();
            let region1 = createMockRegion();
            let region2 = createMockRegion();
            let spy1 = jest.spyOn(region1, 'addView');
            let spy2 = jest.spyOn(region2, 'addView');
            regionManager1.add(mockRegionName, region1);
            regionManager2.add(mockRegionName, region2);
            let view = <any>{};
            regionManager1.registerViewWithRegion(mockRegionName, mockViewName, view);
            expect(spy1).toBeCalledWith(mockViewName, view);
            expect(spy2).toBeCalledWith(mockViewName, view);
        });
    });
    describe('and `clear` method is invoke', () => {
        it('should remove all regions', () => {
            let regionManager = new RegionManager();
            regionManager.add('region1', createMockRegion());
            regionManager.add('region2', createMockRegion());
            expect(regionManager.getRegion('region1')).toBeDefined();
            expect(regionManager.getRegion('region2')).toBeDefined();
            regionManager.clear();
            expect(regionManager.getRegion('region1')).toBeUndefined();
            expect(regionManager.getRegion('region2')).toBeUndefined();
        });
        it('should unregister regions', () => {
            let regionManager1 = new RegionManager();
            let regionManager2 = new RegionManager();
            let region1 = createMockRegion();
            let region2 = createMockRegion();
            let spy1 = jest.spyOn(region1, 'addView');
            let spy2 = jest.spyOn(region2, 'addView');
            regionManager1.add(mockRegionName, region1);
            regionManager2.add(mockRegionName, region2);
            regionManager2.clear();
            regionManager2.registerViewWithRegion(mockRegionName, mockViewName, <any>{});
            expect(spy1).toBeCalledTimes(1);
            expect(spy2).not.toBeCalled();
        });
        it('should clear registry if it is main regionManager', () => {
            let regionManager1 = new RegionManager();
            let region1 = createMockRegion();
            let region2 = createMockRegion();
            let spy1 = jest.spyOn(region1, 'addView');
            let spy2 = jest.spyOn(region2, 'addView');
            regionManager1.add(mockRegionName, region1);
            regionManager.add(mockRegionName, region2);
            regionManager.clear();
            regionManager1.registerViewWithRegion(mockRegionName, mockViewName, <any>{});
            expect(spy1).not.toBeCalledTimes(1);
            expect(spy2).not.toBeCalled();
        });
    });
});