<script lang="ts">
    import { fmtNum, fmtErr, methodColorsRaw, type ODEResult } from '$lib/types'

    interface Props {
        result: ODEResult
    }
    let { result = $bindable() }: Props = $props()

    const accent = $derived(methodColorsRaw[result.method] ?? '#6b7280')
</script>

<article class="result" class:hidden={!result.visible} style="--accent: {accent}">
    <header class="head">
        <label class="toggle">
            <input class="check" type="checkbox" bind:checked={result.visible} />
            <span class="title">{result.method}</span>
        </label>
    </header>

    <dl class="metrics">
        <div class="metric">
            <dt>шаг</dt>
            <dd class="mono">{fmtNum(result.stepUsed, 6)}</dd>
        </div>
        <div class="metric">
            <dt>max&nbsp;|Δ|</dt>
            <dd class="mono">{fmtErr(result.maxError)}</dd>
        </div>
        {#if result.refinements && result.refinements > 0}
            <div class="metric">
                <dt>уточн.</dt>
                <dd class="mono">{result.refinements}</dd>
            </div>
        {/if}
    </dl>

    {#if result.table?.length}
        <details>
            <summary>
                <span class="sum-mark">▸</span>
                <span>таблица · {result.table.length}</span>
            </summary>
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th class="num">i</th>
                            <th>xᵢ</th>
                            <th>yᵢ</th>
                            <th>y*</th>
                            <th>Δ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each result.table as row (row.i)}
                            <tr>
                                <td class="num">{row.i}</td>
                                <td>{fmtNum(row.x, 6)}</td>
                                <td>{fmtNum(row.y, 6)}</td>
                                <td>{fmtNum(row.exact, 6)}</td>
                                <td>{fmtErr(row.error)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </details>
    {/if}
</article>

<style>
    .result {
        padding: 0.9rem 0;
        border-top: 1px solid var(--rule);
        transition: opacity 200ms ease;
    }
    .result.hidden {
        opacity: 0.45;
    }

    .head {
        margin-bottom: 0.75rem;
    }
    .toggle {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        cursor: pointer;
    }
    .title {
        font-size: 0.92rem;
        font-weight: 500;
        color: var(--accent);
    }

    .metrics {
        display: flex;
        flex-wrap: wrap;
        gap: 0 1.4rem;
        margin: 0 0 0.6rem;
        padding: 0;
    }
    .metric {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }
    .metric dt {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-mute);
    }
    .metric dd {
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.88rem;
        color: var(--ink);
        line-height: 1.1;
    }

    summary {
        list-style: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.3rem 0;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.06em;
        color: var(--ink-mute);
    }
    summary::-webkit-details-marker {
        display: none;
    }
    summary:hover {
        color: var(--ink);
    }
    .sum-mark {
        transition: transform 160ms ease;
    }
    details[open] .sum-mark {
        transform: rotate(90deg);
        color: var(--accent);
    }

    .table-scroll {
        max-height: 260px;
        overflow: auto;
        margin-top: 0.4rem;
        border-top: 1px solid var(--rule);
    }
    table {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--font-mono);
        font-size: 0.74rem;
    }
    thead th {
        position: sticky;
        top: 0;
        background: var(--paper);
        color: var(--ink-mute);
        font-weight: 500;
        font-size: 0.6rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 0.4rem 0.5rem;
        text-align: right;
        border-bottom: 1px solid var(--rule);
    }
    thead th.num {
        text-align: left;
    }
    tbody td {
        padding: 0.28rem 0.5rem;
        text-align: right;
        color: var(--ink);
    }
    tbody td.num {
        text-align: left;
        color: var(--ink-mute);
    }
</style>
