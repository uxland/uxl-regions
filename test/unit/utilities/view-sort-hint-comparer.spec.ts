import {viewSortHintComparer} from "../../../src/utilities/view-sort-hint-comparer";
import {assert} from 'chai';

describe('When invoking `viewSortHintComparer` function', () =>{
    it('should return -1 if neither of two argumens supplies sortHint property', () =>{
        assert.equal(viewSortHintComparer(<any>{}, <any>{}), -1);
    })
    it('it should return -1 if first arg supplies sortHint property but second arg does not', () =>{
        assert.equal(viewSortHintComparer({sortHint: '0'}, {}), -1)
    })
    it('should return 1 if first args does not supply sortHint property but second does', () =>{
        assert.equal(viewSortHintComparer({}, {sortHint: '0'}), 1);
    })
    it('should return -1 if first arg sortHint is lower than second arg sortHint', () =>{
        assert.equal(viewSortHintComparer({sortHint: '0'}, {sortHint: '001'}), -1);
        assert.equal(viewSortHintComparer({sortHint: 'a'}, {sortHint: 'b'}), -1);
    })
    it('should return 0 if both sortHint are equal', () =>{
        assert.equal(viewSortHintComparer({sortHint: '1'}, {sortHint: '1'}), 0);
        assert.equal(viewSortHintComparer({sortHint: 'b'}, {sortHint: 'b'}), 0);
    })
    it('should return 1 if first arg sortHint is higher than second arg sortHint', () =>{
        assert.equal(viewSortHintComparer({sortHint: '001'}, {sortHint: '0'}), 1);
        assert.equal(viewSortHintComparer({sortHint: 'b'}, {sortHint: 'a'}), 1);
    })
})