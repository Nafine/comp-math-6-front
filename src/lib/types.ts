export interface Equation {
    id: number
    expr: string
    exactExpr: string
}

export interface Point {
    x: number
    y: number
}

export interface TableRow {
    i: number
    x: number
    y: number
    exact: number
    error: number
}

export interface ODEResult {
    method: string
    table: TableRow[]
    curve: Point[]
    stepUsed: number
    maxError: number
    refinements?: number
    note?: string
    visible?: boolean
}

export interface SolveResponse {
    equation: Equation
    exactCurve: Point[]
    results: ODEResult[]
}

export type MethodKey = 'euler' | 'rk4' | 'milne'

export const methodLabels: Record<MethodKey, string> = {
    euler: 'Метод Эйлера',
    rk4: 'Метод Рунге – Кутты 4-го порядка',
    milne: 'Метод Милна',
}

export const methodColorsRaw: Record<string, string> = {
    Euler: '#c8401f',
    'Runge-Kutta 4': '#2a4d6e',
    'Milne (predictor-corrector)': '#5c4d8e',
}

export const exactColorRaw = '#3a5d3a'

export function fmtNum(v: number, digits = 6): string {
    if (!Number.isFinite(v)) return '—'
    if (v !== 0 && (Math.abs(v) < 1e-3 || Math.abs(v) >= 1e6)) return v.toExponential(4)
    return v.toFixed(digits)
}

export function fmtErr(v: number): string {
    if (!Number.isFinite(v)) return '—'
    return v.toExponential(4)
}
