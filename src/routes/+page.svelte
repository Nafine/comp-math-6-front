<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import EquationCard from '$lib/components/EquationCard.svelte';
	import ParametersCard from '$lib/components/ParametersCard.svelte';
	import MethodsCard from '$lib/components/MethodsCard.svelte';
	import ResultCard from '$lib/components/ResultCard.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import type { Equation, MethodKey, ODEResult, SolveResponse } from '$lib/types';

	let equations = $state<Equation[]>([]);
	let equationsError = $state<string | null>(null);

	let equationId = $state<number>(1);
	let x0 = $state<number>(0);
	let xn = $state<number>(1);
	let y0 = $state<number>(1);
	let h = $state<number>(0.1);
	let epsilon = $state<number>(0.001);
	let methodSel = $state<Record<MethodKey, boolean>>({
		euler: true,
		rk4: true,
		milne: true
	});

	let response = $state<SolveResponse | null>(null);
	let results = $state<ODEResult[]>([]);
	let isLoading = $state<boolean>(false);
	let serverError = $state<string | null>(null);

	const selectedEquation = $derived(equations.find((e) => e.id === equationId) ?? null);

	const validationErrors = $derived.by(() => {
		const errs: string[] = [];
		if (!selectedEquation) errs.push('Выберите уравнение');
		if (!Number.isFinite(x0) || !Number.isFinite(xn)) errs.push('x₀ и xₙ должны быть числами');
		else if (!(x0 < xn)) errs.push('Должно выполняться x₀ < xₙ');
		if (!Number.isFinite(y0)) errs.push('y₀ должно быть числом');
		if (!Number.isFinite(h) || !(h > 0)) errs.push('Шаг h должен быть положительным числом');
		else if (Number.isFinite(x0) && Number.isFinite(xn) && x0 < xn) {
			const n = (xn - x0) / h;
			if (n < 1) errs.push('Шаг h не может превышать длину отрезка (xₙ − x₀)');
			if (n > 100000) errs.push('Слишком много узлов; увеличьте h или уменьшите интервал');
		}
		if (!Number.isFinite(epsilon) || !(epsilon > 0))
			errs.push('Точность ε должна быть положительным числом');
		if (!methodSel.euler && !methodSel.rk4 && !methodSel.milne)
			errs.push('Выберите хотя бы один метод');
		return errs;
	});

	const isFormValid = $derived(validationErrors.length === 0);

	onMount(async () => {
		try {
			const res = await fetch('/api/equations');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			equations = await res.json();
			if (equations.length > 0 && !equations.some((e) => e.id === equationId)) {
				equationId = equations[0].id;
			}
		} catch (err) {
			equationsError = err instanceof Error ? err.message : 'Не удалось загрузить каталог';
		}
	});

	async function handleSubmit() {
		if (!isFormValid) return;
		isLoading = true;
		serverError = null;
		try {
			const methods: MethodKey[] = (Object.keys(methodSel) as MethodKey[]).filter(
				(k) => methodSel[k]
			);
			const res = await fetch('/api/solve', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ equationId, x0, xn, y0, h, epsilon, methods })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
			const parsed = data as SolveResponse;
			response = parsed;
			results = parsed.results.map((r) => ({ ...r, visible: true }));
		} catch (err) {
			serverError = err instanceof Error ? err.message : 'Ошибка соединения';
			response = null;
			results = [];
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="page">
	<Header />

	<div class="layout">
		<aside class="col col-left">
			<EquationCard {equations} {equationsError} bind:equationId {selectedEquation} />
			<ParametersCard bind:x0 bind:xn bind:y0 bind:h bind:epsilon />
		</aside>

		<main class="col col-center">
			<div class="sticky">
				<Chart exactCurve={response?.exactCurve} {results} />
			</div>
		</main>

		<aside class="col col-right">
			<MethodsCard
				bind:methodSel
				{validationErrors}
				{isFormValid}
				{isLoading}
				onSolve={handleSubmit}
			/>

			{#if serverError}
				<div class="server-error">
					<span class="err-badge">сервер</span>
					<code>{serverError}</code>
				</div>
			{/if}

			{#if results.length > 0}
				<section class="results">
					<div class="results-head">
						<span class="caption">Результаты</span>
					</div>
					<div class="results-stack">
						{#each results as result, i (result.method)}
							<ResultCard bind:result={results[i]} />
						{/each}
					</div>
				</section>
			{/if}
		</aside>
	</div>

	<Footer />
</div>

<style>
	.page {
		max-width: 1480px;
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 3vw, 2.5rem);
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 300px) minmax(0, 1fr) minmax(0, 340px);
		gap: clamp(1.25rem, 2.5vw, 2.5rem);
		align-items: start;
	}

	.col {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.sticky {
		position: sticky;
		top: 1.25rem;
	}

	.server-error {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.7rem 0.85rem;
		border: 1px solid var(--accent);
		background: rgba(200, 64, 31, 0.05);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--accent-deep);
	}
	.err-badge {
		background: var(--accent);
		color: var(--paper);
		font-size: 0.6rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		padding: 0.12rem 0.4rem;
	}
	.server-error code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		word-break: break-word;
	}

	.results {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}
	.results-head {
		border-top: 1px solid var(--ink);
		padding-top: 0.5rem;
	}
	.results-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 1180px) {
		.layout {
			grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
		}
		.col-right {
			grid-column: 1 / -1;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 1.5rem;
		}
		.col-right > * {
			flex: 1 1 320px;
		}
	}

	@media (max-width: 760px) {
		.layout {
			grid-template-columns: 1fr;
		}
		.sticky {
			position: static;
		}
		.col-center {
			order: -1;
		}
		.col-right {
			flex-direction: column;
		}
	}
</style>
