export function findLineByLeastSquares(data: {x: number, y: number}[]): {x: number, y: number}[]{
    var x_sum = 0;
    var y_sum = 0;
    var xy_sum = 0;
    var xx_sum = 0;
    var count = 0;

    /*
     * The above is just for quick access, makes the program faster
     */
    var x = 0;
    var y = 0;
    var values_length = data.length;

    /*
     * Above and below cover edge cases
     */
    if (values_length === 0) {
        return [];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (let i = 0; i< values_length; i++) {
        x = data[i].x;
        y = data[i].y;
        x_sum+= x;
        y_sum+= y;
        xx_sum += x*x;
        xy_sum += x*y;
        count++;
    }

    /*
     * Calculate m and b for the line equation:
     * y = x * m + b
     */
    var m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
    var b = (y_sum/count) - (m*x_sum)/count;

    /*
     * We then return the x and y data points according to our fit
     */
    var result = [];

    for (let i = 0; i < values_length; i++) {
        x = data[i].x;
        y = x * m + b;
        result.push({x, y});
    }

    return result;
}