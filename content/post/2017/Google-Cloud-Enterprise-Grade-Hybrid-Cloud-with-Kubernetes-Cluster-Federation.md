---
title: 'Google Cloud: Enterprise Grade Hybrid Cloud with Kubernetes Cluster Federation'
description: 'These are my thoughts and notes about the presentation and overall the Google Cloud Kubernetes Federation event itself.'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2017-06-29T09:14:45+02:00"
tags:
  - Container
  - Google Cloud
  - Event
  - Kubernetes
cover: /post/2017/Google-Cloud-Enterprise-Grade-Hybrid-Cloud-with-Kubernetes-Cluster-Federation/photo0.png
---

## Intro
I went to the Google Cloud Event about "Enterprise Grade Hybrid Cloud with Kubernetes Cluster Federation" at Google Munich.
> **NOTE** I wrote the next few sentences while not having internet connection because of "DeutscheBahn" ;)

A thing I just have to note is that I had taken an IC instead of an ICE to Munich. Now guess what, ICs don't have wifi.. I personally think that in a county as advanced as Germany, it should be "required" to have wifi on "every" train. Maybe not trams but at least ICs and ECs too instead of only ICEs.
I could solve my problem by using my phone as a hotspot which was just as unreliable as the internet in the ICE, but at least I had a bit of internet, so I got that going for me which is nice. Another awesome thing was that my seat's outlet wasn't working..

At least I arrived without any delays and hope that this "lucky" strike keeps on going when I travel back home.

***

## First impression
![Google Isar Valley Room - Google Cloud CoreOS Event Photo 1](photo0.png)

So it's my first time at Google and I have to say it is awesome. If you ever have the chance to go to an event at Google, go for it! :)

***

## "Google Cloud in a multi-cloud world"
This sort of intro to the event was held by [Jens Bussmann](https://twitter.com/jensbussmann). He works at Google and realised the event.
Google starts about two billion containers per week (the number is already some years old), but from an outside perspective you can easily account for the growth Google had in the last few years and know that the number is definetely higher already but not announced (yet).
Containers are used for over ten years at Google and one of the simplest reasons is that they are easier to move and scale. Moving three containers is simpler than moving three VMs. The same goes for scaling. It's just as it is. Some people may argue that with Google's VM live migration for their Google Cloud Plattform they would use VMs more, but that technology just wasn't available when they "started" doing containers.

How did it come to Kubernetes?
I can't really say too much about that, as Google as keeps itself very quiet about Borg and so on, but from what I know.
Borg started as their go-to-scheduler. Then for running more and more containers, a fork of some sort from Borg was created and called Omega.
At one point Google decided to take the years of experience and put them into the community. This was done by creating the Kubernetes project.
The Kubernetes project now is one of the biggest open source projects out there and combines simplicity with flexibility for container orchestration.
If you now take a look at the project, you say that from Google and the community perspective it was a huge success, putting Kubernetes out there.

We all know it, but yes Google also runs applications, just like everyone else. Google is continuing to improve Kubernetes, not only to match the community but also try make it fit for their own application workloads. As currently most applications at Google don't run in Kubernetes, they will slowly transition to run them in Kubernetes too.
Nowadays Google engineers, looking at the percentage, commit less to Kubernetes. But there is a very good reason for that. The reason is that there are now just more "outside" collaborators that have caused the "commit percentage" (by company) to drop for Google engineers. A very positive message that the community is sending with that "response" to the project.

Kubernetes currently supports up to about 5k nodes or 150k pods. Even Google "admitted" that they and no other company is running more than that and asking the audience also showed the same results for other Kubernetes (/ Container) users. Most "users" are like "We need at least over 5k nodes for running enterprise applications on Kubernetes" but "in real life" some of these companies don't even run more than 100 nodes at the same time in the same cluster..

If size should ever matter (I hope you see what I did there ;) ), Federation can help by mitigating this "issue" by splitting the "load" (pods, etc) over multiple cluster.
Other advantages to see when looking at running a hybrid cloud setup with federation is that (when doing it correctly) you get a nice way to do failover with increased control over your data. As big companies more and more have the need to run on-premise, this also allows for running sensitive data applications on-premise and run other tasks on the cloud (aka on demand). Let's take germany as an example for data protection laws, to get more trust from customers too, you have to run on-premise to comply with law and make customers feel safe about their data.

