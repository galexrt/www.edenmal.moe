---
title: SRCDS Server Restarter Script
tags:
  - Perl
  - SRCDS Server
  - Gamserver
description: SRCDS Server Restarter Script - Automatically restarts freezed/crashed SRCDS servers. Using only a Perl script and a Cronjob.
date: "2016-04-30T15:41:02+02:00"
toc: false
author: Alexander Trost
---

The script uses the `Net::SRCDS::Queries` Perl module by Author [MASANORIH](https://metacpan.org/author/MASANORIH) to communicate with the SRCDS servers.

It checks if the servers responds to Source Server Queries, when the server does not respond to the queries, the script considers the server as unreachable/offline.
When the server is considered unreachable/offline, the script uses normal bash commands to write a line with `unreachable` into a file.
After the script wrote the line to the file it checks how many lines with `unreachable` have been written to the file.
If five lines or more have been written to the file, the configured restart script/commands will be executed.

That's all the script does. Simple but effective, right? :D

> Please check the [galexrt/gameserver-scripts](https://github.com/galexrt/gameserver-scripts) repository for the latest version of the script. In the directory of the repo in `srcds-restarter/`.
