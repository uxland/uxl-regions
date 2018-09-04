import {RegionManager, regionManager} from "../../src/region-manager";
import {assert} from 'chai';
import * as sinon from 'sinon';
import {IRegion} from "../../src/region";

const mockRegionName = 'mock-region';
const mockViewName = 'my-view';
describe('Given an instance of RegionManager', () =>{
    const mockRegion: IRegion = <any>{
        addView: () =>{}
    };
    const createMockRegion = () =>{
        return <any>{
            addView: () => this
        };
    }
    beforeEach(() =>{
       sinon.reset();
       sinon.restore();
    });
   describe('and a region is added', () =>{
       it('should store it internally', () =>{
           let regionManager = new RegionManager();
           regionManager.add(mockRegionName, mockRegion);
           assert.strictEqual(regionManager.getRegion(mockRegionName), mockRegion);
           const mockRegion2: IRegion = <any>{};
           regionManager.add('my-region2', mockRegion2);
           assert.strictEqual(regionManager.getRegion('my-region2'), mockRegion2);
       });
       it('should raise error if already exists a region with the given name', () =>{
          let regionManager = new RegionManager();
          regionManager.add(mockRegionName, mockRegion);
          assert.throws(() => regionManager.add(mockRegionName, <any>{}), Error);
       });
   });
   describe('and a region is removed', () =>{
      it('should remove a region by name if argument is an string',() =>{
          let regionManager = new RegionManager();
          regionManager.add(mockRegionName, mockRegion);
          assert.exists(regionManager.getRegion(mockRegionName));
          let result = regionManager.remove(mockRegionName);
          assert.notExists(regionManager.getRegion(mockRegionName));
          assert.strictEqual(result, mockRegion);
      });
      it('should remove a region if argument is an object', () =>{
         let regionManager = new RegionManager();
         regionManager.add(mockRegionName, mockRegion);
         assert.exists(regionManager.getRegion(mockRegionName));
         let result = regionManager.remove(mockRegion);
         assert.notExists(regionManager.getRegion(mockRegionName));
         assert.strictEqual(result, mockRegion);
      });
      it('should return undefined if region does not exist', () =>{
         let regionManager = new RegionManager();
         assert.isUndefined(regionManager.remove(mockRegionName));
         assert.isUndefined(regionManager.remove(mockRegion));
      });
      it('should remove region from registry', () =>{
          let regionManager = new RegionManager();
          let spy = sinon.stub(mockRegion, 'addView');
          regionManager.add(mockRegionName, mockRegion);
          regionManager.remove(mockRegion);
          regionManager.registerViewWithRegion(mockRegionName, mockViewName, <any>{});
          assert.isFalse(spy.called);
          regionManager.add(mockRegionName, mockRegion);
          regionManager.remove(mockRegionName);
          assert.isFalse(spy.called);

      })
   });
   describe('and a view is added into a region', () =>{
       it('should raise error if region does not exist', () =>{
          let regionManager = new RegionManager();
          assert.throws(() => regionManager.addViewToRegion(mockRegionName, mockViewName, <any>{}), Error);
       });
       it('should invoke addView into the target region', () =>{
           let spy = sinon.stub(mockRegion, 'addView');
           let view = <any>{};
           let regionManager = new RegionManager();
           sinon.stub(regionManager, 'getRegion').returns(mockRegion);
           let result = regionManager.addViewToRegion(mockRegionName, mockViewName, view);
           assert.isTrue(spy.calledOnceWith(mockViewName, view));
           assert.strictEqual(result, regionManager);
       });
   });
   describe('and a view is registered into a region', () =>{
       it('should be added to view registry', () =>{
          let view = <any>{};
          let regionManager = new RegionManager();
          let result = regionManager.registerViewWithRegion(mockRegionName, mockViewName, view);
          assert.deepEqual(regionManager.getRegisteredViews(mockRegionName).find(v => v.view === view), {key: mockViewName, view});
          assert.deepEqual(regionManager.getRegisteredViews(mockRegionName).find(v => v.key === mockViewName), {key: mockViewName, view});
          assert.strictEqual(result, regionManager);
       });
       it('should be added to view if region already exists', () =>{
          let regionManager1 = new RegionManager();
          let regionManager2 = new RegionManager();
          let region1 = createMockRegion();
          let region2 = createMockRegion();
          let spy1 = sinon.stub(region1, 'addView');
          let spy2 = sinon.stub(region2, 'addView');
          regionManager1.add(mockRegionName, region1);
          regionManager2.add(mockRegionName, region2);
          let view = <any>{};
          regionManager1.registerViewWithRegion(mockRegionName, mockViewName, view);
          assert.isTrue(spy1.calledOnceWith(mockViewName, view));
          assert.isTrue(spy2.calledOnceWith(mockViewName, view));
       });
   });
   describe('and `clear` method is invoke', () =>{
       it('should remove all regions', () =>{
           let regionManager = new RegionManager();
           regionManager.add('region1', createMockRegion());
           regionManager.add('region2', createMockRegion());
           assert.exists(regionManager.getRegion('region1'));
           assert.exists(regionManager.getRegion('region2'));
           regionManager.clear();
           assert.notExists(regionManager.getRegion('region1'));
           assert.notExists(regionManager.getRegion('region2'));
       }) ;
       it('should unregister regions', () =>{
          let regionManager1 = new RegionManager();
          let regionManager2 = new RegionManager();
          let region1 = createMockRegion();
          let region2 = createMockRegion();
          let spy1 = sinon.stub(region1, 'addView');
          let spy2 = sinon.stub(region2, 'addView');
          regionManager1.add(mockRegionName, region1);
          regionManager2.add(mockRegionName, region2);
          regionManager2.clear();
          regionManager2.registerViewWithRegion(mockRegionName, mockViewName, <any>{});
          assert.isTrue(spy1.calledOnce);
          assert.isFalse(spy2.called);
       });
       it('should clear registry if it is main regionManager', () =>{
           let regionManager1 = new RegionManager();
           let region1 = createMockRegion();
           let region2 = createMockRegion();
           let spy1 = sinon.stub(region1, 'addView');
           let spy2 = sinon.stub(region2, 'addView');
           regionManager1.add(mockRegionName, region1);
           regionManager.add(mockRegionName, region2);
           regionManager.clear();
           regionManager1.registerViewWithRegion(mockRegionName, mockViewName, <any>{});
           assert.isFalse(spy1.calledOnce);
           assert.isFalse(spy2.called);
       });
   });
});