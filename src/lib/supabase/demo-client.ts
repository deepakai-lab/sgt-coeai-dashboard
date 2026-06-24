// Fake Supabase client for DEMO_MODE — no network calls, no auth, no DB.
// Only mocks the surface area actually used by the dashboard / public pages.
import { DEMO_TABLES, DEMO_PROFILES, DEMO_USER } from '@/lib/demo-data'

type Row = Record<string, any>

// Resolve a `select` string like 'id, title, owner:profiles!projects_owner_id_fkey(full_name)'
// into a list of column requests + foreign-key joins. We hydrate joins by looking up profiles by id.
function applyJoins(rows: Row[], selectStr: string, tableName: string): Row[] {
  // Pull out join expressions like: ALIAS:profiles!fk(field1, field2)  or  ALIAS:projects(field1)
  const joinRe = /(\w+):(\w+)(?:![\w_]+)?\(([^)]+)\)/g
  const joins: { alias: string; targetTable: string; cols: string[]; fkCandidates: string[] }[] = []
  let m
  while ((m = joinRe.exec(selectStr))) {
    const [, alias, targetTable, colsStr] = m
    // FK candidates: row.<alias>_id, row.<alias_singular>_id, fall back by table name
    const fkCandidates = [
      `${alias}_id`,
      `${alias.replace(/s$/, '')}_id`,
      `${targetTable.replace(/s$/, '')}_id`,
      `${alias === 'owner' || alias === 'creator' || alias === 'assignee' || alias === 'uploader' || alias === 'prep' || alias === 'rev' ? alias + '_id' : ''}`,
      'owner_id', 'created_by', 'assigned_to', 'uploaded_by', 'prepared_by', 'reviewed_by', 'project_id'
    ].filter(Boolean)
    joins.push({ alias, targetTable, cols: colsStr.split(',').map(s => s.trim()), fkCandidates })
  }

  if (joins.length === 0) return rows

  return rows.map(r => {
    const out = { ...r }
    for (const j of joins) {
      const lookupTable = DEMO_TABLES[j.targetTable] ?? []
      // Heuristic: pick the right FK based on alias semantics
      const aliasToFk: Record<string, string> = {
        owner: 'owner_id', creator: 'created_by', assignee: 'assigned_to',
        uploader: 'uploaded_by', prep: 'prepared_by', rev: 'reviewed_by',
        project: 'project_id', meeting: 'meeting_id'
      }
      const fk = aliasToFk[j.alias] ?? j.fkCandidates.find(c => c in r) ?? ''
      const fkValue = fk ? r[fk] : null
      const match = fkValue ? lookupTable.find(x => x.id === fkValue) : null
      if (match) {
        const projected: Row = {}
        for (const c of j.cols) projected[c] = match[c]
        out[j.alias] = projected
      } else {
        out[j.alias] = null
      }
    }
    return out
  })
}

