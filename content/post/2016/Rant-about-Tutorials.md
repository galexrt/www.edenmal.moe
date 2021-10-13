---
title: Rant about Tutorials
toc: false
categories:
  - Rant
date: "2016-03-26T14:14:00+02:00"
author: Alexander Trost
description: 'A "rant" about overall and bad Tutorials.'
---

A "rant" about overall and bad Tutorials.
_Please keep in mind, this is my first ever rant._

***

{{< figure src="meme-brace-yourselfes-a-rant-is-coming.png" width="900px" title="Meme: Brace Yourselfes a rant is coming - Made with Imgur Meme Generator" >}}

_Tutorials are good, when they are made good. Same goes for rants.._

> **Quote from Wikipedia**:
> A tutorial is a method of transferring knowledge and may be used as a part of a learning process. More interactive and specific than a book or a lecture, a tutorial seeks to teach by example and supply the information to complete a certain task.
> -- [Tutorial - Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Tutorial)

***

So let's begin. The other day, someone reached out to me asking for help about one of my projects on github. To make it short, the problem was "He can't connect from within a container to a service running on the same host, to it's public ip".
To make it a bit more clear, here as an awesome ASCII sketch, created using [ASCIIFlow Infinity](http://asciiflow.com/) (BTW this is an awesome tool):

```text
+--------------------+
| Server 192.0.2.123 |
|                    |
| +------------+     |
| |            |     |
| | Container  +----------+
| | 172.17.0.2 |     |    |
| |            |     |    |
| +------------+     |    X
|                    |    X <- No connectivity
| +--------------+   |    X
| |              |   |    |
| | Service :80  |   |    |
| | 192.0.2.123  <--------+
| |              |   |
| +--------------+   |
|                    |
+--------------------+
```

I never encountered a problem like this. But from "common" Docker "problems", I encountered yet, most of them are caused by "outdated" kernels, bad network interface configuration, overlapping ip routes (mostly in big corporate networks) or a small forgotten setting.

Up to today, I couldn't really help finding the reason for the connectivity problems, because the person experiencing the problems, had no clue on how to provide required informations (like kernel version, hostname, etc.).

That's the point where the rant begins (hope it's not going to be to short).

It seems that the person started, like me with a knowledge of a  typical Windows "gamer" (aka "Windows Potato"). Meaning you know how to install windows programs, destroy your own system and maybe even a bit more.

When you then decide to look at Linux servers, most people begin to go from tutorial to tutorial, from "How to setup an Apache webserver" to "How to setup an iptables firewall". But there are a lot of people that do it like this, but "f*ck up" the part of "learning" on your own. If for example we take a tutorial about "How to setup an Apache webserver", the command `apt-get ...` is used. Most people just execute the command, read the text and later may know, in the best case, "This command is used for installing packages".

Most people just execute the commands without having ANY knowledge what the command does to their system. Yes a tutorial shows you things you don't know yet, so you can't know exactly what every command does, but you have to get your ass up before executing any commands, you don't know if there's a part or command in the tuorial you don't understand, get to know what that command does better, before running it.

For example aliases. I would never recommend a new linux user to use aliases. There's a simple reason for "Why?". The alias `adu` (from the `oh-my-zsh` debian plugin) stands for `apt-get update && apt-get upgrade`, nothing to big, but already two commands a new linux user may wouldn't learn fully, while using linux. Most new linux users, are a bit "lazy" (aka the "Ubuntu Potato" user).

Aliases are evil for ~~all~~ new users.

With tutorials it's a bit like with aliases. An aliases is in someway a shortcut to one or more commands. A tutorial is a shortcut to get knowledge fast, but not on long term.

A good tutorial, should explain every command used in depth (at least one sentence per command). When a command is used, for example to run a Docker container (`docker run ...`), a good tutorial would also show how to stop the container and try to show more than just to start and stop the container.
Tutorials need to be more in a common way. Meaning to show commands more like `docker stop CONTAINER_NAME` and then show how to get the name of containers and so on.

But that's just my two cents.

> **TL;DR** Tutorials need to explain every step and thing in detail and the reader needs to read everything before doing stuff or executing commands.

***

Please keep in mind, that this is my opinion on this topic.
