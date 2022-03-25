---
title: 'Ceph: rbd bench Commands'
description: 'Commands for running rbd bench(marks).'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2017-08-05T23:53:35+02:00"
tags:
  - Ceph
  - Benchmark
cover: /post/covers/Ceph_Logo_Stacked_RGB_120411_fa.png
---

## Intro

The reference to these commands is from [Sébastien Han Blog Post "Ceph: validate that the RBD cache is active"](https://www.sebastien-han.fr/blog/2015/09/02/ceph-validate-that-the-rbd-cache-is-active/) and the [rbd man Page](http://docs.ceph.com/docs/jewel/man/8/rbd/).
For more posts about Ceph, take a look at [Sébastien Han Blog](https://www.sebastien-han.fr/).

## Requisite - RBD image for running the Benchmarks

To be able to run a rbd benchmark, you need to create an image.
The command to create an image for this would be:

```console
$ RBD_IMAGE_NAME="bench1"
$ rbd create --size=10G $RBD_IMAGE_NAME
```

## rbd bench

### Flags

Takes normal `rbd` command flags like:

* `-p` or `--pool` for the rbd pool to use.

The following flags are for the benchmark configuration:

* `--io-type` if read or write IO should be run.
* `--io-size` how big every IO should be (in B/K/M/G/T).
* `--io-threads` how many IOs are done in parallel.
* `--io-total` how much total IO should be done.
* `--io-pattern` sequential or random IO pattern.

### Benchmarks

#### Write Benchmark

For sequential write benchmark:

```console
$ rbd -p replicapool bench $RBD_IMAGE_NAME --io-type write --io-size 8192 --io-threads 256 --io-total 10G --io-pattern seq
```

#### Read Benchmark

For sequential read benchmark:

```console
$ rbd -p replicapool bench $RBD_IMAGE_NAME --io-type read --io-size 8192 --io-threads 256 --io-total 10G --io-pattern seq
```


### Notes

* To use random IO instead of sequential IO pattern, change the `--io-pattern` flag value to `rand`.

Have Fun!
