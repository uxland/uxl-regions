import {validateView} from "../../src";
import {JSDOM} from 'jsdom';

describe('when invoking `validate view` function', () =>{
    it('should return true if htmlTag is supplied', () =>{
        expect(validateView({htmlTag: 'div'})).toBe(true);
    });
    it('should return true if factory is supplied', () =>{
        expect(validateView({factory: () => (<any>{})})).toBe(true);
    });
    it('should return true if element is supplied', () =>{
        expect(validateView({element: window.document.createElement('div')})).toBe(true);
    });
    it('should raise error if no htmlTag an no element and no factory supplied', () =>{
        expect(() => validateView({})).toThrow('One of properties htmlTag, factory or element must be set');
    });
    it('should raise error if htmlTag is not an string', () =>{
        expect(() => validateView({htmlTag: <any>true})).toThrow('htmlTag property must be an string');
    });
    it('should raise error if factory is not a function', () =>{
        expect(() => validateView({factory: <any>true})).toThrow('factory property must be a function');
    });
    it('should raise error if element is not an html element', () =>{
        expect(() => validateView({element: <any>true})).toThrow('element property must be an HTMLElement');
    });
});