---
title: 'iptables: Using statistic module'
date: "2016-09-14T15:50:49+02:00"
categories:
  - Networking
tags:
  - iptables
description: 'This post will show some examples using the iptables statistic module random mode.'
toc: true
---

## "Load Balance" with iptables between two servers

Kubernetes uses this method to load balance traffic between pods in the cluster.

The commands below create separate chains for each server and for the load balancing of port 80 in this case:

```console
iptables -t nat -N LB_PORT80
iptables -t nat -N LB_PORT80_SERVER1
iptables -t nat -A LB_PORT80 \
    -m statistic --mode random --probability 0.5000 \
    -j LB_PORT80_SERVER1
iptables -t nat -N LB_PORT80_SERVER2
iptables -t nat -A LB_PORT80 \
    -j LB_PORT80_SERVER2
iptables -t nat -A INPUT -p tcp -m tcp --dport 80 -j LB_PORT80
```

## Dropping packages with a X% probability from a specific IP address

My favorite rule to mess with people ;)

```console
iptables -A INPUT \
    -s IP_ADDRESS \
    -m statistic --mode random --probability 0.5000 \
    -j DROP
```


***

These are only two examples, but there many more possibilities to utilize the `iptables statistic` module.
