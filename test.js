#!/usr/bin/env node
/* HP-Style RPN Calculator - engine test harness
 *
 * The calculator ships as a single self-contained index.html, so this
 * harness extracts the RPNCalculator class straight out of that file and
 * exercises it. That keeps a single source of truth: the tests run the
 * exact engine that ships, with no separately-maintained copy to drift.
 *
 * Run:  node test.js      (exit code 0 = all passed, 1 = failure)
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---- Load the engine from index.html ----------------------------------
function loadEngine() {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const start = html.indexOf('class RPNCalculator {');
  const anchor = html.indexOf('const calc = new RPNCalculator();');
  if (start === -1 || anchor === -1 || anchor < start) {
    throw new Error('Could not locate the RPNCalculator class in index.html');
  }
  const classSource = html.slice(start, anchor);
  // Define the class in an isolated function scope and hand it back.
  return new Function(classSource + '\n return RPNCalculator;')();
}

const RPNCalculator = loadEngine();

// ---- Tiny test runner --------------------------------------------------
let pass = 0;
let fail = 0;

// Drive the engine with compact tokens. Multi-digit tokens (e.g. '200')
// are fed digit-by-digit, exactly as the on-screen keypad would.
function press(c, keys) {
  for (const k of keys) {
    if (/^[0-9]+$/.test(k)) { for (const ch of k) c.inputDigit(ch); }
    else if (k === '.') c.inputDot();
    else if (k === 'ENT') c.enter();
    else if (k === '+') c.operation('+');
    else if (k === '-') c.operation('-');
    else if (k === '*') c.operation('*');
    else if (k === '/') c.operation('/');
    else if (k === '%') c.percent();
    else if (k === 'D%') c.deltaPercent();
    else if (k === 'CHS') c.changeSign();
    else if (k === '1/x') c.reciprocal();
    else if (k === 'CLX') c.clearX();
    else if (k === 'CLEAR') c.clear();
    else if (k === 'DROP') c.drop();
    else if (k === 'SWAP') c.swap();
    else if (k === 'RUP') c.rollUp();
    else if (k === 'RDN') c.rollDown();
    else if (k === 'LASTX') c.recallLastX();
    else if (k === 'STO') c.store();
    else if (k === 'RCL') c.recall();
    else if (k === 'STO+') c.storeOp('+');
    else if (k === 'STO-') c.storeOp('-');
    else if (k === 'STO*') c.storeOp('*');
    else if (k === 'STO/') c.storeOp('/');
    else if (k === 'RCL+') c.recallOp('+');
    else if (k === 'RCL-') c.recallOp('-');
    else if (k === 'BS') c.backspace();
    else throw new Error('Unknown test token: ' + k);
  }
}

function disp(c) {
  return c.error ? 'Error' : (c.entry !== '' ? c.entry : c.formatValue(c.stack[0]));
}

function check(name, keys, expectX, expectY, mode) {
  const c = new RPNCalculator();
  c.mode = mode || 'decimal';   // tests state their own mode; default decimal for plain-number expectations
  press(c, keys);
  const x = disp(c);
  const y = c.formatValue(c.stack[1]);
  const okX = String(x) === String(expectX);
  const okY = expectY === undefined ? true : String(y) === String(expectY);
  if (okX && okY) {
    pass++;
    console.log(`  ok   ${name}`);
  } else {
    fail++;
    console.log(`  FAIL ${name}`);
    console.log(`         got  X=${x}` + (expectY !== undefined ? ` Y=${y}` : ''));
    console.log(`         want X=${expectX}` + (expectY !== undefined ? ` Y=${expectY}` : ''));
  }
}

// ---- Tests -------------------------------------------------------------
console.log('Core arithmetic:');
check('5 ENTER 3 +', ['5', 'ENT', '3', '+'], '8');
check('8 ENTER 2 /', ['8', 'ENT', '2', '/'], '4');
check('5 ENTER 3 - (y minus x)', ['5', 'ENT', '3', '-'], '2');
check('6 ENTER 7 *', ['6', 'ENT', '7', '*'], '42');
check('chain: 10 ENTER 3 - 2 *', ['10', 'ENT', '3', '-', '2', '*'], '14');

console.log('Stack lift semantics:');
check('dup: 5 ENTER ENTER +', ['5', 'ENT', 'ENT', '+'], '10', '5');
check('lift after op: 2 ENTER 3 + 4 +', ['2', 'ENT', '3', '+', '4', '+'], '9');
check('CLx disables lift: 9 ENTER CLx 5', ['9', 'ENT', 'CLX', '5'], '5', '9');
check('no leading zeros: 0 0 5', ['0', '0', '5'], '5');
check('decimal: . 5', ['.', '5'], '0.5');

console.log('HP percent (Y preserved):');
check('200 ENTER 8 %', ['200', 'ENT', '8', '%'], '16', '200');
check('price+tax: 200 ENTER 8 % +', ['200', 'ENT', '8', '%', '+'], '216');
check('%CHG: 100 ENTER 150 D%', ['100', 'ENT', '150', 'D%'], '50', '100');

console.log('Errors (Error shown, operands kept):');
check('5 ENTER 0 /', ['5', 'ENT', '0', '/'], 'Error');
check('recover: 5 ENTER 0 / CLx', ['5', 'ENT', '0', '/', 'CLX'], '0', '5');
check('0 1/x', ['0', '1/x'], 'Error');

console.log('LASTx / memory:');
check('LASTx: 5 ENTER 3 + LASTx', ['5', 'ENT', '3', '+', 'LASTX'], '3', '8');
check('STO/RCL: 7 STO CLx RCL', ['7', 'STO', 'CLX', 'RCL'], '7');
check('typed then RCL lifts: 9 STO 4 RCL', ['9', 'STO', '4', 'RCL'], '9', '4');
check('STO+: 10 STO 5 STO+ CLx RCL', ['10', 'STO', '5', 'STO+', 'CLX', 'RCL'], '15');
check('RCL+: 10 STO 5 RCL+', ['10', 'STO', '5', 'RCL+'], '15');

console.log('Backspace:');
check('1 2 3 BS', ['1', '2', '3', 'BS'], '12');
check('1 2 BS BS (empties to 0)', ['1', '2', 'BS', 'BS'], '0');
check('BS after op acts like CLx: 1 ENTER 2 ENTER 3 + BS', ['1', 'ENT', '2', 'ENT', '3', '+', 'BS'], '0', '1');

console.log('Formatting / FP noise:');
check('0.1 + 0.2', ['.', '1', 'ENT', '.', '2', '+'], '0.3');
check('1 ENTER 3 /', ['1', 'ENT', '3', '/'], '0.3333333333');
check('currency: 5 ENTER 3 +', ['5', 'ENT', '3', '+'], '8.00', undefined, 'currency');
check('currency thousands: 1234.5 (entry)', ['1234', '.', '5'], '1234.5', undefined, 'currency');

console.log('SWAP / ROLL / CHS:');
check('SWAP: 3 ENTER 7 SWAP', ['3', 'ENT', '7', 'SWAP'], '3', '7');
check('CHS entry: 5 CHS', ['5', 'CHS'], '-5');
check('CHS X: 5 ENTER CHS', ['5', 'ENT', 'CHS'], '-5');
check('ROLL down: 1 2 3 4 RDN', ['1', 'ENT', '2', 'ENT', '3', 'ENT', '4', 'RDN'], '3');

console.log(`\n==== ${pass} passed, ${fail} failed ====`);
process.exit(fail ? 1 : 0);
