<script lang="ts">
    import SectionRule from './SectionRule.svelte'

    interface Props {
        x0: number
        xn: number
        y0: number
        h: number
        epsilon: number
    }
    let {
        x0 = $bindable(),
        xn = $bindable(),
        y0 = $bindable(),
        h = $bindable(),
        epsilon = $bindable(),
    }: Props = $props()
</script>

<section>
    <SectionRule title="Параметры" />

    <div class="grid">
        <div class="field">
            <label for="x0" class="field-label">x₀</label>
            <input id="x0" type="number" step="any" bind:value={x0} />
        </div>
        <div class="field">
            <label for="xn" class="field-label">xₙ</label>
            <input id="xn" type="number" step="any" bind:value={xn} />
        </div>
        <div class="field">
            <label for="y0" class="field-label">y₀</label>
            <input id="y0" type="number" step="any" bind:value={y0} />
        </div>
        <div class="field">
            <label for="h" class="field-label">h</label>
            <input id="h" type="number" step="any" bind:value={h} />
        </div>
        <div class="field span-2">
            <label for="eps" class="field-label">ε</label>
            <input id="eps" type="number" step="any" bind:value={epsilon} />
        </div>
    </div>
</section>

<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.1rem 1.2rem;
    }
    .span-2 {
        grid-column: 1 / -1;
    }

    @media (max-width: 520px) {
        .grid {
            grid-template-columns: 1fr;
            gap: 0.9rem;
        }
    }
</style>
