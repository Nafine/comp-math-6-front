<script lang="ts">
	import functionPlot from 'function-plot';
	import { exactColorRaw, methodColorsRaw, type ODEResult, type Point } from '$lib/types';

	interface Props {
		exactCurve: Point[] | undefined;
		results: ODEResult[];
	}
	let { exactCurve, results }: Props = $props();

	let plotContainer: HTMLDivElement | undefined = $state();

	const hasData = $derived(
		(exactCurve?.length ?? 0) > 0 || results.some((r) => r.visible && r.curve?.length)
	);

	const visibleMethods = $derived(results.filter((r) => r.visible && r.curve?.length));

	function collectSeries(): { points: [number, number][]; color: string; width: number }[] {
		const series: { points: [number, number][]; color: string; width: number }[] = [];
		if (exactCurve?.length) {
			series.push({
				points: exactCurve.map((p) => [p.x, p.y]),
				color: exactColorRaw,
				width: 2.4
			});
		}
		for (const r of results) {
			if (r.visible && r.curve?.length) {
				series.push({
					points: r.curve.map((p) => [p.x, p.y]),
					color: methodColorsRaw[r.method] ?? '#6b7280',
					width: 1.6
				});
			}
		}
		return series;
	}

	function redraw() {
		if (!plotContainer) return;
		const series = collectSeries();
		// function-plot writes its SVG directly into the container; we own the lifecycle.
		// eslint-disable-next-line svelte/no-dom-manipulating
		plotContainer.innerHTML = '';
		if (series.length === 0) return;

		const allXs: number[] = [];
		const allYs: number[] = [];
		for (const s of series) {
			for (const [x, y] of s.points) {
				if (Number.isFinite(x)) allXs.push(x);
				if (Number.isFinite(y)) allYs.push(y);
			}
		}
		const minX = Math.min(...allXs);
		const maxX = Math.max(...allXs);
		const minY = Math.min(...allYs);
		const maxY = Math.max(...allYs);
		const padX = Math.max(1e-6, (maxX - minX) * 0.05);
		const padY = Math.max(1e-6, (maxY - minY) * 0.1) || 1;

		const data = series.map((s) => ({
			points: s.points,
			fnType: 'points',
			graphType: 'polyline',
			color: s.color,
			attr: { 'stroke-width': s.width }
		}));

		try {
			functionPlot({
				target: plotContainer,
				width: plotContainer.clientWidth,
				height: 480,
				grid: true,
				xAxis: { domain: [minX - padX, maxX + padX] },
				yAxis: { domain: [minY - padY, maxY + padY] },
				data: data as never
			});
		} catch {
			/* function-plot occasionally throws on degenerate data — ignore */
		}
	}

	$effect(() => {
		if (plotContainer) {
			void exactCurve;
			void results;
			redraw();
		}
	});

	function handleResize() {
		redraw();
	}
</script>

<svelte:window onresize={handleResize} />

<div class="chart">
	{#if hasData}
		<div class="legend">
			<span class="leg">
				<span class="sq" style="background: {exactColorRaw}"></span>
				<span>точное</span>
			</span>
			{#each visibleMethods as r (r.method)}
				<span class="leg">
					<span class="sq" style="background: {methodColorsRaw[r.method] ?? '#6b7280'}"></span>
					<span>{r.method}</span>
				</span>
			{/each}
		</div>
	{/if}

	<div class="plot">
		{#if hasData}
			<div class="plot-target" bind:this={plotContainer}></div>
		{:else}
			<div class="empty">
				<p>Заполните параметры и&nbsp;нажмите <span class="cta">Решить</span></p>
			</div>
		{/if}
	</div>
</div>

<style>
	.chart {
		border: 1px solid var(--ink);
		padding: 1rem 1.1rem 0.8rem;
		background: var(--paper);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.85rem;
		padding-bottom: 0.7rem;
		border-bottom: 1px solid var(--rule);
		margin-bottom: 0.6rem;
	}
	.leg {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--ink-2);
	}
	.sq {
		width: 9px;
		height: 9px;
		flex-shrink: 0;
	}

	.plot {
		min-height: 480px;
	}

	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 480px;
		color: var(--ink-mute);
	}
	.empty p {
		margin: 0;
		font-size: 0.92rem;
	}
	.cta {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--accent);
		border-bottom: 1px solid var(--accent);
		padding-bottom: 1px;
		margin-left: 0.15rem;
	}
</style>
