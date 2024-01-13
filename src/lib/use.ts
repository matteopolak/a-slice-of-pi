export function viewport(node: HTMLElement) {
	const observer = new IntersectionObserver(([entry]) => {
		entry.target.dispatchEvent(new CustomEvent(entry.isIntersecting ? 'enterviewport' : 'exitviewport'));
	});

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		},
	};
}
