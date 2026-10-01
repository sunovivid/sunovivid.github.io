---
layout: default
permalink: /blog/
title: blog
nav: true
nav_order: 1
---

<div class="post">
  <div class="header-bar">
    <h1>Notes</h1>
    <h2>Interactive explanations of generative models.</h2>
  </div>
  <ul class="post-list">
    {% assign authored_posts = site.posts | where: "blog", true %}
    {% for post in authored_posts %}
    <li>
      <h3><a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p>{{ post.description }}</p>
      <p class="post-meta">{{ post.date | date: '%B %d, %Y' }}</p>
    </li>
    {% endfor %}
  </ul>
</div>
