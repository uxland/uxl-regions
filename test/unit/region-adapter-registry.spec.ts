import {adapterFactory, RegionAdapterRegistry} from "../../src";
class Element1{

}
class Element2{

}

describe('Given an instance of RegionAdapterRegistry', () => {
    describe('and registring an adapter factory', () => {
        it('should allow to register by constructor', () => {
            let factory: adapterFactory = () => <any>{};
            let factory2: adapterFactory = () => <any>{};
            let regionAdapterRegistry = new RegionAdapterRegistry();
            regionAdapterRegistry.registerAdapterFactory(Element1, factory);
            regionAdapterRegistry.registerAdapterFactory(Element2, factory2);
            expect(regionAdapterRegistry.getAdapterFactory(<any>(new Element1()))).toBe(factory);
            expect(regionAdapterRegistry.getAdapterFactory(<any>(new Element2()))).toBe(factory2);
        });
        it('should allow to register by tag name', () => {
            let factory: adapterFactory = () => <any>{};
            let factory2: adapterFactory = () => <any>{};
            let regionAdapterRegistry = new RegionAdapterRegistry();
            regionAdapterRegistry.registerAdapterFactory(document.createElement('div').tagName, factory);
            regionAdapterRegistry.registerAdapterFactory(document.createElement('span').tagName, factory2);
            expect(regionAdapterRegistry.getAdapterFactory(document.createElement('div'))).toBe(factory);
            expect(regionAdapterRegistry.getAdapterFactory(document.createElement('span'))).toBe(factory2);
        });
        it('should allow to register by local name', () => {
            let factory: adapterFactory = () => <any>{};
            let factory2: adapterFactory = () => <any>{};
            let regionAdapterRegistry = new RegionAdapterRegistry();
            regionAdapterRegistry.registerAdapterFactory('div', factory);
            regionAdapterRegistry.registerAdapterFactory('span', factory2);
            expect(regionAdapterRegistry.getAdapterFactory(document.createElement('div'))).toBe(factory);
            expect(regionAdapterRegistry.getAdapterFactory(document.createElement('span'))).toBe(factory2);
        });
        it('should replace factory if key already exists', function () {
            let factory1: adapterFactory = () => <any>{};
            let factory2: adapterFactory = () => <any>{};
            let regionAdapterRegistry = new RegionAdapterRegistry();

            regionAdapterRegistry.registerAdapterFactory(Element1, factory1);
            regionAdapterRegistry.registerAdapterFactory(Element1, factory2);
            expect(regionAdapterRegistry.getAdapterFactory(<any>(new Element1()))).toBe(factory2);

            regionAdapterRegistry.registerAdapterFactory('SPAN', factory2);
            regionAdapterRegistry.registerAdapterFactory('SPAN', factory1);
            expect(regionAdapterRegistry.getAdapterFactory(document.createElement('span'))).toBe(factory1);

            regionAdapterRegistry.registerAdapterFactory('button', factory2);
            regionAdapterRegistry.registerAdapterFactory('button', factory1);
            expect(regionAdapterRegistry.getAdapterFactory(document.createElement('button'))).toBe(factory1);
        });
        it('should allow define a default factory', () => {
            let factory1: adapterFactory = () => <any>{};
            let factory2: adapterFactory = () => <any>{};
            let regionAdapterRegistry = new RegionAdapterRegistry();
            regionAdapterRegistry.registerAdapterFactory(Element1, factory1);
            regionAdapterRegistry.registerDefaultAdapterFactory(factory2);
            expect(regionAdapterRegistry.getAdapterFactory(document.createElement('span'))).toBe(factory2);
            expect(regionAdapterRegistry.getAdapterFactory(<any>(new Element1()))).toBe(factory1);
        });
        it('should return null if no default factory defined', () => {
            let regionAdapterRegistry = new RegionAdapterRegistry();
            //ensure registry is empty
            regionAdapterRegistry['adapterRegistry'] = new Map<any, adapterFactory>();
            expect(regionAdapterRegistry.getAdapterFactory(document.createElement('div'))).toBeNull();
        });
    });
});