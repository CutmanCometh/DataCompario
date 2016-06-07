/**
 * Created by CutmanCometh on 6/7/16.
 */

describe('Foo class', function(){

    it('multiplies correctly', function () {
        var f = new Foo(2,3);
        var g = new Foo(4,9);

        expect(f.product()).toEqual(6);
        expect(g.product()).toEqual(36);
    });

    it('adds correctly', function () {
        var f = new Foo(2,3);
        var g = new Foo(4,9);

        expect(f.sum()).toEqual(5);
        expect(g.sum()).toEqual(13);
    });
});