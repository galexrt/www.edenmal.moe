---
title: "k8s-vagrant-multi-node: The magic behind this project"
tags:
  - Vagrant
  - Kubernetes
categories:
  - Kubernetes
author: Alexander Trost
description: "In this post I'm going to write about a project I started to speed up multi-node Kubernetes dev environments. I'm going to especially explain how to simple it can be to start VirtualBox VMs in parallel."
date: 2018-06-07T13:12:27+02:00
cover: /post/covers/kubernetes-vagrant-logo.png
toc: false
---

{{< figure src="/post/covers/kubernetes-vagrant-logo.png" width="500px" title="Kubernetes and Hashicorp Vagrant Logo" >}}

The GitHub repository can be found here: [galexrt/k8s-vagrant-multi-node](https://github.com/galexrt/k8s-vagrant-multi-node).

## Intro

The Vagrant VirtualBox provider can't start VMs in parallel (`--parallel` flag for `vagrant up`).
It is possible to do so, but you need to "invest" in `Vagrantfile` and `Makefile`.

## Solution

Use `Makefile` to run `NODE=X vagrant up`, where `NODE=X` is the "number" of the node you want to be started.
To tell `Makefile` to start these "many" targets you use a "hack" like this:
```console
[...]
nodes: $(shell for i in $(shell seq 1 $(NODE_COUNT)); do echo "node-$$i"; done)

node-%:
	VAGRANT_VAGRANTFILE=Vagrantfile_nodes NODE=$* vagrant up
[...]
```
Wanting to start `10` VMs in parallel using this method would be done like this: `make -j 10 nodes NODE_COUNT=10`.

Simple but powerful.
> **NOTE** When you use this method with `Makefile` you can make a "dependency" tree using `Makefile` targets.
> Instead of relying on Vagrant.

For a full example `Makefile` and `Vagrantfile`, see the `Makefile` and `Vagrantfile_nodes` files in the [galexrt/k8s-vagrant-multi-node](https://github.com/galexrt/k8s-vagrant-multi-node) project repository.

Have Fun!
