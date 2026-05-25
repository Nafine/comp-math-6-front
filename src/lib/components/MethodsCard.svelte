<script lang="ts">
    import { methodLabels, type MethodKey } from '$lib/types'
    import SectionRule from './SectionRule.svelte'

    interface Props {
        methodSel: Record<MethodKey, boolean>
        validationErrors: string[]
        isFormValid: boolean
        isLoading: boolean
        onSolve: () => void
    }
    let {
        methodSel = $bindable(),
        validationErrors,
        isFormValid,
        isLoading,
        onSolve,
    }: Props = $props()

    const methods: MethodKey[] = ['euler', 'rk4', 'milne']
</script>

<section>
    <SectionRule title="Методы" />

    <ul class="method-list">
        {#each methods as key (key)}
            <li>
                <label>
                    <input class="check" type="checkbox" bind:checked={methodSel[key]} />
                    <span class="name">{methodLabels[key]}</span>
                </label>
            </li>
        {/each}
    </ul>

    {#if validationErrors.length > 0}
        <ul class="err-list">
            {#each validationErrors as msg (msg)}
                <li>{msg}</li>
            {/each}
        </ul>
    {/if}

    <button class="btn" disabled={!isFormValid || isLoading} onclick={onSolve}>
        {#if isLoading}
            <span class="spinner" aria-hidden="true"></span>
            <span>Вычисление</span>
        {:else}
            <span>Решить</span>
            <span class="arrow">⟶</span>
        {/if}
    </button>
</section>

<style>
    .method-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1.1rem;
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
    }
    .method-list label {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        cursor: pointer;
    }
    .name {
        font-size: 0.92rem;
        color: var(--ink);
    }

    .err-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1.1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .err-list li {
        font-size: 0.82rem;
        color: var(--accent-deep);
        padding-left: 0.85rem;
        position: relative;
    }
    .err-list li::before {
        content: '—';
        position: absolute;
        left: 0;
        color: var(--accent);
    }

    .spinner {
        width: 10px;
        height: 10px;
        border: 1.5px solid var(--paper);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>
