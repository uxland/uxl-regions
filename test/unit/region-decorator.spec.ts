import {IRegion, RegionDefinition} from "../../src";
import {region, regionsProperty} from "../../src";
describe('when adding a region decorator to a component', () =>{
    it('should add region definition to component constructor', () =>{
        const regionDefinition = <RegionDefinition>{};
        class Component{
            @region(regionDefinition)
            region: IRegion;
        }
        let regions = Component[regionsProperty];
        expect(regions).toBeDefined();
        expect(regions.region).toBe(regionDefinition);
    }) ;
});