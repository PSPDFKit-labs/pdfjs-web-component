import pdfjs from 'pdfjs-dist';

class MyPdfElement extends HTMLElement {
	readyPromise: Promise<void>
	resolveReady: () => void

	static get observedAttributes() {
		return ['pdf'];
	}

	constructor() {
		super();

		this.readyPromise = new Promise((resolve) => {
			this.resolveReady = resolve;
		});
	}

	connectedCallback() {
		this.resolveReady();

		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `
			<style>
				canvas {
					box-shadow: 0 3px 6px #0004;
					border-radius: 6px;
				}
			</style>

			<canvas></canvas>
		`
	}

	attributeChangedCallback(attr: string, oldVal: string, val: string) {
		if (attr === 'pdf' && val != null) {
			console.log(`[MyPdfElement] PDF path changed from ${oldVal} to ${val}.`);
			this.setPdf(val);
		}
	}

	async setPdf(path: string) {
		await this.readyPromise;

		console.log(`[MyPdfElement] Loading PDF at path ${path}.`);

		const pdf = await pdfjs.getDocument(path).promise;
		const page = await pdf.getPage(1);
		const viewport = page.getViewport(1);

		const canvas: HTMLCanvasElement = this.shadowRoot.querySelector('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = viewport.width;
		canvas.height = viewport.height;

		const renderCtx: pdfjs.PDFRenderParams = {
			canvasContext: ctx,
			viewport: viewport,
		};

		page.render(renderCtx);
	}
 }

customElements.define('x-pdf', MyPdfElement);
