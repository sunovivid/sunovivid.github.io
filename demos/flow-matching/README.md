# Interactive flow matching

Standalone demo: https://sunovivid.github.io/demos/flow-matching/

Article: https://sunovivid.github.io/blog/2026/flow-matching/

Open `index.html` through a static HTTP server. No backend, GPU, or model checkpoint is required. Use `?embed=1` for the compact embedded view. That view reports its height to its same-origin parent with a `flow-demo-resize` message.

The scalar process is an analytic four-mode GMM flow, with t=0 at Gaussian noise and t=1 at clean data. Each photograph occupies an equal-probability clean quantile interval. Photo weights integrate the scalar conditional distribution over these intervals. RGB predictions average the photographs with those weights. This is a teaching construction, not full-pixel conditional inference. The gray connector magnifies the displayed conditional-density contour; its straight edges are visual connectors, not trajectories.

The 500 images were generated using SDXL-Turbo, and faces/cats/flowers were registered. Prompts, seeds, model identifiers and ordering information are in `photo-bank.json`. Runtime equations, photo weights and image integration are readable in `flow-math.js`, `scalar-cloud.js`, and `image-flow-worker.js`. KaTeX is redistributed with its license in `assets/katex/LICENSE`.
