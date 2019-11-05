import {BehaviorRegistry, IRegion, IRegionBehavior} from "../../../src";
describe('Given an instance of BehaviorRegistry class', () =>{
    describe('an a behavior is registered', () =>{
        it('should be retrieved on behaviors property', () =>{
            let registry = new BehaviorRegistry();
            class MyBehavior implements IRegionBehavior{
                constructor(region: IRegion){}
                attach(): Promise<void> {
                    return Promise.resolve()
                }

                detach() {
                    return Promise.resolve()
                }

            }

            registry.register(MyBehavior);
            expect(registry.behaviors).toContain(MyBehavior);
            class MyOtherBehavior implements IRegionBehavior{
                constructor(region: IRegion){}
                attach(): Promise<void> {
                    return Promise.resolve()
                }

                detach() {
                    return Promise.resolve()
                }
            }
            registry.register(MyOtherBehavior);
            expect(registry.behaviors).toContain(MyBehavior);
            expect(registry.behaviors).toContain(MyOtherBehavior);
        });
        it('should not add duplicated items', () =>{
            let registry = new BehaviorRegistry();
            class MyBehavior implements IRegionBehavior{
                constructor(region: IRegion){}
                attach(): Promise<void> {
                    return Promise.resolve()
                }

                detach() {
                    return Promise.resolve()
                }

            }

            registry.register(MyBehavior);
            registry.register(MyBehavior);
            expect(registry.behaviors.filter(b => b === MyBehavior).length).toBe(1);
        });
    });
});