For Google to step up with the Kubernetes project was a good thing to do. Google simply knows how to scale applications, as they have seven products that have more than one billion active users! Google Cloud Plattform is no exception to that many "users".
From the outside it definetely looks like they know what to do to scale effectively and with efficiency in mind.
Google utilizes their technology so efficiently that they can handle high load situations without so called pre-warming of their applications.

Summarized I can say that Google has with their years of experience and technology what it takes for them, as we saw with the Kubernetes project, to stand up and create a good cloud (Google Cloud Plattform) and an even better container orchestration tool. Their Google Cloud Plattform with their VM live migration and other very interesting features, has definetely what it takes to step up to the plate of AWS and other providers, to put the tide for a "good" cloud provider even higher and keep it their for a long time.

***

## "Tectonic: Self-driving Kubernetes for on-premise and cloud"
[Philipp Strube](https://twitter.com/pst418) is General Manager at [CoreOS](https://coreos.com/) and he held the presentation about [Tectonic](https://coreos.com/tectonic/) which self-drives Kubernetes to a certain aspect.
> **NOTE** I like the company "motto"/slogan:
> "Secutring the Internet" - [CoreOS](https://coreos.com/)
> Also there aren't many companies that can say, that (almost) all of their projects are open source.

Earlier called CoreOS, now called Container Linux is an extermely lightweight linux with an update scheme like Chrome OS (two partition updating) is used in combination with their "newest" creation called "Tectonic".
Tectonic is for simple management of updates for the Container Linux hosts. For example the update process, ensures that not all servers go down for a reboot. The application used for that is [locksmith](https://github.com/coreos/locksmith), available on GitHub.
Tectonic overall makes Kubernetes much more "supportable"/"maintainable" by "automatically" adding features like authentication using their [Dex](https://github.com/coreos/dex) project, which allows for LDAP authentication and is also available on GitHub.

The Terraform "language" is utilized for the "description" of the servers and components. You can easily use the installer to create one cluster after another by changing just some variables in the variable file for Terraform.
CoreOS makes sure with every update, that you have what you need to run Kubernetes with Tectonic, the best example for that is the what I call the version fiasco of Docker, when they changed to using "dates" in their version "numbers" which resulted in Kubernetes having problems with using it and also having issues with the "quick" API changes.

A project called `bootkube` that is currently in the [Kubernetes project incubator](https://github.com/kubernetes-incubator/bootkube), is used for bootstraping Kubernetes using Kubernetes. It allows to sort of run Kubernetes in Kubernetes for the bootstrap process.

Operators strike again! Operators are used extensively when running Tectonic. One of them is used for checking the undelying hosts for Container Linux updates and would then also trigger the reboot for the update, and the [prometheus-operator](https://github.com/coreos/prometheus-operator) is used for the monitoring part inside the cluster.
Another mentioned operator from CoreOS is the [etcd-operator](https://github.com/coreos/etcd-operator). As the name implies it "operates" etcd in Kubernetes, when enabling an experimental flag the etcd-operator also sets up etcd in the cluster.

The operators should later on reliably manage the "applications" to keep the "manual" maintenance as low as possible.

Through the abstraction that Tectonic brings with using Terraform you can easily re-run/apply the given configuration and change it as wanted. In the end it doesn't and shouldn't really matter which cloud provider you are using (AWS, GCP, Azure, "Bare Metal", etc). It feels a bit like a managed Kubernetes cluster with lower manual maintenance required.

The demo showed a Tectonic Kubernetes cluster running on the Google Cloud Plattform, which is still in a pretty beta state, as seen on the Tectonic documentation page. He said that the next release will contain the feature to imitate Kubernetes `Roles` to see what they can do. This will make creating `Roles` definetely simpler to see which things they are able to do or not to.
The Tectonic installer automatically creates `Ingres`es for [Prometheus](https://github.com/prometheus/prometheus) and the Tectonic admin web interface.

As always I can confirm, that operators are are cool and the prometheus-operator in specific is very cool, but to have equality here, all operators are cool! ;)

For curious people that know the Terraform "language", the Tectonic installer is available on GitHub here: [coreos/tectonic-installer](https://github.com/coreos/tectonic-installer).

I already had the chance to experience the simplicity of the Tectonic installer (at least for the AWS plattform) at the Container Days workshop by [Max Inden](https://github.com/mxinden) and [Alex Somesan](https://github.com/alexsomesan) this year, but the presentation just strengthened some points I made:
* Operators are awesome!
* Tectonic is a nice way to self-drive Kubernetes cluster.
* Using Tectonic to install/run multiple Kubernetes cluster and use Federation with them seems to be a good way for creating a hybrid cloud environment.

***

## "Federation: Benefits, real world use-cases and best practices"
The presentation was held by [Michael Mueller](https://twitter.com/michmueller_) from [Container Solutions](https://container-soultions.com).

He brought up some examples of "extreme" IT outages.
The first example was the British Airways in May 2017 when they had an UPS failure that caused one of their datacenters to go mostly down. It took about 2.5 days for them to recover from this failure. They had a second datacenter in place but hadn't tested the failover to the other datacenter.
The next one, was a storage failure at Microsoft Azure in November 2014. At Azure through a single button click the software was deployed by one developer which caused the system to overload due to an application issue and fail. The outage was about 11 hours and 11 Azure datacenters were affected by this.
Who doesn't remember the day the internet couldn't load it's "static" content. A software (and automation?) misconfiguration caused the AWS S3 service to be done for one of Amazon's region. For the applications that had used just this one region, the conclusion is to not only use one S3 zone for their data, but also have failsafes for service outages like the data "backed up" by at least a second zone.

He showed a quote from the Amazon CTO:
> **QUOTE** Werner Vogels, Amazon CTO
> "Everything fails, all the time"

From my point of view, applications need to be additionally tested on how to "react" when dependent services have failures/outages. This then could be used to improve the response from the applications and lower the impact for users.

But now to the all awaited point "How can Federation 'fix' this problem?" (or at least try to make it better).
So first at all, there is no "real" fix for this problem. There will always be outages, you can just protect yourself by adding more, so to say, points of "failure".
An important fact is that overall Kubernetes federation is vendor indepedent. You can run it anywhere it would normally run too. It can be seen as a bridge between the on-premise and cloud Kubernetes cluster.

How can Federation "fix" this problem? It can "fixed" by deploying applications into multiple Kubernetes cluster (in the best scenario are hosted at various cloud providers).
Hybrid cloud is not good when still keeping old structures, that may even still contain "bad" failover strategies (especially with manual failover triggering required).
On failure the traffic can/is "re-routed" (by DNS changes or globally routed/switched failover IPs) to the other remaining datacenters.

For running federation you need/should have:
* Multiple Kubernetes cluster
* Federation control plane (at least one)
* A supported DNS provider (with some sort of health checks)
* Bonus points for a global distributed load balancing solution (examples are Google GIP or for HTTP "only" applications CDNs like: Akamai, Fastly and Cloudflare)

![Federation structure - From CoreOS](https://coreos.com/sites/default/files/inline-images/federation-api-4x.png)
This diagram from [CoreOS](https://coreos.com/) shows the Kubernetes federation structure pretty good.

The `Federation Controller Manager` by default "divides" the workload by cluster. For example you want 100 pods on a federation with 3 cluster, by default this will result in ~33 pods on each cluster.

In the demo he showed a simple world map UI that is able to enable and disable zones with buttons click. It showed the request of "users" where they got routed. They were always routed to the nearest Kubernetes cluster using the Google Cloud Plattform Global IP feature.

When you want to use federation in production, please keep in mind that it is still under heavy development, but with the Kubernetes 1.7 release there will be some mayor improvements to federation. Also to note is that some features like `StatefulSets` are not working/implemented (yet) in federation.
For the federation control plane there is also no "automatic" HA without a lot of manual work around it possible.

Federation ovrall eases the orchestration of multiple cluster/zones, but you still need applications that support "cross zone/datacenter replication".
Federation overall is just for controlling/"scheduling" of workload, for example it doesn't "mess" with DNS, network and other stuff. The control plane will only do some labeling at the object level to make identifying objects easier on a per cluster basis simpler.
To take operators into the view again, there is definetely again a worthy point for creating operators for simpler usage for applications across multiple zones and failover of them, example usage would be automatic switching replication to zones on or off depending on their state.

***

## Summary
The event was very informative. The presentations and discussions held were very interesting.

Have Fun!

**P.S.**: Please let me know (by comment or email), if there is anything I can improve to make this post about the event even better. Thanks for reading!
