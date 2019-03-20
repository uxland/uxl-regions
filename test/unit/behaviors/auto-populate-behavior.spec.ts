import {AutoPopulateBehavior} from "../../../src";
describe('Given an instance of AutoPopulateBehavior', () =>{
    describe('and `attach` method is invoked', () =>{
        it('should add registered views to the target region', () =>{
            let views = [{key: 'v1', view: <any>{}}, {key: 'v2', view: <any>{}}];
            const regionName = 'region';
            let region ={
                regionManager:{getRegisteredViews: jest.fn().mockReturnValue(views)},
                addView: jest.fn(),
                name: regionName
            };
            let behavior = new AutoPopulateBehavior(<any>region);
            behavior.attach();
            expect(region.regionManager.getRegisteredViews).toBeCalledWith(regionName);
            expect(region.addView).toContain(2);
            expect(region.addView.mock.calls[0]).toEqual(['v1',{}]);
            expect(region.addView.mock.calls[1]).toEqual(['v2',{}]);
        });
    });
});