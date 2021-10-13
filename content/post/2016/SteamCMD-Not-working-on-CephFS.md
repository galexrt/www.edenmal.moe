---
title: 'SteamCMD: Not working on CephFS'
date: "2016-07-26T18:30:53+02:00"
categories:
  - Ceph
tags:
  - SteamCMD
  - Analysis
description: 'A small and uncomplete analysis of why the SteamCMD is not working on CephFS.'
toc: false
author: Alexander Trost
---

_See title._

Yes, you read right. SteamCMD is not working on CephFS (and maybe GlusterFS too, I can't test it on GlusterFS ).
The reason for that is a "failing" `getdents` when on the CephFS.
A colleague told me that error may be related to the `st_size` and the `rbytes` of CephFS.

**`strace` on xfs filesystem**:

```console
[...]
[pid 123] stat64("./zip0.zip", 0xf71c9c40) = -1 ENOENT (No such file or directory)
[pid 123] open(".", O_RDONLY|O_NONBLOCK|O_LARGEFILE|O_DIRECTORY|O_CLOEXEC) = 2
[pid 123] fstat64(2, {st_mode=S_IFDIR|0755, st_size=100, ...}) = 0
[pid 123] getdents(2, /* 7 entries */, 32768) = 152
[pid 123] getdents(2, /* 0 entries */, 32768) = 0
[pid 123] close(2)
[...]
```

**`strace` on CephFS:**
```console
[...]
[pid 123] stat64("./zip0.zip", 0xf720ac40) = -1 ENOENT (No such file or directory)
[pid 123] open(".", O_RDONLY|O_NONBLOCK|O_LARGEFILE|O_DIRECTORY|O_CLOEXEC) = 2
[pid 123] fstat64(2, {st_mode=S_IFDIR|0755, st_size=5, ...}) = 0
[pid 123] getdents(2, 0xf7002114, 65536) = -1 EOVERFLOW (Value too large for defined data type)
[pid 123] close(2)
[...]
```

As you can see the `st_size` on the xfs filesystem reported is higher (`100`).
The third parameter (`unsigned int count` from `getdents` man page), comes as a result from the "weird" `st_size`, given to the `getdents()` function is lower `32768` than the int `65536` on the CephFS.

In C an `unsigned short int` can only be `65535` max, but `65536` got returned..

Next I tried to look into the `rbytes` that a colleague mentioned.
And guess what I found looking for a way to disable/fix/modify the `st_size` from CephFS.
I found out that the documented `rbytes` and for me interesting `norbytes` mount option.
When looking at the docs we see that both mount options are documented: http://docs.ceph.com/docs/hammer/man/8/mount.ceph/#options
I used GitHub's code search but the only occurrences I found are in the man page files.

I have directly created an issue at the Ceph's Bugtracker to see if it is an issue in my setup or really a missing feature in Ceph. For the interested here is the link to the issue: http://tracker.ceph.com/issues/16738.
