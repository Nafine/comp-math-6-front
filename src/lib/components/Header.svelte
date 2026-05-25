<header class="masthead">
    <div class="meta">
        <span>Лаб.&nbsp;№6</span>
        <span class="sep">/</span>
        <span>Вариант&nbsp;3</span>
        <span class="sep">/</span>
        <span>Вычислительная математика</span>
    </div>

    <h1 class="display title">
        Численное интегрирование <em>задачи&nbsp;Коши</em>
    </h1>

    <div class="rule"></div>
</header>

<style>
    .masthead {
        padding: clamp(2rem, 5vh, 3.2rem) 0 clamp(1.5rem, 3vh, 2.2rem);
    }

    .meta {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-mute);
        display: flex;
        gap: 0.6rem;
        margin-bottom: 0.9rem;
        flex-wrap: wrap;
    }
    .sep {
        color: var(--ink-faint);
    }

    .title {
        margin: 0 0 1.2rem;
        font-size: clamp(2rem, 5vw, 3.4rem);
        font-variation-settings:
            'opsz' 72,
            'wght' 400;
        line-height: 1;
        letter-spacing: -0.025em;
    }
    .title em {
        font-style: italic;
        color: var(--ink-2);
        font-variation-settings:
            'opsz' 48,
            'wght' 360;
    }

    .rule {
        border-top: 1px solid var(--ink);
    }
</style>
