---
layout: post
title: "Flow Matching: From an Average to a Sample"
date: 2026-10-01 00:00:00-0700
author: Donghoon Ahn
description: "An interactive explanation of why the predicted clean image is an average, and how a flow ends at one sample."
permalink: /blog/2026/flow-matching/
blog: true
tags: flow-matching diffusion visualization
categories: generative-models
related_posts: false
_styles: |
  .flow-demo-wide { width: min(1800px, calc(100vw - 40px)); position: relative; left: 50%; transform: translateX(-50%); margin: 24px 0; }
  .flow-demo-wide iframe { display: block; width: 100%; height: 900px; border: 1px solid var(--global-divider-color); border-radius: 12px; background: white; }
  .flow-demo-link { font-size: .9rem; }
  @media (max-width: 600px) { .flow-demo-wide { width: calc(100vw - 24px); } }
---

A flow-matching model predicts an average direction during training, yet its sampling trajectory can end at a sharp, individual image. We can see the distinction by showing **the current input**, **the one-step prediction**, and **the final sample** together.

Drag the orange point, move the time slider, or press **Play**. The colored strip on the left changes the initial noise. The image panel on the right shows the clean images contributing to the current prediction: many small images initially, then a smaller set of larger images, and finally one image.

<div class="flow-demo-wide">
  <iframe id="flow-matching-demo" src="{{ '/demos/flow-matching/?embed=1' | relative_url }}" title="Interactive flow matching: conditional average and final sample" loading="eager"></iframe>
</div>

<script>
(() => {
  const frame = document.getElementById('flow-matching-demo');
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow || !event.data || event.data.kind !== 'flow-demo-resize') return;
    const height = Number(event.data.height);
    if (Number.isFinite(height) && height > 100 && height < 10000) frame.style.height = Math.ceil(height + 4) + 'px';
  });
})();
</script>

<p class="flow-demo-link"><a href="{{ '/demos/flow-matching/' | relative_url }}" target="_blank" rel="noopener">Open the full demo in a separate window ↗</a></p>

## Why is the clean prediction an average?

Here, time runs from noise at $$t=0$$ to data at $$t=1$$. Training starts with independently drawn clean data $$x_1$$ and Gaussian noise $$\epsilon$$, connected by

$$
x_t=t x_1+(1-t)\epsilon.
$$

Their target velocity is $$x_1-\epsilon$$. Different training pairs can pass through the same noisy input, so squared-error regression learns their conditional average:

$$
v^*(x_t,t)=\mathbb E[x_1-\epsilon\mid x_t,t].
$$

Freezing this velocity and taking one step all the way to the clean endpoint gives

$$
\hat{x}_1=x_t+(1-t)v^*(x_t,t)=\mathbb E[x_1\mid x_t,t].
$$

That is the **red prediction**. It averages possible clean outcomes under $$p(x_1\mid x_t,t)$$. At $$t=0$$, the input contains no information about the independent clean sample, so all images contribute equally. The gray shaded connector visually expands the purple conditional distribution into the image panel.

## A prediction and a final sample are different

The **green final sample**, $$x_1$$, follows the changing velocity field. As the trajectory moves, it receives a new conditional distribution and a new average direction. The possible clean outcomes narrow, and the path eventually commits to one outcome.

Try an intermediate time: the red $$\hat{x}_1$$ can still look like a blend, while the green $$x_1$$ identifies the image at the end of that trajectory. **Play** shows how the average prediction becomes more specific as the trajectory advances. The line controls let you isolate training pairs, the mean mapping, or the red extrapolation.

## What is computed here?

The flow is solved analytically for a **one-dimensional, four-mode Gaussian mixture**. The 500 photographs—faces, cats, flowers, and cars—are a visual analogy attached to this scalar flow. Each photograph owns an equal-probability interval of the clean scalar distribution; its weight is the conditional probability integrated over that interval. The displayed RGB prediction uses the same weights to average the photographs.

This is **not exact conditioning in the full RGB image space**, and the demo does not run a trained image-generation model. Pixel-based ordering places similar photographs nearby within each class band. The photographs were generated with SDXL-Turbo, with faces, cats, and flowers aligned to make the averages readable.

Drawing Gaussian initial noise selects each photograph with probability $$1/500$$. The colored noise strip gives each photograph equal click area. Predictions change continuously as you drag; the final training image changes discretely when you cross a photo's interval boundary.

The demo runs entirely in your browser. The equations, image records, and runtime code are available in the [website repository](https://github.com/sunovivid/sunovivid.github.io/tree/master/demos/flow-matching).
