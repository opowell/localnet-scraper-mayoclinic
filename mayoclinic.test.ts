import { afterEach, describe, expect, it } from 'vitest'
import { parserLoader, resetPage, visit } from '#scraper-test'

// The parser, evaluated with the helpers it is injected with, as a scrape runs it.
const load = parserLoader(__dirname)

afterEach(resetPage)

describe('reference sites', () => {
  it('reads each part of a Mayo Clinic topic, its heading\'s lines joined', () => {
    const { parseMayoClinic } = load('mayoclinic.js', ['parseMayoClinic'])
    visit('https://www.mayoclinic.org/diseases-conditions/diabetes/symptoms-causes/syc-1', `<main><h1>Diabetes</h1>
      <div class="TopicContent"><h2>Overview</h2><p>Sugar.</p></div><div class="TopicContent"><h2>Causes</h2><p>Insulin.</p></div></main>`)
    expect(parseMayoClinic().content).toEqual(['## Overview', 'Sugar.', '## Causes', 'Insulin.'])
  })
})
