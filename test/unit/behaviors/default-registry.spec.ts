import {expect} from 'chai';
import {defaultBehaviorRegistry} from "../../../src/behaviors/default-registry";
import {AutoPopulateBehavior} from "../../../src/behaviors/auto-populate-behavior";

describe('Given default registry', () =>{
    it('should contain AutoPopulateBehavior', () =>{
        expect(defaultBehaviorRegistry.behaviors).to.contain(AutoPopulateBehavior);
    })
})