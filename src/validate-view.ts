import {ViewDefinition} from "./view-definition";
import {invariant} from '@uxland/uxl-utilities/invariant';
const isDomElement = (element: HTMLElement) => typeof HTMLElement === 'object' ?
    element instanceof HTMLElement :
    element && typeof element === 'object' && element != null && element.nodeType === 1 && typeof element.nodeName === 'string';

export const validateView = (view: ViewDefinition) =>{
    invariant(view.htmlTag || view.element || view.factory, 'One of properties htmlTag, factory or element must be set');
    if(view.htmlTag)
        invariant(typeof view.htmlTag === 'string', 'htmlTag property must be an string');
    if(view.factory)
        invariant(typeof view.factory === 'function', 'factory property must be a function');
    if(view.element)
        invariant(isDomElement(view.element), 'element property must be an HTMLElement');
    return true;
};
