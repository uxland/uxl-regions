import {IRegion, IRegionBehavior} from "../../../src";
import * as defaultRegistry from "../../../src/behaviors/default-registry";
import {AdapterBase} from "../../../src/adapters";

describe('Given an instance of AdapterBase class', () => {
    it('should initialize behaviors from default registry', () => {
        let region: any = <any>{};

        class Behavior1 implements IRegionBehavior {
            constructor(public region: IRegion) {
            }

            attach(): void {
            }

            detach(): void {
            }
        }

        class Behavior2 implements IRegionBehavior {
            constructor(public region: IRegion) {
            }

            attach(): void {
            }

            detach(): void {
            }
        }

        Object.defineProperty(defaultRegistry.defaultBehaviorRegistry, 'behaviors', {
            get: jest.fn(() => [Behavior1, Behavior2]),
            set: jest.fn()
        });
        let adapter = new AdapterBase(<any>{uxlRegion: region});
        expect(adapter.behaviors.length).toEqual(2);
        expect(adapter.behaviors[0].constructor).toEqual(Behavior1);
        expect((adapter.behaviors[0] as Behavior1).region).toBe(region);
        expect(adapter.behaviors[1].constructor).toBe(Behavior2);
        expect((adapter.behaviors[1] as Behavior2).region).toBe(region);
    });
    describe('and a view is activated', () => {
        it('should append view to host', () => {
            let region = {activate: jest.fn(), deactivate: jest.fn(), currentActiveViews: []};
            let host = {appendChild: jest.fn(), contains: jest.fn(), uxlRegion: region};
            let adapter = new AdapterBase(<any>host);
            let view: any = document.createElement('div');
            adapter.activateView(view);
            expect(host.appendChild).toBeCalledWith(view);
        });
        it('should not append view if already contained in host', () => {
            let region = {activate: jest.fn(), deactivate: jest.fn(), currentActiveViews: []};
            let host = {appendChild: jest.fn(), contains: jest.fn().mockReturnValue(true), uxlRegion: region};
            let adapter = new AdapterBase(<any>host);
            let view: any = document.createElement('div');
            adapter.activateView(view);
            expect(host.appendChild).not.toBeCalledWith(view);
        });
        it('should set hidden atribute to false', () => {
            let region = {activate: jest.fn(), deactivate: jest.fn(), currentActiveViews: []};
            let host = {appendChild: jest.fn(), contains: jest.fn().mockReturnValue(true), uxlRegion: region};
            let adapter = new AdapterBase(<any>host);
            let view: any = document.createElement('div');
            adapter.activateView(view);
            expect(view.hidden).toBe(false);
        })
    });
    describe('and view is deactivated', () => {
        describe('and view definition removeFromDOMwhenDeactivated` is true', () => {
            it('should remove view from host', () => {
                let region = {currentViews: [], viewRemovedFromDom: jest.fn()};
                let host = {
                    removeChild: jest.fn(),
                    appendChild: jest.fn(),
                    contains: jest.fn().mockReturnValue(true),
                    uxlRegion: region
                };
                let view: any = document.createElement('div');
                view.view = {removeFromDomWhenDeactivated: true};
                let adapter = new AdapterBase(<any>host);
                adapter.deactivateView(view);
                expect(host.removeChild).toBeCalledWith(view);
            });
            it('should notify region', () => {
                let region = {currentViews: [], viewRemovedFromDom: jest.fn()};
                let host = {
                    removeChild: jest.fn(),
                    appendChild: jest.fn(),
                    contains: jest.fn().mockReturnValue(true),
                    uxlRegion: region
                };
                let view: any = document.createElement('div');
                view.view = {removeFromDomWhenDeactivated: true};
                let adapter = new AdapterBase(<any>host);
                adapter.deactivateView(view);
                expect(region.viewRemovedFromDom).toBeCalledWith((view.view));
            })
        });

        it('should set hidden attribute to true', () => {
            let region = {currentViews: []};
            let host = {
                removeChild: jest.fn(),
                appendChild: jest.fn(),
                contains: jest.fn().mockReturnValue(true),
                uxlRegion: region
            };
            let view: any = document.createElement('div');
            view.view = {};
            let adapter = new AdapterBase(<any>host);
            adapter.deactivateView(view);
            expect(view.hidden).toBe(true);
        })
    });
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    })
});

