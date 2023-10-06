/**
 * Sums-up all the numbers in the array
 * @param params
 * @returns
 */
export const sum = (params: number[]) => {
  if (!params || params?.length < 2) throw Error("Please provide, at least, 2 numbers to summed-up");

  return params?.reduce((acc, cur) => {
    acc += cur;
    return acc;
  }, 0);
};

/**
 * Subtract each number in params from param1
 * @param param1
 * @param params
 * @returns
 */
export const subtract = (param1: number, params: number[]) => {
  if (!params || params?.length < 1) throw Error("Please provide the numbers to subtract");

  return params?.reduce((acc, cur) => {
    acc -= cur;
    return acc;
  }, param1);
};

/**
 * Multiplies each number in the array
 * @param param1
 * @param params
 * @returns
 */
export const multiply = (params: number[]) => {
  if (!params || params?.length < 2) throw Error("Please provide, at least, 2 numbers to be multiplied");

  return params?.reduce((acc, cur) => {
    acc *= cur;
    return acc;
  }, 1);
};

/**
 * Recursively divided param1 by each number in params
 * @param param1
 * @param params
 * @returns
 */
export const divide = (param1: number, params: number[]) => {
  if (!params || params?.length < 1) throw Error("Please provide the numbers to divide by");
  let dividedByZero = false;

  const result = params?.reduce((acc, cur) => {
    if (cur == 0) {
      dividedByZero = true;
      return acc;
    }

    acc /= cur;
    return acc;
  }, param1);

  if (dividedByZero) throw Error("Divide by zero is not allowed.");

  return result;
};
