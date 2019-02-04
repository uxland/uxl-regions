import {viewFactory} from "../../src/view-factory";
import {assert} from 'chai';
import {ViewDefinition} from "../../src/view-definition";
import * as sinon from 'sinon';
import {JSDOM} from 'jsdom';
import {IRegion} from "../../src";
declare var global: any;

describe('when invoking `viewFactory` function', () =>{
    const region = <IRegion>{};
    beforeEach(() =>{
       global.window = new JSDOM('').window;
       sinon.reset();
       sinon.restore();
    });
    describe('and view supplies `element` property', () =>{
       it('should return view `element` property value', async() =>{
           let view: ViewDefinition = {element: window.document.createElement('div')};
           let element = await viewFactory(view, region, 'myView');
           assert.strictEqual(element,view.element);
           assert.strictEqual(element.view, view);
           assert.strictEqual(element.region, region);
           assert.strictEqual(element.viewKey, 'myView');
       })
    });
    describe('and view supplies `factory` method', () =>{
        it('should return factory method result', async() =>{
            let element = window.document.createElement('my-view');
            let view: ViewDefinition = {factory: () => Promise.resolve(element)};
            let result = await viewFactory(view, region, 'myView');
            assert.strictEqual(result, element);
            assert.strictEqual(result.view, view);
            assert.strictEqual(result.region, region);
            assert.strictEqual(result.viewKey, 'myView');
        })
    });
    describe('and view supplies `htmlTag` property', () =>{
        it('should create an html element',async() =>{
            let spy = sinon.spy(window.document, 'createElement');
            let view = {htmlTag: 'my-view'}
            let element = await viewFactory(view, region, 'myView');
            assert.isTrue(spy.calledOnceWith('my-view'));
            assert.strictEqual(element.view, view);
            assert.strictEqual(element.region, region);
            assert.strictEqual(element.viewKey, 'myView');
        });
        it('should import module if htmlUrl supplied', async() =>{
           /* let stub = sinon.stub(importHref, 'importHref');
            stub.returns(Promise.resolve(true));
            let view = {htmlTag: 'my-view', htmlUrl: '../src/my-view.js'};
            let element = await viewFactory(view, region, 'myView');
            assert.isTrue(stub.calledOnceWith('../src/my-view.js'));
            assert.strictEqual(element.view, view);
            assert.strictEqual(element.region, region);
            assert.strictEqual(element.viewKey, 'myView');*/
        });
    });
})