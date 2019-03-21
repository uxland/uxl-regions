import {MultipleActiveAdapter} from "../../../src";
import {nop} from "@uxland/uxl-utilities";

describe('Given an instance of MultipleActiveAdapter class', () => {
    describe('and adding a view', () => {
        it('should activate view in region', async() => {
            let region: any = {activate: jest.fn()};
            let host = {uxlRegion: region};
            let adapter = new MultipleActiveAdapter(<any>host);
            let view: any = {};
            await adapter.viewAdded(view).then(nop);
            expect(region.activate).toBeCalledWith(view)
        })
    });
    describe('when inserting a view in region host', () => {
        it('should take sortHint into account', () => {
            let views = [{sortHint: '000'}, {sortHint: '001'}, {sortHint: '002'}];
            let viewComponent = document.createElement('div');
            let host = document.createElement('div');
            host['uxlRegion'] = {currentActiveViews: views};
            host.appendChild(viewComponent);
            let insertStub = jest.spyOn(host, 'insertBefore');
            let newComponent = document.createElement('span');
            newComponent['view'] = views[0];
            let adapter = new MultipleActiveAdapter(<any>host);
            adapter['addViewToHost'](<any>newComponent);
            expect(insertStub).toBeCalledTimes(1);
            jest.resetAllMocks();
        })
    })
});