/**
 * Very simple primal simplex tableau resolution.
 *
 * @param tableauParam: initial tableau as defined in the documentation.
 * @param rowsParam: number of rows of the tableau.
 * @param columnsParam: number of columns of the tableau.
 * @param initialBaseParam: base columns indexes.
 * @constructor
 */
function PrimalSimplex(tableauParam, rowsParam, columnsParam, initialBaseParam) {

    // private variables
    var tableau = tableauParam;
    var rows = rowsParam;
    var columns = columnsParam;
    // useful for the anticycling rule
    var initialBase = initialBaseParam.slice();
    var basicSolution = initialBaseParam.slice();
    var that = this;

    var ROW_0 = 0;
    var COL_RHS = columns - 1;

    // private methods
    function columnSelection() {

        var maxValue = tableau[ROW_0][0];
        var index = 0;

        for (var j = 1; j < columns - 1; j++) {
            if (tableau[ROW_0][j] > maxValue) {
                maxValue = tableau[ROW_0][j];
                index = j;
            }
        }

        return index;

    };

    function rowSelection(pivotColumn) {

        var minRatio = Number.POSITIVE_INFINITY;
        var rowIndex = -1;

        var zeroRatioIndexes = [];

        for (var i = 1; i < rows; i++) {

            if (tableau[i][pivotColumn] > 0) {

                var ratio = tableau[i][COL_RHS] / tableau[i][pivotColumn];

                if (ratio < minRatio) {
                    minRatio = ratio;
                    rowIndex = i;
                }

                if (ratio == 0) {
                    zeroRatioIndexes.push(i);
                }

            }
        }


        if (zeroRatioIndexes.length > 1) {
            rowIndex = antiCyclingRowSelection(pivotColumn, zeroRatioIndexes);
        }

        return rowIndex;

    }

    function antiCyclingRowSelection(pivotColumn, equalRatioIndexes) {

        var rowIndex;

        var baseIndex = 0;
        while (equalRatioIndexes.length > 1) {

            var minRatio = Number.POSITIVE_INFINITY;
            rowIndex = -1;
            var tempEqualRatioIndexes = [];

            // for each column of the initial base
            var c = initialBase[baseIndex];
            baseIndex++;

            for (var j = 0; j < equalRatioIndexes.length; j++) {

                // retrieve the zeroValue-row
                var r = equalRatioIndexes[j];

                var ratio = tableau[r][c] / tableau[r][pivotColumn];

                if (ratio < minRatio) {
                    minRatio = ratio;
                    rowIndex = r;
                    tempEqualRatioIndexes = [];
                } else if (ratio == minRatio) {
                    tempEqualRatioIndexes.push(j);
                    // remember to push rowIndex at the end
                }

            }
            tempEqualRatioIndexes.push(rowIndex);

            equalRatioIndexes = tempEqualRatioIndexes.slice();

        }

        return rowIndex;

    }

    function pivoting(pivotRow, pivotColumn) {

        var i, j;
        // cause the pivot row to have a 1 in pivotColumn

        var div = tableau[pivotRow][pivotColumn];

        for (j = 0; j < columns; j++) {
            tableau[pivotRow][j] /= div;
        }

        // zero-fy all the column exception pivotRow
        for (i = 0; i < rows; i++) {
            if (i == pivotRow) {
                continue;
            }

            var factor = -tableau[i][pivotColumn];

            for (j = 0; j < columns; j++) {

                tableau[i][j] += tableau[pivotRow][j] * factor;

            }
        }

    }

    function composeSolution(tableau, basicSolution) {

        var x = new Array(columns-1);

        for (var i = 0; i < columns-1; i++) {
            x[i] = 0;
        }

        for(var j=0;j<basicSolution.length; j++){
            x[basicSolution[j]] = tableau[j+1][COL_RHS];
        }

        return x;

    }

    // public methods
    this.solve = function () {

        var optimal = false;
        var unbounded = false;

        while (!optimal && !unbounded) {

            optimal = that.isOptimal();

            if (!optimal) {

                var pivotColumn = columnSelection(tableau, columns);
                var pivotRow = rowSelection(pivotColumn);

                basicSolution[pivotRow - 1] = pivotColumn;

                if (pivotRow == -1) {
                    unbounded = true;
                    continue;
                }

                pivoting(pivotRow, pivotColumn);


            }


        }


        return {
            "optimal": optimal,
            "unbounded": unbounded,
            "z": tableau[0][columns - 1],
            "tableau": tableau,
            "rows": rows,
            "columns": columns,
            "baseColumns": basicSolution,
            "x": composeSolution(tableau, basicSolution)
    }


    };

    this.isOptimal = function () {

        var countRow0 = 0;

        // check zj-cj <= 0 in row0
        for (var j = 0; j < COL_RHS; j++) {
            if (tableau[ROW_0][j] <= 0) {
                countRow0++;
            }
        }

        return countRow0 == COL_RHS;

    };


}
