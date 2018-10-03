import {ViewDefinition, ViewComponent} from "./view-definition";
import {importHref} from '@uxland/uxl-utilities/import-href';
import {IRegion} from "./region";

export const viewFactory = async(view: ViewDefinition, parentRegion: IRegion, viewKey): Promise<HTMLElement & ViewComponent> =>{
    let element: any;
    if(view.element)
        element = view.element;
    else if(view.factory)
        element = await view.factory();
    else if(view.htmlTag){
        if(view.htmlUrl)
            await importHref(view.htmlUrl);
        element = window.document.createElement(view.htmlTag);
    }
    element.view = view;
    element.region = parentRegion;
    element.viewKey = viewKey;
    return element;
};