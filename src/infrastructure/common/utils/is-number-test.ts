/**
 * Проверяет, является ли значение числом или строкой, содержащей число.
 * Строки, такие как "123" или "-123.45", также будут приняты как числа.
 *
 * @param {any} value - Значение, которое нужно проверить.
 * @returns {boolean} - Возвращает true, если значение является числом или строкой, содержащей число, в противном случае false.
 *
 * @example
 * console.log(isNumberTest(123));        // true
 * console.log(isNumberTest("-123.45"));  // true
 * console.log(isNumberTest("abc"));      // false
 * console.log(isNumberTest(true));       // false
 */

export const isNumberTest = (value: any): boolean => {
	return typeof value === 'number' || /^-?\d+(\.\d+)?$/.test(value)
}
