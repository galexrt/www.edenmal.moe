---
title: 'Docker: Live restore option for containers'
author: Alexander Trost
tags:
  - Docker
description: 'New flag in Docker daemon runtime allows to keep containers running even when Docker daemon is stopped.'
date: "2016-08-29T16:09:00+02:00"
toc: false
cover: /post/covers/docker-logo-vertical.png
coverbig: false
coverwidth: 250px
---

<div style="margin:0 auto">
<blockquote class="twitter-tweet" data-conversation="none" data-lang="de"><p lang="en" dir="ltr">Docker 1.12 has a nice set of improvements that significantly improve the ability to administrate the Docker daemon. <a href="https://t.co/bXt4PwPXRr">https://t.co/bXt4PwPXRr</a></p>&mdash; Kelsey Hightower (@kelseyhightower) <a href="https://twitter.com/kelseyhightower/status/759558599177674752">31. Juli 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

On the [Docker GitHub release/changelog page of `v1.12.0`](https://github.com/docker/docker/releases/tag/v1.12.0) under the Runtime section the first point:
> Add --live-restore daemon flag to keep containers running when daemon shuts down, and regain control on startup [`#23213`](https://github.com/docker/docker/pull/23213)

This new option allows containers to keep running even when stopping, restarting or upgrading the Docker daemon.

***

**TL;DR** The `--live-restore` flag keeps containers running during a Docker daemon update.