class FakeQuery implements PromiseLike<{ data: any; error: any; count?: number }> {
  private rows: Row[]
  private predicates: Array<(r: Row) => boolean> = []
  private orderField: string | null = null
  private orderAsc = true
  private limitN: number | null = null
  private rangeFrom: number | null = null
  private rangeTo: number | null = null
  private selectStr = '*'
  private wantSingle = false
  private wantMaybe = false
  private countMode: 'exact' | 'planned' | 'estimated' | null = null
  private headOnly = false
  private opKind: 'select' | 'insert' | 'update' | 'delete' = 'select'
  private mutatePayload: Row | Row[] | null = null
  private tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
    this.rows = [...(DEMO_TABLES[tableName] ?? [])]
  }

  select(cols: string = '*', opts?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) {
    this.selectStr = cols
    if (opts?.count) this.countMode = opts.count
    if (opts?.head) this.headOnly = true
    return this
  }
  eq(field: string, value: any) { this.predicates.push(r => r[field] === value); return this }
  neq(field: string, value: any) { this.predicates.push(r => r[field] !== value); return this }
  is(field: string, value: any) { this.predicates.push(r => r[field] === value); return this }
  not(field: string, _op: string, value: any) { this.predicates.push(r => r[field] !== value); return this }
  in(field: string, values: any[]) { this.predicates.push(r => values.includes(r[field])); return this }
  ilike(field: string, pattern: string) {
    const p = pattern.replace(/%/g, '').toLowerCase()
    this.predicates.push(r => String(r[field] ?? '').toLowerCase().includes(p))
    return this
  }
  like(field: string, pattern: string) { return this.ilike(field, pattern) }
  gte(field: string, value: any) { this.predicates.push(r => r[field] >= value); return this }
  lte(field: string, value: any) { this.predicates.push(r => r[field] <= value); return this }
  order(field: string, opts?: { ascending?: boolean; nullsFirst?: boolean }) {
    this.orderField = field
    this.orderAsc = opts?.ascending ?? true
    return this
  }
  limit(n: number) { this.limitN = n; return this }
  range(from: number, to: number) { this.rangeFrom = from; this.rangeTo = to; return this }
  single() { this.wantSingle = true; return this }
  maybeSingle() { this.wantMaybe = true; return this }

  insert(payload: Row | Row[]) { this.opKind = 'insert'; this.mutatePayload = payload; return this }
  update(payload: Row) { this.opKind = 'update'; this.mutatePayload = payload; return this }
  delete() { this.opKind = 'delete'; return this }

  private resolve() {
    // Mutations short-circuit with a friendly error so server actions can show "Demo mode" toast
    if (this.opKind !== 'select') {
      if (this.wantSingle || this.wantMaybe) {
        return { data: null, error: { message: 'Demo mode — changes are not persisted. Connect Supabase to enable writes.' } }
      }
      return { data: null, error: { message: 'Demo mode — changes are not persisted.' } }
    }

    let result = this.rows.filter(r => this.predicates.every(p => p(r)))
    if (this.orderField) {
      const f = this.orderField, asc = this.orderAsc
      result = [...result].sort((a, b) => {
        const av = a[f], bv = b[f]
        if (av == bv) return 0
        if (av == null) return 1
        if (bv == null) return -1
        return (av < bv ? -1 : 1) * (asc ? 1 : -1)
      })
    }
    const totalCount = result.length
    if (this.limitN != null) result = result.slice(0, this.limitN)
    if (this.rangeFrom != null && this.rangeTo != null) result = result.slice(this.rangeFrom, this.rangeTo + 1)
    result = applyJoins(result, this.selectStr, this.tableName)

    if (this.countMode) {
      return { data: this.headOnly ? null : result, error: null, count: totalCount }
    }
    if (this.wantSingle) {
      return { data: result[0] ?? null, error: result[0] ? null : { message: 'No rows', code: 'PGRST116' } }
    }
    if (this.wantMaybe) {
      return { data: result[0] ?? null, error: null }
    }
    return { data: result, error: null }
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any; count?: number }) => TResult1 | PromiseLike<TResult1>) | null,
    _onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    const res = this.resolve()
    return Promise.resolve(onfulfilled ? onfulfilled(res) : (res as any))
  }
}

const fakeAuth = {
  getUser: async () => ({
    data: { user: { id: DEMO_USER.id, email: DEMO_USER.email, user_metadata: { full_name: DEMO_USER.full_name } } as any },
    error: null
  }),
  getSession: async () => ({
    data: { session: { user: { id: DEMO_USER.id, email: DEMO_USER.email } } as any },
    error: null
  }),
  signOut: async () => ({ error: null }),
  signInWithOAuth: async (_opts: any) => {
    if (typeof window !== 'undefined') window.location.href = '/dashboard'
    return { data: {}, error: null }
  },
  exchangeCodeForSession: async () => ({ data: { user: { id: DEMO_USER.id, email: DEMO_USER.email } as any }, error: null })
}

const fakeStorage = {
  from: (_bucket: string) => ({
    upload: async (_path: string, _file: any) => ({ data: { path: 'demo' }, error: null }),
    getPublicUrl: (_path: string) => ({ data: { publicUrl: 'https://placehold.co/600x400/8b5cf6/white?text=Demo+File' } }),
    createSignedUrl: async (_path: string, _exp: number) => ({
      data: { signedUrl: 'https://placehold.co/600x400/8b5cf6/white?text=Demo+File' },
      error: null
    })
  })
}

export function createDemoClient(): any {
  return {
    from: (table: string) => new FakeQuery(table),
    auth: fakeAuth,
    storage: fakeStorage
  }
}
