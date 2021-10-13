---
title: Container Days 2017 Hamburg
description: 'Some thoughts, notes, comments and pictures from the Container Days 2017 in Hamburg.'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2017-06-20T11:23:08+02:00"
tags:
  - ContainerDays
  - Container
  - Docker
  - Kubernetes
categories:
  - Conferences
cover: /post/2017/Container-Days-2017-Hamburg/cds2017-photo1.png
---

## Thanks!

A huge thanks and shoutout to [Max Inden @mxinden](https://github.com/mxinden) for having some time for a very interesting talk.

**BTW** Checkout [CoreOS](https://coreos.com/)'s awesome Kubernetes [prometheus-operator](https://github.com/coreos/prometheus-operator) project. It is awesome for easily running Prometheus + Alertmanager in Kubernetes.

***

## Day #1

Let's see what nice things the day will bring. I hope I'll learn something new about containers and Kubernetes, and hopefully meet some new people. :-)

### Presentation: "A DevOps State of Mind: Continuous Security for Containers with Kubernetes"

The presentation of [Chris van Tuin](https://twitter.com/chrisvantuin) from [Red Hat](https://www.redhat.com/en) was very interesting for me. I'm going to attach a small diagram of what I have taken from it.

{{< figure src="cds2017-photo0.png" width="100%" title="My own diagram of what I think was the message of [Chris van Tuin](https://twitter.com/chrisvantuin) from [Red Hat](https://www.redhat.com/en) with his presentation." >}}

{{< figure src="cds2017-photo1.png" width="100%" title="Quick photo of the crowd and one of the slides of the presentation." >}}

For me what counted here, was the message (see the diagram above) I got from the presentation. Interesting isn't only to write, but also to discuss about it at the conference.

***

### Presentation: "Deploy a resilient E-commerce platform using latest docker tools"

Next presentation I went to was "Deploy a resilient E-commerce platform using latest docker tools" of [Rachid Zarouali](https://github.com/xinity) from [SYNOLIA](https://www.synolia.com/).
He gave some interesting insights in their E-commerce platform, in which they weren't "simply" using Kubernetes. As the title from the presentation suggets, the tools used by them are mostly official Docker tools/projects, but also some other open source projects too.

**For Kubernetes users**: Just keep on using Kubernetes ;)

Overall a well made presentation, as written with good insights into the tooling used. Should be interesting for everyone that has to decide between Kubernetes and Docker Swarm.

***

### Lunch Time

I'll just point you to my Tweet for a "proper" response to that:
<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/mesosphere">@mesosphere</a> <a href="https://twitter.com/ConDaysEU">@ConDaysEU</a> Your &quot;cloud&quot; burgers are delicious! <a href="https://twitter.com/hashtag/CDS17?src=hash">#CDS17</a> <a href="https://t.co/g1cpkd81rN">pic.twitter.com/g1cpkd81rN</a></p>&mdash; galexrt (@galexrt) <a href="https://twitter.com/galexrt/status/877127039479926784">June 20, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

To summarize it, the pulled pork burger I had was delicious! Good on the [Big Ben Burger Truck Hamburg](http://bigbenburgertruck.de/) guys for that.

***

### Workshop: "Kubernetes Anywhere, Production Ready with Prometheus"

The workshop was held by [Max Inden @mxinden](https://github.com/mxinden) and [Alex Somesan](https://github.com/alexsomesan).
I couldn't really create my own cluster on AWS for testing, as my AWS account gave me some trouble to first sort out.

It is very interesting to see [Tectonic](https://coreos.com/tectonic/) create the cluster with such simplicity. As I already worked with the prometheus-operator there wasn't that much new I could learn about, but at least I could collect some more experience on how to better create/use the prometheus-operator `ServiceMonitor`s.
The approach for using `ServiceMonitor`s the "best" way, is to create the least `ServiceMonitor`s for the most `Service`s you want to monitor.

**About Tectonic**: It looks, as already written earlier, like an awesome tool for deploying Kubernetes on AWS and Bare Metal. But keep in mind, I could only try it out on AWS, but will definetly try it when I have the time to deploy Kubernets with [Tectonic](https://coreos.com/tectonic/) + [Matchbox](https://coreos.com/matchbox/) on bare-metal.

From the workshop I "rediscovered" the usage of `kubectl`s subcommand `port-forward`. You should definetly use it, instead of for example using the Kubernetes api directly as a (HTTP) proxy.
As I normally used the API proxy to access services, here the usage of the command:
```console
$ kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [options]
```

So all in all, the workshop was well done and brought some insights into using [CoreOS](https://coreos.com/) [Tectonic](https://coreos.com/tectonic/) software/tool.

> **NOTE** For people wanting to try out the workshop of [Max Inden](https://github.com/mxinden), the workshop github repo with all the information is located here: [mxinden/k8s-anywhere-workshop](https://github.com/mxinden/k8s-anywhere-workshop).

### Presentation: "Automating Kubernetes Cluster Operations with Operators"

Or "Running Kubernetes in Kubernetes".
This presentation was held by Timo Derstappen from [Giant Swarm](https://giantswarm.io/).

> **GLOSSAR**
>
* _Giantnetes_ - The "master" Kubernetes instance, in which the other Kubernetes clusters are started/run.

Use operators to run **operational** tasks from within the cluster.

> **NOTE**
>
> Kubernetes renames `Third Party Resources` to `Custom Resource Definitions` soon.

**OUTLOOK**: Using operators you can automate "everything" for and around the cluster.

> **EXAMPLES** Operator examples from presenter:
>
* `cert-operator` - Creates certificates for the ingresses, etc.
* `kvm-operator` - To spin up new KVM instances for the cluster(s).
* `flannel-operator` - Configures networks for Kubernetes clusters that run inside the Giantnetes.
* `dns-operator` - For external DNS provisioning.
* And so on..

They also created a library/boilerplate for simple creation of Kubernetes operators.
The library is named `operatorkit` and written in Golang. The GitHub repo can be found here: [giantswarm/operatorkit](https://github.com/giantswarm/operatorkit).

> **NOTE** They built a nice game, where you shoot Kubernetes pods.
> Seperate note originally taken from the presenter: "We are hiring!"

### End of the first day

I try to summarize the day for today in a simple manner: "Kubernetes, Security, Deploying, Automation and Beer!".
Extensive talks about using Kubernetes operators (aka `Third Party Resources`s) to automate tasks, using [Tectonic](https://coreos.com/tectonic/) to create Kubernetes clusters and especially the [prometheus-operator](https://github.com/coreos/prometheus-operator) for automating the monitoring in a cluster from the workshop from [Max Inden @mxinden](https://github.com/mxinden).
The day was fun, the workshop was good, the lunch was deliciois and overall everybody had fun.

***

## Day #2

Yesterday was a good day. Some new interesting concepts about running containers, not only in Kubernetes but also using "native" Docker tools, have been shown.

### Presentation: "Meet Kubo: BOSH-Powered Kubernetes Cluster"

The presentation was held by Ulrich Hoelscher from [Dell EMC](https://twitter.com/DellEMC).

{{< figure src="cds2017-photo2.png" width="100%" title="The slide showed the 'inheritance' from BORG." >}}

No offense against the presentator, maybe it was just the lack of me drinking a coffee before going to the tlak, but in the end it sounded like "Kubernetes, Containers, VMs, Pivotal Cloud Foundry does the thing".

> **NOTE**
>
> Aren't we all companies that want to sell our products? ;)
>
> **NOTE**
>
> The speaker said that Google recommends seperate Kubernetes clusters per stage aka _Dev_, _QA_ and _Live_ cluster.

Overall it was interesting what BOSH with Kubo has to offer for running Kubernetes in the cloud.
For me it wasn't that interesting, as I'm looking for a tool that works on bare-metal and not only in the cloud from a specific provider. BOSH may even work with bare-metal too, but it doesn't seem like it as he mentioned the usage of cloud loadbalancers for HTTP and TCP services, and cloud provider API(s) for creating VMs for the cluster.

### Presentation: "ContainerOps - Using Kubernetes to Orchestrate DevOps Workflow"

The presentation was held by Zhen Ju from Huawei.

He talked about the DevOps story, DevOps Workflow Orechestration and the lifecycle of DevOps.
It would be best, to just take a look at his slides to get a good impression on what he talked about.

{{< figure src="cds2017-photo3.png" width="100%" title="Another diagram that showed a DevOps flow for building applications." >}}

He mentioned their baseimage that solves the issues with some existing baseimages, like lightweighness of the image, process reaping, etc.
It is availabe on GitHub: [phusion/baseimage-docker](https://github.com/phusion/baseimage-docker).

{{< figure src="cds2017-photo4.png" width="100%" title="Even though the quality of the pictures seem to get worse from picture to picture. The slide contained an interesting diagram of an 'example' DevOps Orchestration Workflow." >}}

> **QUOTE** from Zhen Ju:
>
> "With Container, For Container"

Their project for simplifying/simpler DevOps is located on GitHub, here: [Huawei/containerOps](https://github.com/Huawei/containerOps).

### Lunch Time

This time, I'll have to point you to a tweet from [@ConDaysEU](https://twitter.com/ConDaysEU):
<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr">No words necessary! <a href="https://t.co/as8SC7aWIS">pic.twitter.com/as8SC7aWIS</a></p>&mdash; ContainerDays (@ConDaysEU) <a href="https://twitter.com/ConDaysEU/status/877463813548896256">June 21, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I ate the burger instead of the falafel, but at least for the burger I can confirm that they were still as delicious as yesterday!

### Presentation: "Ship your containers fast with GitLab/CI"

The presentation was held by [Niclas Mietz](https://github.com/solidnerd) from [Bee42](https://bee42.com/).

It depends heavily on your decision on "where" you want to run the GitLab CI runner. The GitLab CI runner will run the given Docker images and the commands to in the end build your project.
Although creating the process/pipeline(s) for a project isn't that hard as it might seem. If you are already using Docker to build your project it will be very simple to switch to using GitLab CI pipelines. It's almost as easy as simply putting the commands used to create/compile/build and later on test your project into a `.gitlab-ci.yaml` file.
GitLab automatically detects if the CI file exists and will then show you the status of the run/running build next to the commit(s).

Running "Docker in Docker" is also an option for going for fully reproducible Docker image builds.

The pipelines of GitLab CI allow for simple triggering of deployments to specific stages by a button push.
The deployment process has some integration possibilities, for example automatically adding Kubernetes Token, Certificate, etc. to the runner container to make the deployment to Kubernetes simpler.

{{< figure src="cds2017-photo5.png" width="100%" title="The slide originally showed the example build flow using GitLab CI." >}}

An interesting point he brought up was the use of the [bitnami/minideb](https://github.com/bitnami/minideb) image. The [bitnami/minideb](https://github.com/bitnami/minideb) image uses glibc instead of like for example Alpine the musl library. That makes it better compatible / usable for "older" / existing applications.

The first part of the GitLab CI tutorial can be found at the blog of [Bee42](https://bee42.com/) here: [Bee42 - Getting Started with GitLab CI with Containers (Part 1)](https://bee42.com/blog/getting-started-with-gitlab-part1/).

To summarize this presentation, it showed how simple it is how to use the GitLab CI to create pipelines for your projects. For more see the link to [Bee42](https://bee42.com/) blog above.

### Presentation: "Monitoring and Logging in Wonderland"

The presentation was held by [Paul Seiffert](https://twitter.com/SeiffertP) from [Jimdo](https://www.jimdo.com/).

First of all, I have to admit "Wunderland" is an interesting name for such a PaaS platform.

{{< figure src="cds2017-photo6.png" width="100%" title="The photo contains a slide with the layers in which Wonderland works/begins." >}}

Wonderland manages the infrastructure, from loadbalancers to the containers the applications run in.

For the monitoring, they utilize their Grafana to automatically create dashboard for every service, they are running.

They have the following differenciation between metrics. It is like this:

* Application - Actual metrics from the application running.
* System - Metrics from the Servers/Hosts/VMs running.
* Infrastructure - Metrics about AWS loadbalancers, etc.

..metrics.

> **NOTE**
>
> I would even go so far as to add a "Cloud" in front of the "Infrastructure metrics" in the case of using a Cloud provider.

To gather all application metrics running in volatile containers on different hosts. The Wonderland Service Discovery is used to discover services for the Prometheus monitoring.
An important aspect for metrics is the retention. They use so called "recording rules" for Prometheus. These "recording rules" are automatically created by a self written application to pre-aggregate certain metrics automatically and directly.

{{< figure src="cds2017-photo7.png" width="100%" title="The photo contains a slide with the differenciation between short- and long term storage of metrics with Prometheus federation. In their case short term ~30 min and long term 32 days." >}}

For analyzing logs in case of issues, they simply use [Logbeat/Filebeat](https://www.elastic.co/products/beats/filebeat) for the shipping of logs and [Kibana](https://www.elastic.co/products/kibana) for visualizing the logs.

An interesting presentation about their own infrastructure. It shows exactly some points that are a problem for not only them, but for everyone. Good to see how they have solved the issues. That gives everyone a good idea/concepts that may be altered/used to fit for their own case/problem.

### Presentation: "Operating Microservices with Nomad and Consul"

The presentation was held by [Bastian Spanneberg](https://twitter.com/spanneberg) from [Instana](https://www.instana.com/).

> **DISCLAIMER**
>
> I got to the presentation a bit late. I got there at the begining of the well made demo.

From what I still saw, [Nomad](https://www.nomadproject.io/) looks very interesting as it seems to seamlessly integrate with [Consul](https://www.consul.io/) from [Hashicorp](https://www.hashicorp.com), and run jobs in combination with Consul health checks quite well.
[Bastian Spanneberg](https://twitter.com/spanneberg) showed the ease of the Consul API with some usage examples for his demo:

{{< figure src="cds2017-photo8.png" width="100%" title="The slide with the Consul usage for his demo." >}}

It was interesting to see how easy it is to run containers with [Nomad](https://www.nomadproject.io/). The [Consul](https://www.consul.io/) "service" manifests have an interesting, human-readable format too, which makes it easy like with the YAML manifests from Kubernetes, Docker Swarm and so on.

{{< figure src="cds2017-photo9.png" width="100%" title="Who would have thought it, in the end somebody asked about the nice UI he showed. It was the Instana monitoring tool. Seems like a decent tool for monitoring and going further with tracing and everything done automatically. Just checkout their page here: https://www.instana.com/." >}}

A solid presentation with a nice demonstration of "everything" that was talked about. Now I would definetly take a closer look at [Nomad](https://www.nomadproject.io/) as a container runner, especially when comparing container "runner" (not orchestrators, see NOTE below), and [Consul](https://www.consul.io/) as a Key/Value storage with a twist.

> **NOTE**
>
> He stated that Nomad currently doesn't have "real" orchestration capabilities aka you would need to write tooling around it for orchestration.

### End of the second day

> **QUOTE**
>
> "The sun is slowly turning its back to us. We will wait for the comeback in the morning."

From what I've heard from [Julian Hansert](https://twitter.com/Ju4444), most feedback was good and that new ideas to continue to improve the conference were given and will actively be added with best knowledge to it, to make the conference even better or as Trump would say: [Text to Trump - Jungle.horse](http://jungle.horse/?jungle=The+best+conference.#%7B%22s%22%3A%22i%20have%20conferences%2C%20but%20container%20days%20has%20the%20best%20container%20conference!%22%7D).
It was quite a nice day again, but I would say the wind was a bit stronger today.

***

## Summary

**But even the stronger winds** didn't stop us, the attendants, to stop talking about containers and how we, for ourselves, **can maneuver** through the **strong streams** of the many different container projects, tools and orchestrators to find us the **perfect fitting tool for the job**.

I for my part have one thing I would change, but for myself, that I should bring a phone with a more stable camera API or b) bring a seperate good camera for taking photos at the conference, so the photos have a better quality than the potato like ones right now.

I hope everybody had fun and learned something new. I hope to stay in touch with the cool people I met there and see them soon at another conference or meetup. :-)
Have Fun!

**P.S.**: Please let me know (by comment or email), if there is anything I can improve to make this post about the conference even better. Thanks for reading!
