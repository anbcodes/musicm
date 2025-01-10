import { afterEach, describe, expect, it, vi } from "vitest";
import { generateId, persistStorage } from "./util";

describe('generateId(n?: number)', () => {
  it('generates a random id of length 14 by default', () => {
    expect(generateId().length).toEqual(14);
  });

  it('generates a random id of length n', () => {
    expect(generateId(140).length).toEqual(140);
    expect(generateId(1).length).toEqual(1);
  });

  it('errors on negative lengths', () => {
    expect(() => generateId(-1)).toThrowErrorMatchingInlineSnapshot(`[RangeError: Len cannot be negative]`);
  });

  it('errors on zero length', () => {
    expect(() => generateId(0)).toThrowErrorMatchingInlineSnapshot(`[RangeError: Len cannot be zero]`);
  });
})

describe('persistStorage()', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  })

  it('returns true if storage can be persisted', async () => {
    vi.spyOn(navigator.storage, 'persist').mockImplementation(() => new Promise<boolean>(r => r(true)))
    expect(await persistStorage()).toEqual(true);
  })

  it('returns false if storage cannot be persisted', async () => {
    vi.spyOn(navigator.storage, 'persist').mockImplementation(() => new Promise<boolean>(r => r(false)))
    expect(await persistStorage()).toEqual(false);
  })
})
