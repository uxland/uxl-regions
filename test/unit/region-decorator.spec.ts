import {expect} from 'chai';
import {IRegion, RegionDefinition} from "../../src/region";
import {region, regionsProperty} from "../../src/region-decorator";
describe('when adding a region decorator to a component', () =>{
    it('should add region definition to component constructor', () =>{
        const regionDefinition = <RegionDefinition>{};
        class Component{
            @region(regionDefinition)
            region: IRegion;
        }
        let regions = Component[regionsProperty];
        expect(regions).to.exist;
        expect(regions.region).to.equal(regionDefinition);
    }) ;
});