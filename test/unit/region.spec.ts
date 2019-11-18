import {Region} from "../../src";
import * as validateView from '../../src/validate-view';
import * as viewFactory from "../../src/view-factory";
import {IRegionAdapter, ViewComponent} from "../../src";
import {when} from 'jest-when';

const mockViewName = 'my-view';
const mockReginnName = 'my-region';
describe('Given an instance of Region', () => {
    let validateViewStub: any;
    const adapterFactory: () => IRegionAdapter = () => (<any>{
        activateView: jest.fn(),
        deactivateView: jest.fn(),
        viewAdded: jest.fn()
    });
    const regionFactory = () => new Region(mockReginnName, null, document.createElement('div') as any, adapterFactory(), {
        name: mockReginnName,
        targetId: ''
    });
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
        validateViewStub = jest.spyOn(validateView, 'validateView').mockImplementation(() => true);
    });
    describe('and a view is added', () => {

        it('should store it internally', async () => {
            let region = regionFactory();
            let view = {};
            let result = await region.addView(mockViewName, view);
            expect(result).toBe(region);
            expect(region.getView(mockViewName)).toBe(view);
        });
        it('should validate view', async () => {
            let region = regionFactory();
            await region.addView(mockViewName, {});
            expect(validateViewStub).toBeCalledTimes(1)
        });
        it('should notify adapter', async () => {
            let region = regionFactory();
            let view = {};
            await region.addView(mockViewName, {});
            expect(region.adapter.viewAdded).toBeCalledWith(view);
        });
        it('should raise error if validate view raises', async () => {
            expect.assertions(1);
            validateViewStub.mockImplementation(() => {
                throw new Error()
            });
            let view = {};
            let region = regionFactory();
            expect(region.addView(mockViewName, {})).rejects;
            expect(region.adapter.viewAdded).not.toBeCalledWith(view);
        });
        it('should raise error if a view with same key is already added', async() => {
            let region = regionFactory();
            when(<any>jest.spyOn(region, 'getView')).calledWith(mockViewName).mockReturnValue({});
            await expect(region.addView(mockViewName, {})).rejects.toThrow(`Already exists a view with key ${mockViewName}`);
            expect(region.adapter.viewAdded).not.toBeCalled();
            expect(() => region.addView(mockViewName + '1', {})).not.toThrow();
            expect(region.adapter.viewAdded).toBeCalledTimes(1);
        });
    });
    describe('and a view is removed', () => {
        it('should remove it from view collection', async () => {
            let region = regionFactory();
            jest.spyOn(region, 'deactivate');
            region['views'] = {[mockViewName]: {}};
            await region.removeView(mockViewName);
            expect(region.getView(mockViewName)).toBeUndefined();
        });
        it('should deactivate it', () => {
            let region = regionFactory();
            let view = {htmlTag: 'div'};
            region['views'] = {[mockViewName]: view};
            let spy = jest.spyOn(region, 'deactivate');
            region.removeView(mockViewName);
            expect(spy).toBeCalledWith(mockViewName);
        });
        it('should remove it', async () => {
            let region = regionFactory();
            let view = {htmlTag: 'div'};
            region['views'] = {[mockViewName]: view};
            let spy = jest.spyOn(region, 'remove');
            await region.removeView(mockViewName);
            expect(spy).toBeCalledWith(mockViewName);
        });
    });
    describe('and a view is activated', () => {
        describe('by key', () => {
            it('should be added to the active views collection', async () => {
                let region = regionFactory();
                jest.spyOn(viewFactory, 'viewFactory').mockReturnValue(<any>document.createElement('my-view'));
                let view = {};
                region['views'] = {[mockViewName]: view};
                await region.activate(mockViewName);
                expect(region.currentActiveViews.find(v => v === view)).toBeDefined();
            });
            it('should be added only once', async () => {
                let view = {};
                let region = regionFactory();
                when(<any>jest.spyOn(region, 'getView')).calledWith(mockViewName).mockReturnValue(view);
                jest.spyOn(viewFactory, 'viewFactory').mockReturnValue(<any>document.createElement('my-view'));
                await region.activate(mockViewName);
                await region.activate(mockViewName);
                await region.activate(mockViewName);
                expect(region.currentActiveViews.filter(v => v === view).length).toBe(1);
            });
            it('should raise error if region does not contain view', async () => {
                let region = regionFactory();
                jest.spyOn(viewFactory, 'viewFactory').mockReturnValue(<any>document.createElement('my-view'));
                const otherViewKey = `${mockViewName}1`;
                when(<any>jest.spyOn(region, 'getView')).calledWith(mockViewName).mockReturnValue({}).calledWith(otherViewKey).mockReturnValue(undefined);
                let p = region.activate(mockViewName);
                expect(p).resolves;
                p = region.activate(otherViewKey);
                await expect(p).rejects.toThrow(`Region does not contain a view with key ${otherViewKey}`);
            });
        });
        describe('by view', () => {
            it('should be added to the active views collection', async () => {
                let view = {};
                let region = regionFactory();
                region['views'] = {[mockViewName]: view};
                jest.spyOn(viewFactory, 'viewFactory').mockReturnValue(<any>document.createElement('my-view'));
                await region.activate(view);
                expect(region.currentActiveViews.some(v => v === view)).toBe(true);
            });
            it('should be added only once', async () => {
                let view = {};
                let region = regionFactory();
                jest.spyOn(viewFactory, 'viewFactory').mockReturnValue(<any>document.createElement('my-view'));
                region['views'] = {[mockViewName]: view};
                await region.activate(view);
                await region.activate(view);
                await region.activate(view);
                expect(region.currentActiveViews.filter(v => v === view).length).toBe(1);
            });
            it('should raise error if region does not contain view', async () => {
                let region = regionFactory();
                await expect(region.activate({})).rejects.toThrow('Region does not contain this view');
            });
        });
        it('should create view component if no created previously', async () => {
            let stub = jest.spyOn(viewFactory, 'viewFactory').mockResolvedValue(<any>document.createElement('my-view'));
            let region = regionFactory();
            let view = {};
            when(<any>jest.spyOn(region, 'getView')).calledWith(mockViewName).mockReturnValue(view);
            jest.spyOn(region['components'], 'has').mockReturnValue(false);
            await region.activate(mockViewName);
            expect(region.currentActiveViews.indexOf(view) >= 0).toBe(true);
            expect(stub).toBeCalledWith(view, region, mockViewName);
        });
        it('should not create view component if created previously', async () => {
            let stub = jest.spyOn(viewFactory, 'viewFactory').mockReturnValue(<any>document.createElement('my-view'));
            let region = regionFactory();
            let view = {};
            when(<any>jest.spyOn(region, 'getView')).calledWith(mockViewName).mockReturnValue(view);
            when(<any>jest.spyOn(region['components'], 'has')).calledWith(view).mockReturnValue(true);
            when(<any>jest.spyOn(region['components'], 'get')).calledWith(view).mockReturnValue(<any>{});
            await region.activate(mockViewName);
            expect(region.currentActiveViews.indexOf(view) >= 0).toBe(true);
            expect(stub).not.toBeCalled();
        });
        it('should set activate to true to view component', async () => {
            let region = regionFactory();
            let view = {};
            let component = <ViewComponent>{};
            when(<any>jest.spyOn(region, 'getView')).calledWith(mockViewName).mockReturnValue(view);
            when(<any>jest.spyOn(region['components'], 'has')).calledWith(view).mockReturnValue(true);
            when(<jest.Mock>jest.spyOn(region['components'], 'get')).calledWith(view).mockReturnValue(<any>component);
            await region.activate(mockViewName);
            expect(component.active).toBe(true);
        });
        it('should notify adapter', async () => {
            let region = regionFactory();
            let view = {};
            let component = <ViewComponent>{};
            when(<any>jest.spyOn(region, 'getView')).calledWith(mockViewName).mockReturnValue(view);
            when(<any>jest.spyOn(region['components'], 'has')).calledWith(view).mockReturnValue(true);
            when(<jest.Mock>jest.spyOn(region['components'], 'get')).calledWith(view).mockReturnValue(<any>component);
            await region.activate(mockViewName);
            expect(region.adapter.activateView).toBeCalledWith(component);
        });
    });
    describe('and a view is deactivated', () => {
        it('should be removed from active views', () => {
            let region = regionFactory();
            let view = {};
            let component = {};
            region['views'] = {[mockViewName]: view};
            region['activeViews'] = [view];
            expect(region.currentActiveViews).toEqual([view]);
            when(<any>jest.spyOn(region['components'], 'get')).calledWith(view).mockReturnValue(<any>component);
            region.deactivate(view);
            expect(region.currentActiveViews.indexOf(view)).toBe(-1);
            region['activeViews'] = [view];
            expect(region.currentActiveViews).toEqual([view]);
            region.deactivate(mockViewName);
            expect(region.currentActiveViews.indexOf(view)).toBe(-1);
        });
        it('should deactivate component', () => {
            let region = regionFactory();
            let view = {};
            let component = <ViewComponent>{};
            region['views'] = {[mockViewName]: view};
            region['activeViews'] = [view];
            when(<any>jest.spyOn(region['components'], 'get')).calledWith(view).mockReturnValue(<any>component);
            region.deactivate(view);
            expect(component.active).toBe(false);
            region['activeViews'] = [view];
            region.deactivate(mockViewName);
            expect(component.active).toBe(false);
        });
        it('should notify adapter', () => {
            let region = regionFactory();
            let view = {};
            let component = <ViewComponent>{};
            region['views'] = {[mockViewName]: view};
            region['activeViews'] = [view];
            when(<any>jest.spyOn(region['components'], 'get')).calledWith(view).mockReturnValue(<any>component);
            region.deactivate(view);
            expect(region.adapter.deactivateView).toBeCalledWith(<any>component);
            region['activeViews'] = [view];
            jest.restoreAllMocks();
            region.deactivate(mockViewName);
            expect(region.adapter.deactivateView).toBeCalledWith(<any>component);
        });
        it('should not deactivate component neither notify adapter if component related to view not found', () => {
            let region = regionFactory();
            let view = {};
            region.deactivate(view);
            expect(region.adapter.deactivateView).not.toBeCalled();
            region.deactivate(mockViewName);
            expect(region.adapter.deactivateView).not.toBeCalled();
        });

    });
    it('contains view test', () => {
        let region = regionFactory();
        let view = {};
        region['views']['my-view'] = view;
        expect(region.containsView('my-view2')).toBe(false);
        expect(region.containsView(<any>{})).toBe(false);
        expect(region.containsView('my-view')).toBe(true);
        expect(region.containsView(view)).toBe(true);
    });
    describe('isAtiveView suite', () => {
        it('should raise exception if view does not exists', () => {
            let region = regionFactory();
            jest.spyOn(region, 'containsView').mockReturnValue(false);
            expect(() => region.isViewActive('my-view2')).toThrow(`region ${mockReginnName} doest not contain this view`);
            expect(() => region.isViewActive({})).toThrow(`region ${mockReginnName} doest not contain this view`);
            jest.resetAllMocks();
            jest.restoreAllMocks();
            jest.spyOn(region, 'containsView').mockReturnValue(true);
            expect(() => region.isViewActive('my-view2')).not.toThrow();
            expect(() => region.isViewActive({})).not.toThrow();
        });
        it('should return true if is in activeView list', () => {
            let view: any = {};
            let region = regionFactory();
            region['views'] = {[mockViewName]: view};
            region['activeViews'] = [view];
            jest.spyOn(region, 'containsView').mockReturnValue(true);
            expect(region.isViewActive(mockViewName)).toBe(true);
            expect((region.isViewActive(view))).toBe(true);
            expect(region.isViewActive('my-view-fake')).toBe(false);
            expect((region.isViewActive({}))).toBe(false);
        })

    });
    describe('toggleViewActive', () => {
        it('should raise exception if view does not exists', async () => {
            /*let region = regionFactory();
            jest.spyOn(region, 'containsView').mockReturnValue(false);
            expect(async() => await region.toggleViewActive('my-view2')).toThrow(`region ${mockReginnName} doest not contain this view`);
            expect(async () => await region.toggleViewActive({})).toThrow(`region ${mockReginnName} doest not contain this view`);
            jest.resetAllMocks();
            jest.restoreAllMocks();
            jest.spyOn(region, 'containsView').mockReturnValue(true);
            jest.spyOn(region, 'activate');
            jest.spyOn(region, 'deactivate');
            expect(async () => await region.toggleViewActive('my-view2')).not.toThrow(Error);
            expect(async() => await region.toggleViewActive({})).not.toThrow(Error);*/
        });
        it('should call deactivate view if view is active', async() => {
            let region = regionFactory();
            jest.spyOn(region, 'containsView').mockReturnValue(true);
            jest.spyOn(region, 'isViewActive').mockReturnValue(true);
            let activateSpy = jest.spyOn(region, 'activate');
            let deactivateSpy = jest.spyOn(region, 'deactivate');

            let result = await region.toggleViewActive(mockViewName);

            expect(result).toBe(false);
            expect(deactivateSpy).toBeCalledWith(mockViewName);
            expect(activateSpy).not.toBeCalled();

        });
        it('should call activate view if view is not active', async() => {
            /*let region = regionFactory();
            jest.spyOn(region, 'containsView').mockReturnValue(true);
            jest.spyOn(region, 'isViewActive').mockReturnValue(false);
            let activateSpy = jest.spyOn(region, 'activate');
            let deactivateSpy = jest.spyOn(region, 'deactivate');

            let result = await region.toggleViewActive(mockViewName);

            expect(result).toBe(true);
            expect(activateSpy).toBeCalledWith(mockViewName);
            expect(deactivateSpy).not.toBeCalled();*/

        });
    })
});
/**TODO**/
/** Test view is instantiated on activate**/