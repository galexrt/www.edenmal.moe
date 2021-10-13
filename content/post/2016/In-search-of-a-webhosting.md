---
title: In search of a Webhosting
tags:
  - Tips
categories:
  - Webhosting
description: Some points to look out for when looking for a cheap and good shared webhosting.
toc: true
date: "2016-05-08T14:48:13+02:00"
author: Alexander Trost
---

Some points you should consider before buying a shared webhosting.

## Points to consider about a shared hosting

### IPv6 connectivity

If the hoster offers CloudFlare CDN with the package, you can ignore this point as CloudFlare has 6to4 support.

> I personally completely ignore this point, if CloudFlare CDN is available.

### Is Unlimited really Unlimited?
Some hoster have offers like "Unlimited Webspace", but you will never have unlimited space.
If you check the disk space with a script, you'll see that you don't have "unlimited" space. The space you'll see is more of a "normal" hard drive size like 1TB or a bit more for HDD hosting and for SSD hosting ranging from 240 to 480GB. Keep that in mind.

> The GB values are from my "experience" with shared webhostings until now.

**Please note** that some hosters give you "unlimited" webspace, but have a limit on the inode count. For newlings, one inode is one file or directory.
But in most cases the limit of the inode count is enough for a blog, as long as you don't intend to upload 10 thousands of pictures for every post.
The inode count should even cover multiple small to middle WordPress installation.

### Price Politics - A dark chapter in the existence of companies

Companies get it right! If you display a "promotional" price of **3.99$** and I as a customer notice at the checkout that the price is for a **3-year contract**..
I don't want to bind myself for so long to a company and you should not too!
A simple reason for not binding yourself to a company for that long, is that when big problems occur (after the money back guarantee) but you have to stick to them, because you have paid for 3-years.

One month contracts are better, for the point that you can cancel any time.

### Webhosting features that should also be included

A webhoster should always have at least the following features:

* PHP version selection (+ PHP module selection) - Older PHP version for older PHP applications.
* Addon Domains aka "Multiple External Domain" Hosting - To allow the hosting of multiple domains even from an external registrar.
* Error Log Insight - To see configuration problems with `.htaccess` files and your PHP applications.
* CloudFlare CDN - Website optimization, CDN and DDOS protection.
* SSH (SFTP) access - For secure file access or at least FTP with TLS encryption.

I think that these are the most important features a webhosting should have included (for "free", without an extra fee).

***

## An question to ask yourself: Should I host it myself?

Some people with enough knowledge may ask themselves "Why don't I setup a webhosting and mail server by myself?".
I asked myself the same question, but fast came to a conclusion.
If I setup the webhosting and mail service by myself, I have to look after it, keep the software up to date and check that all services are up and running (blacklist checking, etc.).
Keeping everything running aka Maintenance will take up some time.

> **Keep in mind!** Setting up your own webhosting takes a good amount of time and the maintenace of the services requires time too.

I personally have tested some hosters, but after now three "tested" hosters I decided that it's cheaper and even if it costs "more" time to maintain that self hosting is a lot better.
When you host on your own server(s), you can better fortify against attacks, don't install/disable everything you don't need to improve performance.

**TL;DR** Hosting on your own server is better, because you are alone and can do whatever you want. But you NEED to have good knowledge to do so!
