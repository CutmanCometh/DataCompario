/**
 * Created by CutmanCometh on 6/8/16.
 */



describe('DataMatrix class', function () {
    //if(!DataMatrix) {var DataMatrix = {};}//so JSHint will shut up

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
        var b = new DataMatrix("126	Medford-Klamath Falls	3\n        98	Jacksonville-Brunswick	2\n        17	Beaumont-Port Arthur	2");
        var d = new DataMatrix("");

        expect(d).toEqual([]);
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

        DataMatrix.sqlNULLs = false;
        var d = new DataMatrix("Distribution Center	6766	Hopkinsville	20	42240\nDISP HAMMOND LA GROC FDC      	6857	Robert	22	70455\n	7028		NULL	00000\n	WESTCHESTER	Valhalla	39	10595");
        expect(d).toEqual([
            ["Distribution Center",6766,"Hopkinsville",20,42240],
            ["DISP HAMMOND LA GROC FDC",6857,"Robert",22,70455],
            [null,7028,null,'NULL',0],
            [null,"WESTCHESTER","Valhalla",39,10595]
        ]);

        DataMatrix.sqlNULLs = true;
        d = new DataMatrix("Distribution Center	6766	Hopkinsville	20	42240\nDISP HAMMOND LA GROC FDC      	6857	Robert	22	70455\n	7028		NULL	00000\n	WESTCHESTER	Valhalla	39	10595");
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

        DataMatrix.sqlNULLs = false;
        var d = new DataMatrix("Distribution Center	6766	Hopkinsville	20	42240\nDISP HAMMOND LA GROC FDC      	6857	Robert	22	70455\n	7028		NULL	00000\n	WESTCHESTER	Valhalla	true	10595");

        expect(DataMatrix.getColumnData(d, 0).equals({
            stringValues : 2,
            maxStringLength : 24,
            nullValues : 2,
            numberValues : 0,
            booleanValues : 0,
            containsUniqueValues : false
        })).toBe(true);

        expect(DataMatrix.getColumnData(d, 1).equals({
            stringValues : 1,
            maxStringLength : 11,
            nullValues : 0,
            numberValues : 3,
            booleanValues : 0,
            containsUniqueValues : true
        })).toBe(true);

        expect(DataMatrix.getColumnData(d, 2).equals({
            stringValues : 3,
            maxStringLength : 12,
            nullValues : 1,
            numberValues : 0,
            booleanValues : 0,
            containsUniqueValues : true
        })).toBe(true);

        expect(DataMatrix.getColumnData(d, 3).equals({
            stringValues : 1,
            maxStringLength : 4,
            nullValues : 0,
            numberValues : 2,
            booleanValues : 1,
            containsUniqueValues : true
        })).toBe(true);

        expect(DataMatrix.getColumnData(d, 4).equals({
            stringValues : 0,
            maxStringLength : 0,
            nullValues : 0,
            numberValues : 4,
            booleanValues : 0,
            containsUniqueValues : true
        })).toBe(true);



        DataMatrix.sqlNULLs = true;
        d = new DataMatrix("Distribution Center	6766	Hopkinsville	20	42240\nDISP HAMMOND LA GROC FDC      	6857	Robert	22	70455\n	7028		NULL	00000\n	WESTCHESTER	Valhalla	true	10595");
        expect(DataMatrix.getColumnData(d, 3).equals({
            stringValues : 0,
            maxStringLength : 0,
            nullValues : 1,
            numberValues : 2,
            booleanValues : 1,
            containsUniqueValues : true
        })).toBe(true);

    });

    it('sets the column number of ColumnData objects', function () {
        var dm = new DataMatrix("\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t");

        expect(DataMatrix.getColumnData(dm, 0).columnNumber).toEqual(0);
        expect(DataMatrix.getColumnData(dm, 1).columnNumber).toEqual(1);
        expect(DataMatrix.getColumnData(dm, 2).columnNumber).toEqual(2);
        expect(DataMatrix.getColumnData(dm, 3).columnNumber).toEqual(3);
        expect(DataMatrix.getColumnData(dm, 4).columnNumber).toEqual(4);
        expect(DataMatrix.getColumnData(dm, 5).columnNumber).toEqual(5);
        expect(DataMatrix.getColumnData(dm, 6).columnNumber).toEqual(6);


        dm = new DataMatrix("foo");
        expect(DataMatrix.getColumnData(dm, 0).columnNumber).toEqual(0);

        dm = new DataMatrix("foo\tbar");
        expect(DataMatrix.getColumnData(dm, 0).columnNumber).toEqual(0);
        expect(DataMatrix.getColumnData(dm, 1).columnNumber).toEqual(1);

        dm = new DataMatrix("\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t");
        expect(DataMatrix.getColumnData(dm, 0).columnNumber).toEqual(0);
        expect(DataMatrix.getColumnData(dm, 1).columnNumber).toEqual(1);
        expect(DataMatrix.getColumnData(dm, 2).columnNumber).toEqual(2);
        expect(DataMatrix.getColumnData(dm, 3).columnNumber).toEqual(3);
        expect(DataMatrix.getColumnData(dm, 4).columnNumber).toEqual(4);
        expect(DataMatrix.getColumnData(dm, 5).columnNumber).toEqual(5);
        expect(DataMatrix.getColumnData(dm, 6).columnNumber).toEqual(6);
        expect(DataMatrix.getColumnData(dm, 7).columnNumber).toEqual(7);
        expect(DataMatrix.getColumnData(dm, 8).columnNumber).toEqual(8);
        expect(DataMatrix.getColumnData(dm, 9).columnNumber).toEqual(9);
        expect(DataMatrix.getColumnData(dm, 10).columnNumber).toEqual(10);
        expect(DataMatrix.getColumnData(dm, 11).columnNumber).toEqual(11);
        expect(DataMatrix.getColumnData(dm, 12).columnNumber).toEqual(12);
        expect(DataMatrix.getColumnData(dm, 13).columnNumber).toEqual(13);
        expect(DataMatrix.getColumnData(dm, 14).columnNumber).toEqual(14);
        expect(DataMatrix.getColumnData(dm, 15).columnNumber).toEqual(15);
        expect(DataMatrix.getColumnData(dm, 16).columnNumber).toEqual(16);


    });
    
    it('compares two rows for equality', function () {
        var row1 = [1, "Bartleby", false];
        var row2 = [2, "Buckminster", true];

        expect(DataMatrix.areRowsEqual(row1, row1)).toBe(true);
        expect(DataMatrix.areRowsEqual(row1, row1.slice())).toBe(true);
        expect(DataMatrix.areRowsEqual(row1, row2)).toBe(false);
        //expect(DataMatrix.areRowsEqual(, )).toBe();
    });

    it('orders rows for sorting', function () {
        var row1 = ["foo", 1, false];
        var row2 = ["bar", 2, false];
        var row3 = ["baz", 3, true];
        var row4 = ["baz", 2, true];

        expect(DataMatrix.compareRows(row1, row2, 1)).toBeGreaterThan(0);
        expect(DataMatrix.compareRows(row2, row1, 1)).toBeLessThan(0);
        expect(DataMatrix.compareRows(row2, row3, 1)).toBeGreaterThan(0);
        expect(DataMatrix.compareRows(row3, row1, 1)).toBeLessThan(0);
        expect(DataMatrix.compareRows(row1, row2, 0)).toBeLessThan(0);
        expect(DataMatrix.compareRows(row2, row3, 0)).toBeGreaterThan(0);
        expect(DataMatrix.compareRows(row2, row4, 1)).toEqual(0);
        expect(DataMatrix.compareRows(row3, row4, 0)).toEqual(0);
        //expect(DataMatrix.compareRows(, , )).toBe(0);
    });

    it('compares two DataMatrix objects and spits out missing and different records', function () {
        var dm1 = new DataMatrix("30225\tLA REGIONAL\t0020\t11000 GARDEN GROVE #201\tGARDEN GROVE\t92843\t33.8031\t-117.956218\t0\n30232\tN.CALIFORNIA REGIONAL\t0030\t2820 INDEPENDENCE DRIVE\tLIVERMORE\t94551\t37.701877\t-121.81038\t0\n30234\tLAS VEGAS\t0035\t222 S. MARTIN L. KING BLV\tLAS VEGAS\t89106\t36.17123\t-115.160835\t0");
        var dm2 = new DataMatrix("30225\tLA REGIONAL\t0020\t11000 GARDEN GROVE #201\tGARDEN GROVE\t92843\t33.8031\t-117.956218\t0\n30232\tNorth CALIFORNIA REGIONAL\t0030\t2820 INDEPENDENCE DRIVE\tLIVERMORE\t94551\t37.701877\t-121.81038\t1\n30237\tCANOGA PARK\t0044\t21300 Roscoe Blvd\tCanoga Park\t91304\t34.21973\t-118.59507\t0");

        expect(DataMatrix.compareMatrices(dm1, 0, dm2, 0)).toEqual({
            missingFromMatrixA : [
                [30237, "CANOGA PARK", 44, "21300 Roscoe Blvd", "Canoga Park", 91304, 34.21973, -118.59507, 0]
            ],
            missingFromMatrixB : [
                [30234, "LAS VEGAS", 35, "222 S. MARTIN L. KING BLV", "LAS VEGAS", 89106, 36.17123, -115.160835, 0]
            ],
            difference : [
                {
                    a : [30232, "N.CALIFORNIA REGIONAL", 30, "2820 INDEPENDENCE DRIVE", "LIVERMORE", 94551, 37.701877, -121.81038, 0],
                    b : [30232, "North CALIFORNIA REGIONAL", 30, "2820 INDEPENDENCE DRIVE", "LIVERMORE", 94551, 37.701877, -121.81038, 1]
                }
            ]
        });
    });
});