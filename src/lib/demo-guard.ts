import { IS_DEMO } from '@/lib/demo-data'

// Wrap server actions that mutate. In demo, returns a benign success.
export function demoOk<T extends { ok?: true } | void>(payload?: T): { ok: true; demo: true } {
  return { ok: true, demo: true }
}

export function demoVoid(): void {
  // no-op in demo; pages refresh and will still show seeded data
}

export { IS_DEMO }
