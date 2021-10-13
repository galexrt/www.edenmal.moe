---
title: "Ancientt - Automation for Network Testing Tools"
description: "Let's see what Ancientt is and how Ancientt can help by automating certain network testing tools."
author: "Alexander Trost"
tags:
- Network
- Monitoring
- OpenSource
- Project
categories:
- Ancientt
date: 2019-10-12T13:10:52+02:00
toc: true
sitemap: true
comments: true
cover: "/post/2019/Ancientt-Automation-for-Network-Testing-Tools/Ancientt.jpg"
---

This is a [cross post](http://the-report.cloud/ancientt-automation-for-network-testing-tools) from [The Cloud Report](http://the-report.cloud/).
Be sure to checkout the [The Cloud Report](http://the-report.cloud/) website.

***

## What is Ancientt

Ancientt is a tool to automate network testing tools, like `iperf3`, in dynamic environments such as Kubernetes, Ansible and more to come dynamic environments.

Meaning that, if you want to test the network throughput with `iperf3` of your Kubernetes cluster, you can easily do that with Ancientt.
A simple "test definitions" file is used to tell Ancientt what exactly to do:

```yaml
version: '0'
runner:
  name: kubernetes
  kubernetes: {}
tests:
- name: iperf3-one-random-to-all-nodes
  type: iperf3
  outputs:
  - name: csv
    csv:
      filePath: .
      namePattern: 'ancientt-results-{{ .Data.Tester }}.csv'
  hosts:
    servers:
    - name: one-random
      random: true
      count: 1
    clients:
    - name: all-hosts
      all: true
  iperf3:
    duration: 30
```

The above "test definitions" file tells Ancinett, to use the Kubernetes "runner", to run a test from one randomly chosen Node to all the other Nodes (+ itself) in the Kubernetes cluster.
Test results are stored as CSV in files named after the given `namePattern` to make it easy to split results by "server", "client" and other available variables.

> **NOTE** It doesn't have to be a Kubernetes cluster, an OpenShift cluster works as well.

Besides being able to run on Kubernetes and OpenShift, you can also provide an Ansible inventory file which also can be used to run tests on it.
The targeted hosts need to have the network testing tools installed as of right now. An example Ansible playbook can be found here: [GitHub cloudical-io/ancientt - `examples/runners/ansible` directory](https://github.com/cloudical-io/ancientt/tree/master/examples/runners/ansible).

### Why did we create Ancientt

More and more people are moving to platforms like Kubernetes, OpenStack, OpenShift and others. The biggest problem we see in such installments is most of the time the network. Either because of performance, latency or general connectivity issues.

Ancientt right now allows us to easily run `iperf3` tests across whole Kubernetes and OpenShift clusters, and normal machines (through Ansible). Doing such tests manually takes a lot of time away from  other potentially critical points that should be investigated.
With Ancientt you can easily run such tests faster. This should save you time and the results hopefully get you faster to a resolution of the problem and / or improving your network performance.

We'll hopefully soon be able to add more network testing tools to the list, to make it even easier to run tests. E.g., `smokeping`, `siege` and others, should be able to help with latency and performance tests.

### Future of Ancientt

For the near future, we'll focus on making it possible to get the results into Prometheus. This would allow for constant network testing, monitoring and alerting on issues.
If you have a good idea on how this can be achieved, feel free to comment on [GitHub cloudical-io/ancientt - Issue 'outputs: Prometheus' #38](https://github.com/cloudical-io/ancientt/issues/38).

As written in the [Why did we create Ancientt](#why-did-we-create-ancientt) section, we'll look into adding more network testing tools.
For a list of potential new network testing tools to be worked on for Ancinett, checkout [GitHub cloudical-io/ancientt Issues with Label `testers](https://github.com/cloudical-io/ancientt/issues?q=is%3Aissue+is%3Aopen+label%3Atesters).

### Wanna try out Ancientt?

Checkout the Ancientt project on GitHub: [GitHub cloudical-io/ancientt](https://github.com/cloudical-io/ancientt/).

To get you started on the test definition options available, there is a [config examples doc page](https://github.com/cloudical-io/ancientt/blob/master/docs/config-examples.md).
If you want to dive into all available test defintion options, see [onfig structure doc page](https://github.com/cloudical-io/ancientt/blob/master/docs/config-structure.md).

All available documentation can be found in the [GitHub cloudical-io/ancientt - `/docs` directory](https://github.com/cloudical-io/ancientt/tree/master/docs).

## Summary

Ancientt can help you run `iperf3` tests, soon other network test tools as well, in a Kubernetes and OpenShift clusters, and using Ansible in an organized and quick way. Most importantly also collect the test results in an orderly fashion in output formats, like CSV, Excel, MySQL and SQLite.

Be sure to check out the project on GitHub: [GitHub cloudical-io/ancientt](https://github.com/cloudical-io/ancientt/).

We are happy about any contributions, be it documentation or code changes.

If you like the project, be sure to leave a Star to help the project reach more people.

Have Fun!
