---
title: KubeCon Copenhagen 2018 - Day 3
description: 'Talks, keynotes, thoughts and pictures from the KubeCon Copenhagen 2018 Day 3.'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2018-05-04T08:16:15+02:00"
tags:
  - Conferences
  - KubeCon
  - Container
  - Docker
  - Kubernetes
cover: /post/2018/KubeCon-Copenhagen-2018-Day-3/IMG_20180504_092956.jpg
---

<style>iframe{display: block; margin: auto;}</style>

> **NOTE** All credit for the slides in the pictures goes to their creators!
>
> **NOTE** If you are in one of these pictures and want it removed, please contact me by email (see about/imprint page).

> **WIP** This post is still work in progress! The content of this post can rapidly change.
> This note will be removed when the post has been completed.
> **TODO**
> 1. Proof read.

## Welcome!
A warm "Welcome" if you are new to the three day post series from KubeCon Copenhagen, I recommend you to checkout the first day blog post too, here [KubeCon Copenhagen 2018 Day 1]({{< ref "/post/2018/KubeCon-Copenhagen-2018-Day-1.md" >}}) and the second day blog post, here [KubeCon Copenhagen 2018 Day 2]({{< ref "/post/2018/KubeCon-Copenhagen-2018-Day-2.md" >}}).

## Morning Keynotes
### Keynote: Kubeflow ML on Kubernetes - David Aronchick, Product Manager, Cloud AI and Co-Founder of Kubeflow, Google & Vishnu Kannan, Sr. Software Engineer, Google
{{< figure src="IMG_20180504_090657.jpg" width="600px" title="KubeCon - Keynote - KubeCon Bingo" >}}

{{< figure src="IMG_20180504_090844.jpg" width="600px" title="KubeCon - Keynote - Power effectiveness with AI" >}}

Doing machine learning allowed Google to save up to 40% on their power bill.

Machine learning for cloud native, needs to be a) composable, b) Portability and c) Scalability.

{{< figure src="IMG_20180504_091333.jpg" width="600px" title="KubeCon - Keynote - Oh, you want to use ML on K8s?" >}}

If you want to run ML on Kubernetes, you are gonna have a bad time, but not anymore thanks to KubeFlow.

It takes an expert for just ML, running it in Kubernetes is hard too, but KubeFlow can help.
They have released Kubeflow 0.1.
It is built so that you can customize it as you want.

Their demo showed an example of ML usage for finding the likeliness of reviews.

The "normal" way without ML just used predefined words to see how likely the review is to be either a recommendation, neutral or bad.

{{< figure src="IMG_20180504_092147.jpg" width="600px" title="KubeCon - Keynote - KubeFlow TensorBoard" >}}

TensorBoard can be used to see some metrics about the metrics.

{{< figure src="IMG_20180504_092308.jpg" width="600px" title="KubeCon - Keynote - KubeFlow ML end result" >}}

It is able to run on "any" K8S cloud.

A Swedish city had used data science to reduce injuries through new snowfall by optimizing the snowplow paths.

{{< figure src="IMG_20180504_092657.jpg" width="600px" title="KubeCon - Keynote - KubeFlow  - We're just getting started!" >}}

Awesome, I will definitely try this out to get me started in ML.
The end goal is to make Kubernetes to number one platform for ML.

### Keynote: Running with Scissors - Liz Rice, Technology Evangelist, Aqua Security
{{< figure src="IMG_20180504_092956.jpg" width="600px" title="KubeCon - Keynote - Running with Scissors Title" >}}

> "You might carry the scissors for miles before you cut yourself"
> \- Liz Rice

{{< figure src="IMG_20180504_093323.jpg" width="600px" title="KubeCon - Keynote - Container Isolation - View from Host" >}}

Linux container isolation is mostly done through capabilities.
A container run through Kubernetes (mostly likely also Docker) drops most "bad" capabilities/isn't even granted the capabilities on start.

`securityContext`:

