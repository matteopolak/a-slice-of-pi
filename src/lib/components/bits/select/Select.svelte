<script lang="ts">
	import type { ComponentType, SvelteComponent } from 'svelte';
	import { Select, type Selected } from 'bits-ui';
	import { flyAndScale } from '$lib/utils';

	import Check from '~icons/ic/baseline-check';

	type T = $$Generic;

	export let selected: Selected<T>[];

	export let icon: ComponentType<SvelteComponent<{ class?: string | null }>>;
	export let options: Selected<T>[] = [];
	export let placeholder: string;
</script>

<Select.Root items={options} multiple bind:selected>
	<Select.Trigger
		class="inline-flex h-input w-[296px] items-center rounded-9px border border-border-input bg-background px-[11px] text-sm transition-colors placeholder:text-foreground-alt/50  focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
		aria-label={placeholder}
	>
		<svelte:component this={icon} class="mr-[9px] text-muted-foreground sq-6" />

		<Select.Value class="text-sm" {placeholder} />

		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			fill="currentColor"
			viewBox="0 0 256 256"
			class="ml-auto text-muted-foreground sq-6"
		>
			<rect width="256" height="256" fill="none"> </rect>
			<path
				d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"
			>
			</path>
		</svg>
	</Select.Trigger>
	<Select.Content
		class="w-full rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
		transition={flyAndScale}
		sideOffset={8}
	>
		{#each options as option}
			<Select.Item
				class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				value={option.value}
				label={option.label}
			>
				{option.label}
				<Select.ItemIndicator class="ml-auto" asChild={false}>
					<Check />
				</Select.ItemIndicator>
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
