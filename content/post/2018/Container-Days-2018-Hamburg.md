---
title: Container Days 2018 Hamburg
description: 'Some thoughts, notes, comments and pictures from the Container Days 2018 in Hamburg.'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2018-06-19T08:45:06+02:00"
tags:
  - ContainerDays
  - Container
  - Docker
  - Kubernetes
categories:
  - Conferences
cover: /post/2018/Container-Days-2018-Hamburg/IMG_20180619_091209.jpg
---

## Thanks!

A thanks and shoutout to [Cloudical](https://cloudical.io/) for allowing me to talk about Rook together with Kim-Norman Sahm.
Checkout their Twitter: [Cloudical](https://twitter.com/cloudical).

***

## Day #0

The speaker party was filled with cool people and a nice atmosphere at [StrandPauli](https://www.strandpauli.de).

{{< figure src="IMG_20180618_233433-PANO.jpg" width="975px" title="Container Days 2018 - Night view from StrandPauli" >}}

{{< figure src="IMG_20180618_235548.jpg" width="975px" title="Container Days 2018 - Reeperbahn Trainstation sign" >}}

Obvious visit to the Hamburg Reeperbahn. Just kidding, we just used the train station to get back to our hotel (as far as I remember) ;)

***

## Day #1

Let's see what awesomeness the day will bring. I hope I'll learn new stuff about containers and Kubernetes, and hopefully meet all the cool people again. :)

{{< figure src="IMG_20180620_094453.jpg" width="800px" title="Container Days 2018 - Shuttle busses to the conference venue" >}}

{{< figure src="IMG_20180619_090832.jpg" width="800px" title="Container Days 2018 - The crowd is getting ready for the keynotes" >}}

### Keynotes

{{< figure src="IMG_20180619_091209.jpg" width="800px" title="Container Days 2018 - Julian and Sebastian from Loodse on stage" >}}

> "Back to the harbor."

..where containers originate.

#### Globalization in the port. How containers changed the world of harbour work. - Ursula Richenberger, German Port Museum

A container combines two important points. Storage and Transport.
Characteristics of shipping containers are:

* Stackability
* Handling
* Flexibility
    * "Toilets, Store" - Container are not for goods transportation only.
    * Transport by:
        * Train
        * Truck
        * Ship

These can be seen as the following in the IT world:

* Scalability
* Ease of use (e.g. YAML manifests)
* Flexibility
    * [Open Container Initiative](https://www.opencontainers.org/) creating standards to be able to run, e.g. Docker images run on any Container runtime implementing the Container Runtime Interface standard and Container image standard.
    * [Certified Kubernetes Service provider](https://www.cncf.io/certification/kcsp/) allow us to run our (Kubernetes) workload "anywhere".

{{< figure src="IMG_20180619_091950_1.jpg" width="800px" title="Container Days 2018 - Globalization in the port" >}}

Such hubs in a harbor are the core which made the Hamburg harbor especially powerful in global trading.

{{< figure src="IMG_20180619_092244.jpg" width="800px" title="Container Days 2018 - The difference between before the 'revolution' and after" >}}

A huge revolution happened in the transport logistics because of containers.
Because of the transport container revolution, many things have been automated though still not everything.

"In the reality a container transports goods, but aren't our applications in containers also just goods? Goods that we want to deliver fast to our customers."

#### Emergence of Linux Application Containers and the Rise of Kubernetes - Craig McLuckie, Heptio

"dotCloud" has renamed themselves to "Docker".
They had the problem of wanting to run "user" code in production and be fast with it, instead of "having to review every bit of code".

Google uses cgroups to use resources more efficient. Though at first the code was private, but they donated the cgroups code.
This has advantages for everyone and especially for Goole, because it reduces the workload of "rebasing" on upstream changes happening.

{{< figure src="IMG_20180619_093856.jpg" width="800px" title="Container Days 2018 - 'Why open source?'" >}}

They open sourced their code for it and with that the Linux kernel built namespaces. cgroups, namespace and other parts came together, not only for good of the community but also for Google, as already mentioned.

> "upstream is powerful" - Craig McLuckie

The more you push your changes to upstream, the less work you have to do to maintain your implemented "feature set" (e.g. no rebasing all the time).

Google with their experience, looking at you Kubernetes, gave us a "blueprint" in regard of that it is possible to run at scale with containers as they do.

The thesis behind Kubernetes is/was that we can give it the community, but simply offer it "as a Service" running it better than "anyone else".
This thinking allows Google to score big time, because "every" company runs it, also lowering (new) developer time to production (how long a new developer needs to get changes to production).

Kubernetes project brought a lot of companies together, in discussions for features and issues helping out by contributing and/or sponsoring such projects.

#### The Cloud Native Evolution - Ihor Dvoretskyi, CNCF

A monolith application can be seen as a static glacier, which is hard to fix bugs in and further develop.

Destroying an application is a benefit as long as you can redeploy it, looking at containers you normally just "throw away" used containers.

{{< figure src="IMG_20180619_100207.jpg" width="800px" title="Container Days 2018 - 'Congrats Kubernetes' for the graduation as a CNCF project" >}}

Kubernetes is the first project to graduate from all of the Cloud Native Computing Foundation projects.

{{< figure src="IMG_20180619_100420.jpg" width="800px" title="Container Days 2018 - Cloud Native Computing Foundation project landscape" >}}
\*Rook is seen on a slide during a conference photo\*

The CNCF projects can live next to eacht other and are not in direct competition.
CNCF landscape can be viewed in it's full extent here: [CNCF Cloud Native Interactive Landscape](https://l.cncf.io).

The most important is the community.
Not only are there more than 23 thousand contributors contributing to CNCF projects, but also a huge meetup community all around the globe.
To further help with the community, there are also many initiatives (e.g. meet the maintainers).

### Presentations

#### Distributed Database DevOps Dilemmas? Kubernetes to the rescue! - Akmal Chaudhri, GridGain Systems

{{< figure src="IMG_20180619_121925.jpg" width="800px" title="Container Days 2018 - Day #1 Don't buy these books." >}}

> "Don't buy these books." - Akmal Chaudhri

He also writes articles from time to time. A list of his articles can be found here: [DZone Akmal Chaudhri Articles list](https://dzone.com/users/1313357/VeryFatBoy.html).

Apache Ignite is a In-Memory Computing Platform.

{{< figure src="IMG_20180619_122359.jpg" width="800px" title="Container Days 2018 - Day #1 Apache Ignite is.." >}}

Peer to Peer system. It allows for pessimistic and optimistic transactions.

Because of the in-memory caching, you can run SQL queries, machine learning and other tasks on the incoming data across the cluster quickly (e.g. IoT data).

{{< figure src="IMG_20180619_123205.jpg" width="800px" title="Container Days 2018 - Day #1 Apache Ignite Clustering" >}}

Running Ignite inside of Kubernetes, allows to you use the Kubernetes scaling features combined with service discovery.

{{< figure src="IMG_20180619_123712.jpg" width="800px" title="Container Days 2018 - Day #1 Can scale 'as needed' by simply utilizing `kubectl scale`" >}}

It allows you to scale 'as needed' by utilizing `kubectl scale` command.

#### The "what" and "why" of Flatcar Linux, a friendly fork of Container Linux - Chris Kühl, Kinvolk

{{< figure src="IMG_20180619_172255.jpg" width="800px" title="Container Days 2018 - Day #1 'All Systems Go!' Linux conference, September 28-30, 2018 in Berlin, Germany" >}}

They have an upcoming event about the "stack" below the applications and/or container runtime on September 28-30, 2018 in Berlin, Germany.

{{< figure src="IMG_20180619_172649.jpg" width="800px" title="Container Days 2018 - Day #1 'What is Flatcar Linux?'" >}}

They deliver [Flatcar Linux](https://www.flatcar-linux.org/) in three channels as Container Linux: `stable`, `beta` and `alpha`.
You should always run some nodes with the beta version to test that changes are compatible with upcoming `stable` versions.

Two the points why they forked CoreOS/Container Linux are:

* CoreOS was bought by RedHat.
    * Though they already talked about it before that. They generally try not to make it in a competitive manner.
* No support for CoreOS/Container Linux available (only when using the full Tectonic stack).

[Kinvolk](https://kinvolk.io/) already exists for three years, so they seem to be successful with their "goal".

Their goal is to be an independent infrastructure company for cloud native technology.

Flatcar Linux has support for [Typhoon](https://typhoon.psdn.io/).

For now they are only offering support for larger installations of Flatcar Linux and contribute more to maintenance of Container Linux from which Flatcar Linux benefits from.
Another goal for the future is to offer commercial support for Typhoon.

{{< figure src="IMG_20180619_174753.jpg" width="800px" title="Container Days 2018 - Day #1 'Thank you!' for showing an interesting 'new' Linux for containers" >}}

### Lunch Time

{{< figure src="IMG_20180619_125610.jpg" width="800px" title="Container Days 2018 - Day #1 Lunch time" >}}

As last year, I only ate the burger, because it was and is good. Only thing all of us noticed, it is a bit hard to scale burger cooking unless you add more Big Ben Burger trucks.

### Booths

{{< figure src="IMG_20180619_194503.jpg" width="800px" title="Container Days 2018 - Day #1 Booth shot" >}}

***

## Day #2

### Presentations

#### HandsOn PodSecurityPolicies - Erkan Yanar

{{< figure src="IMG_20180620_105246.jpg" width="800px" title="Container Days 2018 - Day #2 PodSecurityPolicies let's get started" >}}

`PodSecurityPolicies` are to further cage in applications running inside containers.
On OpenShift it is by default required to run containers as non root.

To enable `PodSecurityPolicies` you just need to change the admission controller flag on the API server(s).

`Pods` are restricted by `PodSecurityPolicies`, not `Deployments`, `StatefulSets`, `ReplicaSets`, because they only "spawn" Pod objects.

> **NOTE**
>
> * Authentication: know who you are
> * Authorization what you are allowed to do.

{{< figure src="IMG_20180620_111517.jpg" width="800px" title="Container Days 2018 - Day #2 Docker equivalent flags for the Kubernetes PodSecurityPolicies options" >}}

* `allowPrivilegeEscalation` disallows more privileges and/or capabilities to be "given" to containers.
* `emptyDir` can possibly be used to DoS the filesystem of the host system.
    * At least looking at storage space limitation one could use `Quotas` for storage requests.
* `hostPath` is also evil if used to for example modified `/etc/shadow` and/or other important files.
* `readOnlyRootFilesystem` allows the container filesystem to be read-only to prevent applications from filling your host disk through that and/or "attackers" to write files.

#### Migrating the Next Generation Mobile Core Towards 5G with Kubernetes - Karla Saur, Intel

{{< figure src="IMG_20180620_134723.jpg" width="800px" title="Container Days 2018 - Day #2 Core Pinning feature" >}}

They implemented features such as "core pinning" to further keep workload from swichting between CPU cores.

{{< figure src="IMG_20180620_134838.jpg" width="800px" title="Container Days 2018 - Day #2 Performance comparison non-container and Kubernetes environment" >}}
During their performance tests they found that Kubernetes does perform a little less well than when the application is not run in containers. Though those were just about 5% and was okay for them, because they have simplicity for scaling through that.

{{< figure src="IMG_20180620_135624.jpg" width="800px" title="Container Days 2018 - Day #2 Their load balancer setup" >}}

They wrote their own load balancer as existing load balancer are more or less "just" focused on level 4 and 7.

The NGIC gateway is available under [project:ngic | gerrit.opencord Code Review](https://gerrit.opencord.org/#/q/project:ngic).

Another project they have open source is [MULTUS CNI plugin](https://github.com/intel/multus-cni). This CNI (plugin) allows you to attach multiple network interfaces (CNI plugins) to one Pod.

#### Distributed storage with Rook - Kim-Norman Sahm, Cloudical & Alexander Trost, Rook Contributor

{{< figure src="IMG_20180620_122748.jpg" width="800px" title="Container Days 2018 - Day #2 Kim-Norman Sahm and Alexander Trost getting ready for the Rook talk" >}}

<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr">A great presentation about <a href="https://twitter.com/rook_io?ref_src=twsrc%5Etfw">@rook_io</a>, the sandboxed project of <a href="https://twitter.com/CloudNativeFdn?ref_src=twsrc%5Etfw">@CloudNativeFdn</a> at <a href="https://twitter.com/ConDaysEU?ref_src=twsrc%5Etfw">@ConDaysEU</a> <a href="https://twitter.com/hashtag/CDS18?src=hash&amp;ref_src=twsrc%5Etfw">#CDS18</a> <a href="https://t.co/tYQy3vY47A">pic.twitter.com/tYQy3vY47A</a></p>&mdash; Ihor Dvoretskyi (@idvoretskyi) <a href="https://twitter.com/idvoretskyi/status/1009438369192046595?ref_src=twsrc%5Etfw">June 20, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

It was an amazing experience talking about Rook. Sadly not all parts of the demo worked, "Damn Demo gods have left us".

I can reassure that it works, after the talk and questions I checked again and the Elasticsearch cluster demo part had started up fine. Additionally I deployed the "same" manifests again in the evening (only change was to add HTTP basic auth to the Ingress) and the Elasticsearch cluster started fine again.

{{< figure src="IMG_20180620_170132.jpg" width="800px" title="Container Days 2018 - Day #2 'We did it!' Celebrating after the 'storm'." >}}

The demo files can be found here: [GitHub galexrt/presentation-distributed-storage-with-rook](https://github.com/galexrt/presentation-distributed-storage-with-rook).

The slides can be downloaded as a PDF here: [Distributed storage with Rook.pdf](Distributed storage with Rook.pdf).

### Lunch Time

{{< figure src="IMG_20180620_123011.jpg" width="800px" title="Container Days 2018 - Day #2 Lunch time" >}}
Today it was Pulled Turkey Burger time, it was also great.
Though as mentioned yesterday there was a good amount of wait until you have gotten your burger.

***

## Summary

{{< figure src="PANO_20180620_123015.jpg" width="1000px" title="Container Days 2018 - Hafenmuseum, Hamburg was the perfect choice for Container Days!" >}}

As last year it was awesome meeting all those people and learning new stuff about containers through the variety of talks.
This year was especially cool for me, because it was my first time speaking at a public conference.

Have Fun!

**P.S.**: Please let me know (by comment or email), if there is anything I can improve to make this post about the conference even better. Thanks for reading!
