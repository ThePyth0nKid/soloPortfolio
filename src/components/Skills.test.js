/**
 * Lightweight unit tests for the Skills component's pure logic.
 *
 * This repo has no test runner configured, so these tests are written as
 * a zero-dependency script that can be executed with `node
 * src/components/Skills.test.js` if/when a runner is added, or adapted to
 * Vitest/Jest trivially (the `test`/`assertEqual` helpers mirror those
 * APIs).
 */

import { __testing__ } from './Skills.jsx'

const { SKILLS, clamp, MAX_LEVEL } = __testing__

let failures = 0

/**
 * @param {string} name
 * @param {() => void} fn
 */
function test(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
  } catch (err) {
    failures += 1
    console.error(`  ✗ ${name}`)
    console.error(err)
  }
}

/**
 * @param {unknown} actual
 * @param {unknown} expected
 * @param {string} [msg]
 */
function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(
      `${msg ?? 'assertEqual failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    )
  }
}

/**
 * @param {boolean} cond
 * @param {string} msg
 */
function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

console.log('Skills — data')
test('has between 6 and 8 skills (issue requirement)', () => {
  assert(SKILLS.length >= 6 && SKILLS.length <= 8, `got ${SKILLS.length}`)
})
test('includes React, TypeScript, and Node', () => {
  const names = SKILLS.map((s) => s.name)
  assert(names.includes('React'), 'missing React')
  assert(names.includes('TypeScript'), 'missing TypeScript')
  assert(
    names.some((n) => n.toLowerCase().startsWith('node')),
    'missing Node',
  )
})
test('every skill has name, icon, and valid level', () => {
  for (const s of SKILLS) {
    assert(typeof s.name === 'string' && s.name.length > 0, 'bad name')
    assert(typeof s.icon === 'string' && s.icon.length > 0, `bad icon for ${s.name}`)
    assert(
      typeof s.level === 'number' && s.level >= 0 && s.level <= MAX_LEVEL,
      `bad level for ${s.name}: ${s.level}`,
    )
  }
})
test('skill names are unique', () => {
  const names = SKILLS.map((s) => s.name)
  assertEqual(new Set(names).size, names.length, 'duplicate skill name')
})

console.log('Skills — clamp()')
test('returns value when in range', () => {
  assertEqual(clamp(50, 0, 100), 50)
})
test('clamps below minimum', () => {
  assertEqual(clamp(-10, 0, 100), 0)
})
test('clamps above maximum', () => {
  assertEqual(clamp(150, 0, 100), 100)
})
test('respects inclusive bounds', () => {
  assertEqual(clamp(0, 0, 100), 0)
  assertEqual(clamp(100, 0, 100), 100)
})
test('throws on NaN', () => {
  let threw = false
  try {
    clamp(Number.NaN, 0, 100)
  } catch {
    threw = true
  }
  assert(threw, 'clamp(NaN) should throw')
})

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`)
  if (typeof process !== 'undefined') process.exit(1)
} else {
  console.log('\nAll Skills tests passed.')
}
