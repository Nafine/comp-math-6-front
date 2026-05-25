<script lang="ts">
    let { title }: { title: string } = $props()
</script>

<div class="section-rule">
    <span class="label">{title}</span>
    <span class="line"></span>
</div>

<style>
    .section-rule {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        margin-bottom: 1rem;
    }
    .label {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink);
        font-weight: 500;
        flex-shrink: 0;
    }
    .line {
        flex: 1;
        height: 1px;
        background: var(--ink);
    }
</style>
