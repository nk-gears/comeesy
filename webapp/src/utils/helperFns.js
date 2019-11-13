/* -- libs -- */
import _ from 'lodash';
import jwtDecode from 'jwt-decode';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

/* ------------------------------------------------------ */
/* TOKEN VALIDATOR */
/* ------------------------------------------------------ */

/**
 * Checks user auth status
 * @param token - jwt id token
 * @returns true if valid else false
 */
export const isTokenExpired = token => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now().valueOf() / 1000;
    return decodedToken.exp < currentTime; // expired
  } catch (error) {
    console.error(error);
  }
};

/* ------------------------------------------------------ */
/* DATE FORMAT HELPERS */
/* ------------------------------------------------------ */

/**
 * Formats date to relative time strings (e.g. 3 hours ago).
 * @param {string} dateString
 * @returns The string of relative time from now.
 */
export const formatDateToRelTime = dateString => {
  if (!dateString) return null;

  dayjs.extend(relativeTime);
  return dayjs(dateString).fromNow();
};

/**
 * Formats date to [MMMM YYYY]
 * @param {string} dateString
 * @returns Formated date.
 */
export const formatToMonthYear = dateString => {
  if (!dateString) return null;
  return dayjs(dateString).format('MMMM YYYY');
};

/**
 * Formats date to [MMMM DD, YYYY]
 * @param {string} dateString
 * @returns Formated date.
 */
export const formatToMonthDayYear = dateString => {
  if (!dateString) return null;
  return dayjs(dateString).format('MMMM DD, YYYY');
};

/**
 * Formats date to [YYYY-MM-DD]
 * @param {string} dateString
 * @returns Formated date.
 */
export const formatToYearMonthDay = dateString => {
  if (!dateString) return null;
  return dayjs(dateString).format('YYYY-MM-DD');
};

/**
 * Subtracts Day or Days(number) from Today's date
 * @param {string} dateString
 * @returns Formated date.
 */
export const subtractDateFromToday = num => {
  if (!num) return null;
  return dayjs().subtract(num, 'year');
};

/* ------------------------------------------------------ */
/* OTHER HELPERS */
/* ------------------------------------------------------ */

/**
 * Checks if every value of the given object
 * is falsy value
 * @param obj - data object
 * @returns true if all else false
 */
export const hasEmptyValues = obj => _.values(obj).every(_.isEmpty);
