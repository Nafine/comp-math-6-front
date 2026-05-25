<script lang="ts">
    import type { Equation } from '$lib/types'
    import SectionRule from './SectionRule.svelte'

    interface Props {
        equations: Equation[]
        equationsError: string | null
        equationId: number
        selectedEquation: Equation | null
    }
    let {
        equations,
        equationsError,
        equationId = $bindable(),
        selectedEquation,
    }: Props = $props()
</script>

<section>
    <SectionRule title="Уравнение" />

    {#if equationsError}
        <div class="alert">
            <span class="badge-warn">ошибка</span>
            <code>{equationsError}</code>
        </div>
    {:else if equations.length === 0}
        <div class="loading">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    {:else}
        <div class="field">
            <select id="eq" bind:value={equationId} aria-label="Уравнение">
                {#each equations as eq (eq.id)}
                    <option value={eq.id}>{eq.expr}</option>
                {/each}
            </select>
        </div>

        {#if selectedEquation}
            <div class="exact">
                <span class="caption">Точное решение</span>
                <code>{selectedEquation.exactExpr}</code>
            </div>
        {/if}
    {/if}
</section>

<style>
    .alert {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0;
        font-size: 0.82rem;
        color: var(--accent-deep);
    }
    .badge-warn {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        background: var(--accent);
        color: var(--paper);
        padding: 0.12rem 0.4rem;
    }
    .alert code {
        font-family: var(--font-mono);
        font-size: 0.8rem;
    }

    .loading {
        display: flex;
        gap: 0.35rem;
        padding: 0.4rem 0;
    }
    .loading .dot {
        width: 4px;
        height: 4px;
        background: var(--ink-mute);
        border-radius: 50%;
        animation: pulse 1.2s infinite ease-in-out;
    }
    .loading .dot:nth-child(2) {
        animation-delay: 0.15s;
    }
    .loading .dot:nth-child(3) {
        animation-delay: 0.3s;
    }
    @keyframes pulse {
        0%, 80%, 100% { opacity: 0.3; }
        40% { opacity: 1; }
    }

    .exact {
        margin-top: 0.9rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .exact code {
        font-family: var(--font-mono);
        font-size: 0.88rem;
        color: var(--ink);
        word-break: break-word;
    }
</style>
