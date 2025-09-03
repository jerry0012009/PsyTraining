const RESULTS = {}
const IS_PRODUCTION = true;
const BODY = document.getElementsByTagName("body")[0];
let TIMEOUT = IS_PRODUCTION ? 1000 * 60 * 5 : 1000 * 20;
const PRACTICE_TIMEOUT = IS_PRODUCTION ? 30000 : 10000;
let max = IS_PRODUCTION ? 10 : 5;
const min = 2;