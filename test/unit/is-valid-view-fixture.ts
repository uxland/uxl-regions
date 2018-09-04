import {assert, expect} from "chai";
import {validateView} from "../../src/validate-view";
import {JSDOM} from 'jsdom';

describe('when invoking `validate view` function', () =>{
    it('should return true if htmlTag is supplied', () =>{
        assert.isTrue(validateView({htmlTag: 'div'}))
    });
    it('should return true if factory is supplied', () =>{
        assert.isTrue(validateView({factory: () => (<any>{})}));
    });
    it('should return true if element is supplied', () =>{
        assert.isTrue(validateView({element: window.document.createElement('div')}));
    });
    it('should raise error if no htmlTag an no element and no factory supplied', () =>{
        expect(() => validateView({})).throws(Error).with.property('message').eq('One of properties htmlTag, factory or element must be set');
    })
    it('should raise error if htmlTag is not an string', () =>{
        expect(() => validateView({htmlTag: <any>true})).throws(Error).that.has.property('message').eq('htmlTag property must be an string');
    });
    it('should raise error if factory is not a function', () =>{
        expect(() => validateView({factory: <any>true})).throws(Error).that.has.property('message').eq('factory property must be a function');
    });
    it('should raise error if element is not an html element', () =>{
        expect(() => validateView({element: <any>true})).throws(Error).that.has.property('message').eq('element property must be an HTMLElement');
    });
});