import {BehaviorRegistry} from "../../../src/behaviors/behavior-registry";
import {IRegion, IRegionBehavior} from "../../../src";
import {expect} from 'chai';
describe('Given an instance of BehaviorRegistry class', () =>{
    describe('an a behavior is registered', () =>{
        it('should be retrieved on behaviors property', () =>{
            let registry = new BehaviorRegistry();
            class MyBehavior implements IRegionBehavior{
                constructor(region: IRegion){}
                attach(): void {
                }

                detach(): void {
                }

            }

            registry.register(MyBehavior);
            expect(registry.behaviors).to.contain(MyBehavior)
            class MyOtherBehavior implements IRegionBehavior{
                constructor(region: IRegion){}
                attach(): void {
                }

                detach(): void {
                }
            }
            registry.register(MyOtherBehavior);
            expect(registry.behaviors).to.contain(MyBehavior);
            expect(registry.behaviors).to.contain(MyOtherBehavior);
        });
        it('should not add duplicated items', () =>{
            let registry = new BehaviorRegistry();
            class MyBehavior implements IRegionBehavior{
                constructor(region: IRegion){}
                attach(): void {
                }

                detach(): void {
                }

            }

            registry.register(MyBehavior);
            registry.register(MyBehavior);
            expect(registry.behaviors.filter(b => b === MyBehavior).length).to.be.equal(1);
        })
    })
})