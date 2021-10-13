---
title: "FOSDEM'20 Brussels"
author: "Alexander Trost"
description: "Some thoughts, notes, comments and pictures from the FOSDEM'20 in Brussels, Belgium."
cover: '/post/2020/FOSDEM20/fosdem2020-brussels-cover-w1250px.png'
categories:
  - Conferences
tags:
  - FOSDEM
  - Brussels
  - Ceph
  - Rook
  - Talk
aliases:
  - FOSDEM20-Brussels
date: 2020-01-31T19:06:12+01:00
---

Checkout the original publication of this article on the [The Cloud Report](http://the-report.cloud/) site, where it was posted originally, here: [The Cloud Report - FOSDEM’2020 Brussels](http://the-report.cloud/fosdem2020-brussels).

Thanks to The Cloud Report for allowing me to write and publish the post on their blog!

***

I'm sitting in the ICE train back home from FOSDEM'2020 Brussels, and I’ve got only one thing to say: "What a wonderful weekend!"

FOSDEM, a weekend in Brussles, Belgium, where great minds in the form of developers, administrators and engineers meet and connect.
They talk about their topics, projects, experiences and ideas.
It's great to get in touch with the people behind the projects, and to stay in contact with people from previous companies / projects. Being able to discuss problems and features with project developers in person normally results in awesomeness for the project in the end.
Or, put differently, did you ever want to buy the guy that made a project you are using a beer for helping with a bug / feature? I hope your answer to that question is "yes", and FOSDEM is the place to do exactly that.

For FOSDEM newcomers, don't worry, your not the only one being a bit overwhelmed with FOSDEM.
Every year it is a new adventure, with rooms changed, different ways to get to rooms due to some construction work at the university and other points.
A recommendation I can give is to read and apply the "Open Sourcing Mental Illness Conference Handbook" which can be found on the [Keeping Cloud Native Well - Cloud Native Computing Foundation](https://www.cncf.io/blog/2020/01/10/keeping-cloud-native-well/) blog. It is great to see such a group nowadays look into this topic.

I sadly, but also thankfully, have to say that there is only one "down", which is the same as last year.
A big problem are the rooms; the Devrooms with topics such as containers, Golang and other popular topics, are always "full house" (full rooms). In some cases this even means that there are (long) queues to get in the rooms.
To be fair here, in my opinion it has gotten better in comparison to last year, still it is a bit of a bummer if you want to hear a talk and you can't get in / need to be there 3 talks before (camping) the talk even starts to have a seat in the room. (Please don't room camp, thanks! `;-)`) If you don't necessarily want to be in the room, there are livestreams available for all rooms, which is cool in its own as not many conferences have that.
I'm hope that this problem will be further improved next year for FOSDEM'21.

{{< figure src="MVIMG_20200201_135436.jpg" width="100%" title="FOSDEM'20 - Outside area shot #1" >}}

One of the awesome things to mention is that the recordings of the talks are available pretty quick as it is a self service system for the speakers. In my case the ["Rook Cloud Native Storage for Kubernetes" by Alexander Trost](https://video.fosdem.org/2020/H.1308/rook_cloud_native_storage_for_kubernetes.mp4) I gave, is already available to watch.
The more time passes, the more talk recordings will be available to watch. If you go to the [FOSDEM'20 schedule](https://fosdem.org/2020/schedule/) and click on a talk, it should have the recording linked in the "Links" section for you to watch.

Let's dive into one of the talks that stood out to me. It is the "The Linux Kernel: We have to finish this thing one day;)" by "Thorsten Leenhuis".

{{< figure src="IMG_20200201_101052.jpg" width="100%" title="FOSDEM'20 - Saturday, Janson Room: \"The Linux Kernel: We have to finish this thing one day ;)\" by \"Thorsten Leemhuis\"" >}}

He talked about Linux getting "actual" Async IO through `io_uring`, which should give a boost to the "kernel scalability" of Linux.
The scalability of Linux is an interesting point as in a lot of cases a to be implemented feature / change, has to work on existing code to improve it. One example he brought up was the use of the `lock_kernel()` call, which usage is almost completely removed from the kernel code to improve performance and scalability.

Another big example for change and also improvement, is eBPF. For the people that don't know about eBPF yet, it is a way to run "BPF programs" in the Linux kernel. These "BPF programs" can be very powerful, as can be seen in the Cilium project, which uses it filter traffic on L4 and L7 (e.g., HTTP, Kafka, GRPC and others) as well. Other kernel subsystems have shown interest in eBPF.

BPF itself helps to bring "Dtrace 2.0". It does so in form of BCC and bpftrace to Linux, for more and better tracing capabilities in and around the Linux kernel.

Realtime is a feature in which various people and companies are investing time into. This is a great thing as things need to be fast, very fast for realtime processing, meaning that the whole kernel benefits from these realtime capabilities.

Besides all these technical topics, he brought up a point which I think everyone should remember:

> "Reaching big goals in small steps"
>
> By [Thorsten Leemhuis](https://www.leemhuis.info/)

Most features in the Linux kernel came in small steps to in the end form a big whole feature and / or improvement. Looking at `BPF` that has been built over years, that definitely seems right.

{{< figure src="MVIMG_20200201_142211.jpg" width="100%" title="FOSDEM'20 - Outside area shot #2" >}}

There were many interesting talks, too many interesting topics for just two days, but that is what the recordings are for. As mentioned earlier, it’s best to checkout the [FOSDEM'2020 schedule](https://fosdem.org/2020/schedule/) to get a feeling of how many different topics / areas there are.

I spent most of the time talking with to people I know, but also with unknown people, to hear about their old and new experiences, projects and ideas.
In addition to that I, for me as a speaker, it is flattering to get interesting questions to answer during the talk and afterwards outside the room.
I had extensive talks with people new to, and already using, Rook, after my talk.
These conversations, questions and feedback are always a great way to gather insights on how people are using the project and how Rook can be further improved, but also how I myself can improve as a speaker.

Thanks to the community around Free Software, Open Source and Hackerspaces, there have been a lot of possibilities to grab a beer or two with colleagues and friends.
As a tradition I can say the waffles are still very good and I can fully recommend them.

{{< figure src="IMG_20200201_211417.jpg" width="100%" title="FOSDEM'20 - Belgium Waffles at Le Funambule" >}}

Be sure to try their waffles next time you are in Brussels, see [Le Funambule on Google Maps](https://goo.gl/maps/fiJC2Qm2hr22).

In summary, FOSDEM is always a great event to meet and connect with people, not necessarily to go to (many) talks due to the room situation, but still you will have definitely learned something afterwards that may help you in your future IT adventures.

If you haven't been to FOSDEM yet, maybe this article has shown that you should join next year#s FOSDEM.
Feel free to drop by and say hi, should you visit FOSDEM next time.

Have Fun!
