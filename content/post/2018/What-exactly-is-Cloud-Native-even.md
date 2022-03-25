---
title: What exactly is „Cloud Native" even?
description: 'Cross-Post of my "What exactly is „Cloud Native" even?" article from "The Cloud Report"'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2018-10-15T08:15:20+01:00"
tags:
  - Cloud Native
  - Cloud
  - Articles
cover: /post/covers/cloudy-road-from-gratisography-com.jpg
---

Checkout the orignal publication of this article on the [The Cloud Report](http://the-report.cloud/) site, where it was posted originally, here: [The Cloud Report - What exactly is „Cloud Native" even?](http://the-report.cloud/what-exactly-is-cloud-native-even).

***

Let’s look at the Cloud Native Computing Foundation mission statement for an explanation what "Cloud Native" is in their eyes:

> The Foundation’s mission is to create and drive the adoption of a new computing paradigm that is optimized for modern distributed systems environments capable of scaling to tens of thousands of self healing multi-tenant nodes.¹

What exactly can we take away from the CNCF mission statement in aspect of "Cloud Native"?

"Cloud Native" in its broadest aspects is about building "distributed systems" and having these "environments" capableto "scaling to tens of thousands of self healing multi-tenant nodes".

Applying these aspects on to our own applications means that we make them resilient against (e.g., server, network)

failures, scalable so that when from day to the other you have one million new users you don’t get sweaty by the heat fromthe servers and new users, and self healing that if somethingbreaks it is able to recover on its own (in most cases) allowingyou to sleep during the night.

But is "Cloud Native" really just a "paradigm" that applies to applications? Isn’t it also a "state of mind" which comes with the move to having more automation in place to be able to handle "Cloud Native" and wanting to automate "everything"?

Generally speaking if one moves to use the cloud and does not use any automation he will "fall out of the cloud" pretty fast for sure. Already before "Cloud Native" was a thing automation was key to get servers, applications and others managed fast and without a hassle. When automation is used and applied "correctly", there is no one correct way, the load on the teams is reduced and they can focus on their primary objective to develop new or improve existing products.

As we can already summarize "Cloud Native" is more thanjust a "computing paradigm", it is a mindset to live by. A mindset which is about being open (source) and sharing too. For this let’s take a quick look at Google as they are a good example of how open source can help your business grow. Google open sourced the Kubernetes² project. The Kubernetes project has a huge global community with people from many different companies, which are working on Kubernetes to improve it for everyone. Depending on your current stance to open source, especially when you are working in a "closed off" corporate, you may find this weird. But this is how people want to work, most administrators and developers want to share their success and failures openly at conferences and meetups. This exchange of information between people helps others to not make the same mistakes, to put it simply: to learn from the success and failures of others. This is where transparency comes into play. Sad enough not all corporates allow their employees to be open about such things, but in most cases to consider there are almost no downsides to allow your employees to openly exchange such information. As a corporate may deem it hard to allow such an open exchange of information and possibly also code (contributions), it is possible as one can see from companies such as NetFlix, Google and others which are openly sharing their stories and helping projects.

The question for the end is "Are you ready to think Cloud Native or are you just ‘jumping’ on to the hype train?".

***

**Sources**:

* [https://www.cncf.io/about/charter/](https://www.cncf.io/about/charter/) Section "1. Mission of the Cloud Native Computing Foundation."
* [https://12factor.net/](https://12factor.net/)
* [https://kubernetes.io/](https://kubernetes.io/)
