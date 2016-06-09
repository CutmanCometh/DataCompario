/**
 * Created by CutmanCometh on 6/8/16.
 */

describe('ColumnData class', function () {

    it('compares itself against another ColumnData class', function () {
        var cd1 = new ColumnData();
        var cd2 = new ColumnData();

        expect(cd1.equals(cd1)).toBe(true);

        expect(cd1.equals(cd2)).toBe(true);

        cd1.booleanValues = 3;
        expect(cd1.equals(cd2)).toBe(false);

        cd2.booleanValues = 3;
        expect(cd1.equals(cd2)).toBe(true);

        cd1.numberValues = 190;
        expect(cd1.equals(cd2)).toBe(false);

        cd2.numberValues = 190;
        expect(cd1.equals(cd2)).toBe(true);

        cd1.nullValues = 1729;
        expect(cd1.equals(cd2)).toBe(false);

        cd2.nullValues = 1729;
        expect(cd1.equals(cd2)).toBe(true);

        cd1.stringValues = 1;
        expect(cd1.equals(cd2)).toBe(false);

        cd2.stringValues = 2;
        expect(cd1.equals(cd2)).toBe(false);

        cd2.stringValues = 1;
        expect(cd1.equals(cd2)).toBe(true);

        cd1.maxStringLength = 55;
        expect(cd1.equals(cd2)).toBe(false);

        cd2.maxStringLength = 101;
        expect(cd1.equals(cd2)).toBe(false);

        cd2.maxStringLength = 55;
        expect(cd1.equals(cd2)).toBe(true);

        cd1.containsUniqueValues = false;
        expect(cd1.equals(cd2)).toBe(false);

        cd2.containsUniqueValues = false;
        expect(cd1.equals(cd2)).toBe(true);
    });

    it('sorts columns according to which is most likely to contain the unique id', function(){
        var cd1 = new ColumnData();
        var cd2 = new ColumnData();

        //TODO be more explicit in this test. set up the exact conditions being tested for before each assertion

        //if they are the same object, sort them the same
        expect(ColumnData.compare(cd1, cd1)).toEqual(0);

        //if all the values are the same, sort them the same
        expect(ColumnData.compare(cd1, cd2)).toEqual(0);

        //if one has unique values and the other doesn't, sort the one with unique values higher
        cd1.containsUniqueValues = false;
        expect(ColumnData.compare(cd1, cd2)).toBeLessThan(0);

        cd1.containsUniqueValues = true;
        cd2.containsUniqueValues = false;
        expect(ColumnData.compare(cd1, cd2)).toBeGreaterThan(0);

        cd1.containsUniqueValues = false;

        //if one has more number values than the other, sort the one with more integer values higher
        cd1.numberValues = 51;
        cd2.numberValues = 30;
        expect(ColumnData.compare(cd1, cd2)).toBeGreaterThan(0);

        cd2.numberValues = 52;
        expect(ColumnData.compare(cd1, cd2)).toBeLessThan(0);

        cd1.numberValues = 52;

        //if one has a shorter max string length than the other, sort the one with the short max length higher, unless then one with the shorter max string length is 0, in which case sort the one with the nonzero max string length higher
        cd1.maxStringLength = 6;
        cd2.maxStringLength = 35;
        expect(ColumnData.compare(cd1, cd2)).toBeGreaterThan(0);

        cd1.maxStringLength = 105;
        cd2.maxStringLength = 7;
        expect(ColumnData.compare(cd1, cd2)).toBeLessThan(0);

        cd2.maxStringLength = 0;
        expect(ColumnData.compare(cd1, cd2)).toBeGreaterThan(0);

        //TODO add more intelligent sorting to ColumnData
    });
});