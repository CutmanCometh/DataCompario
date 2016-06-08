/**
 * Created by CutmanCometh on 6/8/16.
 */

describe('DataMatrix class', function () {
    it('parses data array from data string', function () {
        var d = DataMatrix.getRowFromDataString(' this\tthat\t ');
        var e = DataMatrix.getRowFromDataString('\t \t');
        var f = DataMatrix.getRowFromDataString('2\tlegit \ttrue\t false\t 2.71828 \t\t \t');


        expect(d).toEqual(['this', 'that', null]);
        expect(e).toEqual([null, null, null]);
        expect(f).toEqual([2,'legit',true,false,2.71828,null,null,null]);
    });

    it('parses values to their underlying type', function () {
        expect(DataMatrix.getValue("")).toEqual(null);
        expect(DataMatrix.getValue(" ")).toEqual(null);
        expect(DataMatrix.getValue("        ")).toEqual(null);
        expect(DataMatrix.getValue("1729")).toEqual(1729);
        expect(DataMatrix.getValue("true")).toBe(true);
        expect(DataMatrix.getValue("false")).toBe(false);
        expect(DataMatrix.getValue("2.71828")).toEqual(2.71828);
        expect(DataMatrix.getValue("feeling twenty-two")).toEqual('feeling twenty-two');
        expect(DataMatrix.getValue(" 123")).toEqual(123);
        expect(DataMatrix.getValue("999 ")).toEqual(999);
        expect(DataMatrix.getValue("  -1 ")).toEqual(-1);
        expect(DataMatrix.getValue("true ")).toBe(true);
        expect(DataMatrix.getValue("    false")).toBe(false);
        expect(DataMatrix.getValue(" true ")).toBe(true);
        expect(DataMatrix.getValue("  shake  it off")).toEqual("shake  it off");
        expect(DataMatrix.getValue("he's the reason     ")).toEqual("he's the reason");
        expect(DataMatrix.getValue("        she's Cheer Captain  ")).toEqual("she's Cheer Captain");

        DataMatrix.sqlNULLs = false;
        expect(DataMatrix.getValue("NULL")).toEqual('NULL');

        DataMatrix.sqlNULLs = true;
        expect(DataMatrix.getValue("NULL")).toEqual(null);

    });

    it('initializes by parsing a data string', function () {
        var a = new DataMatrix("foo");
        var c = new DataMatrix("foo\nbar");
        var b = new DataMatrix("126	Medford-Klamath Falls	3\n        98	Jacksonville-Brunswick	2\n        17	Beaumont-Port Arthur	2")

        expect(a).toEqual([['foo']]);
        expect(c).toEqual([
            ['foo'],
            ['bar']
        ]);
        expect(b).toEqual([
            [126,"Medford-Klamath Falls",3],
            [98,"Jacksonville-Brunswick",2],
            [17,"Beaumont-Port Arthur",2]
        ]);

        DataMatrix.sqlNULLs = false
        var d = new DataMatrix("Distribution Center	6766	Hopkinsville	20	42240\nDISP HAMMOND LA GROC FDC      	6857	Robert	22	70455\n	7028		NULL	00000\n	WESTCHESTER	Valhalla	39	10595");
        expect(d).toEqual([
            ["Distribution Center",6766,"Hopkinsville",20,42240],
            ["DISP HAMMOND LA GROC FDC",6857,"Robert",22,70455],
            [null,7028,null,'NULL',0],
            [null,"WESTCHESTER","Valhalla",39,10595]
        ]);

        DataMatrix.sqlNULLs = true;
        var d = new DataMatrix("Distribution Center	6766	Hopkinsville	20	42240\nDISP HAMMOND LA GROC FDC      	6857	Robert	22	70455\n	7028		NULL	00000\n	WESTCHESTER	Valhalla	39	10595");
        expect(d).toEqual([
            ["Distribution Center",6766,"Hopkinsville",20,42240],
            ["DISP HAMMOND LA GROC FDC",6857,"Robert",22,70455],
            [null,7028,null,null,0],
            [null,"WESTCHESTER","Valhalla",39,10595]
        ]);
        /*expect().toEqual([]);
        expect().toEqual([]);
        expect().toEqual([]);
        expect().toEqual([]);
        expect().toEqual([]);
        expect().toEqual([]);
        expect().toEqual([]);
        expect().toEqual([]);
        expect().toEqual([]);*/
    });
    
    it('extracts metadata for columns', function () {
        //var dataMatrix = new DataMatrix();
    });
});