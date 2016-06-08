/**
 * Created by CutmanCometh on 6/7/16.
 */

describe('DataRow class',function () {
    it('constructor initializes', function () {
        var d = new DataRow(' this\tthat\t ');
        var e = new DataRow('\t \t');
        expect(d.data).toEqual(['this','that',null]);
        expect(e.data).toEqual([null,null,null]);
    });


    it('getData returns copy of data', function () {
        var d = new DataRow('this	that	theOther');
        expect(d.getData()).toEqual(['this','that','theOther']);
    });
});