* `privileged: true` gives all privileges.
* `runAsNonRoot` option sets the container to run the image as non root. Though the image needs to have `USER 1000` (where `1000` isn't `0` aka root) to be able to run otherwise Kubernetes will not be able to run.
* `runAsUser` force container process to be started as user ID (same exists for supplemental groups).

For more information see the `securityContext` documentation: [Kubernetes.io Documentation - Pod SecurityContext](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/).

{{< figure src="IMG_20180504_094113.jpg" width="600px" title="KubeCon - Keynote - Security with USER in Dockerfile" >}}

{{< figure src="IMG_20180504_094344.jpg" width="600px" title="KubeCon - Keynote - Host can't remove root file created by root container as non root" >}}
One can potentially use a volume mount of the pod to access files from hosts and because the UID is `0` aka root, everything can be done.

{{< figure src="IMG_20180504_094636.jpg" width="600px" title="KubeCon - Keynote - Stop running with scissors" >}}

> "We need to prevent us from running with scissors"
> \- Liz Rice

1. Change applications Dockerfiles and add `USER __YOUR_ID__` line.
2. Use tools like from Aqua Security.
3. Use PodSecurityPolicies.

### Keynote: Scaling Deep Learning Models in Production Using Kubernetes - Sahil Dua, Software Developer, Booking.com
{{< figure src="IMG_20180504_095039.jpg" width="600px" title="KubeCon - Keynote - Booking.com Scaling Highlights" >}}

They run Deep Learning at huge scale.

{{< figure src="IMG_20180504_095032.jpg" width="600px" title="KubeCon - Keynote - Scaling Deep Learning Models in Production Using Kubernetes Title" >}}

They use it for:
* Image Tagging
* Translations
* Advertisement bidding
* And more..

{{< figure src="IMG_20180504_095350.jpg" width="600px" title="KubeCon - Keynote - Booking.com Image Tagging" >}}

Once they have the tags on the images the user is able to better search for certain factors of a hotel/room.

The workload for deep learning is immmensive. From 10 to 100s of GBs to sometimes even terrabytes of data to go through.

They choose Kubernetes because of the:
* Isolation
* Elasticity
* Flexibility

They don't put training data into the images. This removes the need to always repull the image.
They simply use Hadoop or PVs to access/mount the training data.

I recommend to checkout the recording as he made a nice graphical visualization on their setup.

{{< figure src="IMG_20180504_100114.jpg" width="600px" title="KubeCon - Keynote - Booking.com Serving ML Predictions 1" >}}

They use common code (possibly a library) which contains access instructions to the model(s). To that they containerize the application, but without the model in it.
The model is loaded in memory "on demand" from Hadoop storage and then it begins to serve the predictions.

{{< figure src="IMG_20180504_100355.jpg" width="600px" title="KubeCon - Keynote - Booking.com Serving ML Predictions 2" >}}

### Keynote: Crossing the River by Feeling the Stones - Simon Wardley, Researcher, Leading Edge Forum
{{< figure src="IMG_20180504_100931.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - Title" >}}

{{< figure src="IMG_20180504_101057.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - Common Blahs" >}}
(blah, blah, blah)

{{< figure src="IMG_20180504_101133.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - Blah Template" >}}

{{< figure src="IMG_20180504_101136.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - Auto generate strategies" >}}

{{< figure src="IMG_20180504_101242.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - Three main feedback points for his autogenerated strategies" >}}

{{< figure src="IMG_20180504_101252.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - Automatic Strategy Generator Online" >}}
[Automatic Strategy Generator Online](http://strategy-madlibs.herokuapp.com)

{{< figure src="IMG_20180504_101657.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - Four fields" >}}

{{< figure src="IMG_20180504_102829_1.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - 'The End of cloud is neigh ...'" >}}
'The End of cloud is neigh ...'

{{< figure src="IMG_20180504_103047.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - Circle of purpose and movement" >}}

This was the funniest keynote, you have to checkout the recording of it if you weren't there.

{{< figure src="IMG_20180504_103051.jpg" width="600px" title="KubeCon - Keynote - Crossing the River by Feeling the Stones - Deng Xiaoping Quote" >}}

### Keynote: Closing Remarks – Kelsey Hightower, Kubernetes Community Member, Google & Liz Rice, Technology Evangelist, Aqua Security

> "You feel the AC?"
> \- Kelsey Hightower

{{< figure src="IMG_20180504_103242.jpg" width="600px" title="KubeCon - Keynote - Closing Remarks - Upcoming conferences" >}}

The upcoming CloudNativeCon and KubeCon will be at:
* Shanghai, China: November 14-15. 2018
* Seattle, North America: December 11-13. 2018
* Barcelona, Europe: May 21-23. 2019

## Talks
### Rook Deep Dive – Bassam Tabbara, Tony Allen & Jared Watts, Upbound (Intermediate Skill Level)
<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr">full room for the <a href="https://twitter.com/rook_io?ref_src=twsrc%5Etfw">@rook_io</a>  deep dive.  actually 2 deep dives, one for developers and one for administrators. great job <a href="https://twitter.com/tonya11en?ref_src=twsrc%5Etfw">@tonya11en</a>  and <a href="https://twitter.com/galexrt?ref_src=twsrc%5Etfw">@galexrt</a>! <a href="https://t.co/LqszC4Qzdl">pic.twitter.com/LqszC4Qzdl</a></p>&mdash; Jared Watts (@jbw976) <a href="https://twitter.com/jbw976/status/992412121538465792?ref_src=twsrc%5Etfw">May 4, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

First of all thanks for coming to the talk!
A big thanks also goes out to Jared and Tony that I could talk about the administrative side of Rook. I really enjoyed helping with the slides.

I hope everyone liked the talk. If you have feedback about the talk, get in touch with Jared, Tony or me.

Be sure to follow Jared's Twitter [@jbw976](https://twitter.com/jbw976).

### Kubernetes Runs Anywhere, but Does your Data? - Jared Watts, Upbound (Beginner Skill Level)
{{< figure src="IMG_20180504_144545.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? Title" >}}

<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/jbw976?ref_src=twsrc%5Etfw">@jbw976</a> fills the auditorium talking about portability of stateful workloads across clouds? <a href="https://twitter.com/hashtag/kubecon?src=hash&amp;ref_src=twsrc%5Etfw">#kubecon</a> <a href="https://twitter.com/rook_io?ref_src=twsrc%5Etfw">@rook_io</a> <a href="https://t.co/bmqkmVaBbS">pic.twitter.com/bmqkmVaBbS</a></p>&mdash; bassam (@bassamtabbara) <a href="https://twitter.com/bassamtabbara/status/992385488500772864?ref_src=twsrc%5Etfw">May 4, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Kubernetes runs anywhere (even on a robot vacuum cleaner).
The power of Kubernetes is also Portability.

{{< figure src="IMG_20180504_144900.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - How does Kubernetes do it?" >}}

There are abstractions for running applications in Kubernetse but also already for Storage in general.
Storage abstraction is available through PersistentVolumes, PersistentVolumeClaims and more.

{{< figure src="IMG_20180504_145357.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - Where Storage Falls Short" >}}

{{< figure src="IMG_20180504_145458.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - Where Storage Falls Short" >}}

The provisioning is still more in the background than consuming storage.
This will change with ContainerStorageInterface (CSI).

To be able to run stateful applications anywhere you need a portable storage solutions.
CRDs can be used to create abstractions.

{{< figure src="IMG_20180504_150229.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - Operator's Control Loop" >}}

On the first day you deploy, on the second you support it (Day 2 operations).

{{< figure src="IMG_20180504_150457.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - Kubernetes API and Clientsets" >}}

{{< figure src="IMG_20180504_150734.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - Event Triggers" >}}

{{< figure src="IMG_20180504_151151.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - Demo Deployments spawned by a controller through a CRD 1" >}}

The new WIP CockroachDB and Minio operator were show cased next to the Ceph one.

{{< figure src="IMG_20180504_151152.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - Demo Deployments spawned by a controller through a CRD 2" >}}

{{< figure src="IMG_20180504_151153.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - Demo Deployments spawned by a controller through a CRD 3" >}}

{{< figure src="IMG_20180504_151613.jpg" width="600px" title="KubeCon - Talk - Kubernetes Runs Anywhere, but Does your Data? - Questions?" >}}

## Summary
As always KubeCon was awesome. I met amazing people, had very interesting talks and found new contacts.

Have Fun!
