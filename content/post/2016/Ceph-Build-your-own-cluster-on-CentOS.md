---
title: 'Ceph: Build your own cluster on CentOS'
categories:
  - Ceph
tags: []
date: "2016-07-29T09:29:00+02:00"
description: 'Ceph is an object, a block and filesystem storage system.'
author: Alexander Trost
cover: /post/covers/Ceph_Logo_Stacked_RGB_120411_fa.png
---

Ceph is an object, a block and filesystem storage system.

As you can see from the Ceph.com visitors map [here](http://www.revolvermaps.com/?target=enlarge&i=1lzi710tj7s&color=80D2DC&m=0), people all around the world search for it. You can also see some metrics about the Ceph project at their metrics site [here](http://metrics.ceph.com/).

I'm going to go over the installation of a two node Ceph storage cluster.
You can then build on those storage nodes and choose multiple storage types you want to use.

I personally recommend to use at least two nodes even for a test cluster!

## Requirements

I assume that you have basic linux knowledge and at least two servers with CentOS7 up and running that can reach each other.

In my case my two example servers are having 2vCores and 4GB RAM. The OS used is CentOS7 (to be exact `CentOS Linux release 7.2.1511 (Core)`).
My examples servers for this tutorial have the following addresses:

* `203.0.113.1 ceph-tutorial-node1`
* `203.0.113.2 ceph-tutorial-node2`

_**Please note** the IPs used here are according to [RFC5737](https://tools.ietf.org/html/rfc5737)_

**You have to decide from what server you want to deploy your cluster.**
I use the first server `ceph-tutorial-node1` as the "deployment" server.

## Preparing your servers for Ceph

Let's begin first by adding the Epel and Ceph repository to all our used servers.
On all the servers we have, we need to add the Epel package repositories to the repository list.
The following commands add the Epel package repositories and the Epel repository verification key:

```console
sudo yum install -y yum-utils && sudo yum-config-manager --add-repo https://dl.fedoraproject.org/pub/epel/7/x86_64/
sudo yum install --nogpgcheck -y epel-release
sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
sudo rm /etc/yum.repos.d/dl.fedoraproject.org*
```

Now that our servers have the Epel repository added, we're finally going to add the Ceph repository.
Use your favorited editor to create a file `/etc/yum.repos.d/ceph.repo` and copy the following content into it:

```ini
[ceph-noarch]
name=Ceph noarch packages
baseurl=http://download.ceph.com/rpm-jewel/el7/noarch
enabled=1
gpgcheck=1
type=rpm-md
gpgkey=https://download.ceph.com/keys/release.asc
```

**Please note** You can replace `jewel` with the Ceph release version you want to install (current latest release is `jewel`) and `el7` with, depending on what CentOS version number you have, for example for CentOS7 it should be `el7` and for CentOS6 it should be `el6` (other CentOS versions don't have official rpm builds available and will not work!).

Now we have the Ceph repository in our repository list on all of our servers.
An important step is to configure NTP service on all servers to keep the time synchronized across the storage cluster, but I'm not going to cover this.
Other important things to make sure, before continuing with the tutorial:

* You should use an user with password less login and sudo without password rights on details how to create an user for that see [Ceph Preflight Docs](http://docs.ceph.com/docs/master/start/quick-start-preflight/#enable-password-less-ssh), but it is **not required**.
* Selinux needs to be set to `Permissive` during the installation process (Command to disable SElinux temporarly`sudo setenforce 0`).
* By default firewalld is in place on most CentOS servers, you either have to open the specific ports or just disable the firewall completely (for more details see [Ceph Preflight Docs](http://docs.ceph.com/docs/master/start/quick-start-preflight/#open-required-ports)).

## Preparing the Ceph deployment

Switch to your deployment server and install the Ceph deployment package `ceph-deploy` on the deployment server, in my case server `ceph-tutorial-node1`.
The first commands will update your package database and system. The second command will install the `ceph-deploy` package on your CentOS server:

```console
sudo yum clean all && sudo yum update
sudo yum install ceph-deploy
```

Still on the deployment server (in my case `ceph-tutorial-node1`) create a folder where files for the deployment will be stored. For example:

```console
mkdir ~/my-ceph-cluster
cd ~/my-ceph-cluster
```

## Deploying Ceph storage nodes

To generate the basic Ceph cluster configuration I run for my two servers:

```console
ceph-deploy new ceph-tutorial-node1 ceph-tutorial-node2
```

**Please note** Where ceph-tutorial-node1 is you deployment server.

Example output of the `ceph-deploy new ceph-tutorial-node1` command:

```ini
# ceph-deploy new ceph-tutorial-node1
[ceph_deploy.conf][DEBUG ] found configuration file at: /root/.cephdeploy.conf
[ceph_deploy.cli][INFO  ] Invoked (1.5.34): /usr/bin/ceph-deploy new ceph-tutorial-node1
[ceph_deploy.cli][INFO  ] ceph-deploy options:
[ceph_deploy.cli][INFO  ]  username                      : None
[ceph_deploy.cli][INFO  ]  func                          : <function new at 0x1cfb6e0>
[ceph_deploy.cli][INFO  ]  verbose                       : False
[ceph_deploy.cli][INFO  ]  overwrite_conf                : False
[ceph_deploy.cli][INFO  ]  quiet                         : False
[ceph_deploy.cli][INFO  ]  cd_conf                       : <ceph_deploy.conf.cephdeploy.Conf instance at 0x1d56710>
[ceph_deploy.cli][INFO  ]  cluster                       : ceph
[ceph_deploy.cli][INFO  ]  ssh_copykey                   : True
[ceph_deploy.cli][INFO  ]  mon                           : ['ceph-tutorial-node1']
[ceph_deploy.cli][INFO  ]  public_network                : None
[ceph_deploy.cli][INFO  ]  ceph_conf                     : None
[ceph_deploy.cli][INFO  ]  cluster_network               : None
[ceph_deploy.cli][INFO  ]  default_release               : False
[ceph_deploy.cli][INFO  ]  fsid                          : None
[ceph_deploy.new][DEBUG ] Creating new cluster named ceph
[ceph_deploy.new][INFO  ] making sure passwordless SSH succeeds
[ceph-tutorial-node1][DEBUG ] connected to host: ceph-tutorial-node1
[ceph-tutorial-node1][DEBUG ] detect platform information from remote host
[ceph-tutorial-node1][DEBUG ] detect machine type
[ceph-tutorial-node1][DEBUG ] find the location of an executable
[ceph-tutorial-node1][INFO  ] Running command: /usr/sbin/ip link show
[ceph-tutorial-node1][INFO  ] Running command: /usr/sbin/ip addr show
[ceph-tutorial-node1][DEBUG ] IP addresses found: ['203.0.113.1']
[ceph_deploy.new][DEBUG ] Resolving host ceph-tutorial-node1
[ceph_deploy.new][DEBUG ] Monitor ceph-tutorial-node1 at 203.0.113.1
[ceph_deploy.new][DEBUG ] Monitor initial members are ['ceph-tutorial-node1']
[ceph_deploy.new][DEBUG ] Monitor addrs are ['203.0.113.1']
[ceph_deploy.new][DEBUG ] Creating a random mon key...
[ceph_deploy.new][DEBUG ] Writing monitor keyring to ceph.mon.keyring...
[ceph_deploy.new][DEBUG ] Writing initial config to ceph.conf...
```

Running `ls`, we see the generated files in the directory:

```console
# ls
ceph.conf  ceph-deploy-ceph.log  ceph.mon.keyring
```

Now we need to add an option to the bottom of the default Ceph configuration file `ceph.conf`.

The options is:

```console
osd pool default size = 2
```

The option sets the number of replications, for two nodes you **have** tp set it to `2` else the Ceph cluster will not become healthy.
You can also add other options here, but as this is just a basic tutorial on how to create a Ceph cluster I'm not covering other options than the default.

Now that our Ceph configuration `ceph.conf` is ready we are going to install Ceph on all servers and create our initial cluster monitor.
The command for deploying Ceph onto my two servers and creating the monitor server on your server chosen above, in my case `ceph-tutorial-node1` the commands look like this:

```console
ceph-deploy install --no-adjust-repos ceph-tutorial-node1 ceph-tutorial-node2
ceph-deploy mon create-initial
```

**Errors** If the command fails, you need to apply a bug fix with the command `sed -i '78s/allow \*/allow/g' /usr/lib/python2.7/site-packages/ceph_deploy/gatherkeys.py`. The bug  can be seen [here](http://tracker.ceph.com/issues/16443)).

**Please note** If the last command exits with errors, check the connectivity of your servers and firewall between the servers (if a firewall is in place between the servers, make sure it allows the Ceph ports, ports: TCP Ceph mon(itor) 6789, Ceph OSDs 6800:7300 (for more information see [Ceph Preflight Docs](http://docs.ceph.com/docs/master/start/quick-start-preflight/#open-required-ports))).


## Creating the storage nodes

Use ssh to connect to your servers that you want to be storage nodes and create a directory for the storaged data.

In my case:

```console
ssh ceph-tutorial-node1
sudo mkdir /var/local/osd
exit

ssh ceph-tutorial-node2
sudo mkdir /var/local/osd
exit
```

Back on your deployment server (in my case `ceph-tutorial-node1`) we are going to prepare the storage nodes with the following command:

```console
ceph-deploy osd prepare {ceph-node}:/path/to/directory
```

For my two servers I run:

```console
ceph-deploy osd prepare ceph-tutorial-node1:/var/local/osd ceph-tutorial-node2:/var/local/osd
```

The `ceph-deploy osd prepare` prepares the storage location and sets up the Ceph OSD in the background.
The only thing we have to do now is to activate the storage locations (Ceph OSDs) using the activate command:

```console
ceph-deploy osd activate {ceph-node}:/path/to/directory
```

For my two servers I run:

```console
ceph-deploy osd activate ceph-tutorial-node1:/var/local/osd ceph-tutorial-node2:/var/local/osd
```

## Finalizing your Ceph cluster

Copy the Ceph admin key to the servers you want to be able to configure your Ceph cluster from with the below command:

```console
ceph-deploy admin {deployment-node}
```

**Please note** Where `{deployment-node}` is your server you ran all the commands on.

To check if you Ceph cluster is healthy use the health command:

```console
# ceph health
HEALTH_OK
```

**Please note** If it shows something else than `HEALTH_OK` your cluster is unhealthy and may not even work properly.

That's all. Now you have a working Ceph storage cluster.

## Troubleshooting
### Log file location

In case of other problems, all Ceph log files are located under `/var/log/ceph/`.

**Example**:

```console
# ls -hl /var/log/ceph/
total 340K
-rw------- 1 root root 126K Aug  8 13:24 ceph.log
-rw-r--r-- 1 root root 196K Aug  8 13:25 ceph-mon.ceph-tutorial-node1.log
-rw-r--r-- 1 root root 5.2K Aug  8 09:26 ceph-osd.0.log

```

### "Clock skew" error

If the health command returns a message like `clock skew detected`, then your clock on the server(s) is not synced. Please install and configure an NTP server and client(s).

## Summary

This should help you get started with installing/running a Ceph cluster on CentOS.
If you have issues, please refer to the official `ceph-deploy` documentation her: [ceph-deploy - Deploy Ceph with minimal infrastructure - ceph-deploy 2.0.0 documentation](http://docs.ceph.com/ceph-deploy/docs/) and [Ceph Deployment - Ceph Documentation](http://docs.ceph.com/docs/master/rados/deployment/).

Have Fun!
