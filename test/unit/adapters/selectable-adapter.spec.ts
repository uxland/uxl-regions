import {SelectableAdapter} from "../../../src";
import {nop} from "@uxland/uxl-utilities";

describe('When instantiating SelectableAdapter class', () => {
    it('should set attrForSelected property', () => {
        let adapter = new SelectableAdapter(<any>{});
        expect(adapter.host['attrForSelected']).toEqual('name');
    });

});
describe('Given an instance of SelectableAdapter class', () => {
    describe('and `viewAdded` method is invoked', () => {
        describe('and region has already an active view', () => {
            it('should do nothing', () => {
                let region = {activate: jest.fn(), deactivate: jest.fn(), currentActiveViews: [{}]};
                let adapter = new SelectableAdapter(<any>{uxlRegion: region});
                adapter.viewAdded(<any>{}).then(nop);
                expect(region.activate).not.toBeCalled();
                expect(region.activate).not.toBeCalled()
            });
        });
        describe('and region has no currently an active view', () => {
            it('it should activate added view if is default', () => {
                let region = {activate: jest.fn(), deactivate: jest.fn(), currentActiveViews: [{}]};
                let adapter = new SelectableAdapter(<any>{uxlRegion: region});
                let view: any = {isDefault: true};
                adapter.viewAdded(view).then(nop);
                expect(region.activate).toBeCalledWith(view);
            });
            it('should do nothing if added view is not default', () => {
                let region = {activate: jest.fn(), deactivate: jest.fn(), currentActiveViews: [{}]};
                let adapter = new SelectableAdapter(<any>{uxlRegion: region});
                adapter.viewAdded(<any>{isDefault: false}).then(nop);
                expect(region.activate).not.toBeCalled();
                adapter.viewAdded(<any>{}).then(nop);
                expect(region.activate).not.toBeCalled();
            });
        })
    });
    describe('and a view is activated', () => {
        it('should set adapter.attrForSelected property to view', async () => {
            let adapter = new SelectableAdapter(<any>{contains: () => true, uxlRegion: {currentActiveViews: []}});
            let view = {viewKey: 'my-view'};
            await adapter.activateView(<any>view);
            expect(view['name']).toEqual('my-view')
        });
        it('should set host selected property to viewKey', async () => {
            let adapter = new SelectableAdapter(<any>{contains: () => true, uxlRegion: {currentActiveViews: []}});
            let view = {viewKey: 'my-view'};
            await adapter.activateView(<any>view);
            expect(adapter.host['selected']).toEqual('my-view');
        });
        it('should deactivate current active view', async () => {
            let region = {currentActiveViews: [{view: 'selected-view'}], deactivate: jest.fn()};
            let adapter = new SelectableAdapter(<any>{
                contains: () => true,
                selected: 'selected-view',
                uxlRegion: region
            });
            let view = {viewKey: 'my-view'};
            await adapter.activateView(<any>view);
            expect(region.deactivate).toBeCalledTimes(1);
        });
    });
    describe('and view is deactivated', () => {
        it('should do nothing if host selected is different than viewKey', async () => {
            let adapter = new SelectableAdapter(<any>{contains: () => true, selected: 'other-view'});
            let view = {viewKey: 'my-view'};
            await adapter.deactivateView(<any>view);
            expect(adapter.host['selected']).toEqual('other-view');
        });
        it('should set host selected property to null if host selected property current value equals viewKey', async () => {
            let adapter = new SelectableAdapter(<any>{
                contains: () => true,
                selected: 'my-view',
                uxlRegion: {currentViews: []}
            });
            let view = {viewKey: 'my-view'};
            await adapter.deactivateView(<any>view);
            expect(adapter.host['selected']).toBeNull();
        });
        it('should activate default view if any', async () => {
            let defaultView = {viewKey: 'default-view', isDefault: true};
            let view = {viewKey: 'my-view'};
            let region = {currentViews: [defaultView], activate: jest.fn()};
            let adapter = new SelectableAdapter(<any>{contains: () => true, selected: 'my-view', uxlRegion: region});
            await adapter.deactivateView(<any>view);
            expect(region.activate).toBeCalledWith(defaultView)
        });
    })
});