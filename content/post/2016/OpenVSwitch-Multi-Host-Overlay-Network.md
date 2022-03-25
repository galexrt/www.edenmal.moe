---
title: 'OpenVSwitch: Multi-Host Overlay Network'
date: "2016-08-09T09:25:51+02:00"
tags:
  - Networking
  - OpenVSwitch
description: 'Creating a mutli-host overlay network between two and more servers.'
author: Alexander Trost
cover: /post/2016/OpenVSwitch-Multi-Host-Overlay-Network/Post_Title_Image.png
coverbig: false
---

> **NOTE**
>
> This tutorial is written for Fedora but can be applied to all rhel based systems.
> The only "big" thing you would need to change is the package manager command from `dnf` to for example `yum`.

## What is OpenVSwitch

OpenVSwitch is a SDN application (Software defined networking) that allows you to create networks and switches on software level.

## Requirements

* At least two servers running Fedora 23 or higher (it may even work with Fedora 21 and higher, but it is not tested!).
* Root access to the servers.
* Network connectivity between the servers (the following protocols need to be allowed: `tcp`, `udp`, `gre`)

## Goals

The goal of the tutorial is to create an "overlay" network between two and more servers using OpenVSwitch.

***

## Step 1 - Installing OpenVSwitch

> **NOTE**
>
> Do this step on all servers.

To install OpenVSwitch on Fedora 24 we use the package manager `dnf`.
The command to install the OpenVSwitch package is:

```console
dnf install openvswitch
```

After the command has been successfully run, you now have OpenVSwitch installed.
First at all we have to start the OpenVSwitch service. To do that we use `systemctl` (more details on how to use systemctl can be seen [here]() *INSERT LINK TO COMMUNITY TUTORIAL*):

```console
systemctl start openvswitch.service
```
This starts the OpenVSwitch service.

> **WARNING**
>
> Don't enable the service yet because if you accidentally "kill" your network connection through OpenVSwitch, you can just reboot the server and the configuration will not be loaded.

## Step 2 - Creating the bridge interface

Now that you have OpenVSwitch installed and the service started, you can create the bridge interface.
The command for creating an OpenVSwitch bridge device is:

```console
ovs-vsctl add-br BRIDGE_NAME
```

When you want to create a bridge named `br0`, `BRIDGE_NAME` would be `br0`. You have now created your bridge interface.
To see your bridge interface use the `ip` command (the below output should be similar to yours):

```nohighlight
## ip link
[...]
4: br0: <BROADCAST,MULTICAST,,LOWER_UP> mtu 1500 qdisc noqueue state DOWN mode DEFAULT group default qlen 1
    link/ether xx:xx:xx:xx:xx:xx brd ff:ff:ff:ff:ff:ff
[...]
```

## Step 3 - Preparing for the GRE tunnels

You should now create a list of your servers and beginning from 0 a number for example like this:

```csv
server-1 0
server-2 1
server-3 2
[...]
server-8 7
server-9 8
```

The number behind the server name will be the tunnel interface number and needs to be the same on all servers when creating the meshed tunnel network.

> **NOTE** Save this list somewhere safe, it is very important when you later want to expand your network.

A list for three servers with the interface name and IP address written behind the lines:

```csv
server-1 0 gre0 IP: 1.1.1.1
server-2 1 gre1 IP: 2.2.2.2
server-3 2 gre2 IP: 3.3.3.3
```

Your server firewall should not block the GRE tunnel protocol traffic.
For iptables the protocol name is `gre`.
An example rule to allow all GRE tunnel protocol traffic:

```console
iptables -A INPUT -p gre -j ACCEPT
```

## Step 4 - Opening the GRE tunnels

Before creating the first GRE tunnels you should know that it will not make any sense if you have more than 3-4 servers to link all of them together. You should create a redundant mesh between your servers and not link all to all.

> **NOTE**
>
> Where `br0` in the commands is your bridge device. Please change it according to your bridge name.

Starting on your the first server (IP: `1.1.1.1`), we create the tunnel to the second and third server:

```console
ovs-vsctl add-port br0 gre1 -- set interface gre1 type=gre options:remote_ip=2.2.2.2
ovs-vsctl add-port br0 gre1 -- set interface gre2 type=gre options:remote_ip=3.3.3.3
```

On the second server (`2.2.2.2`) we now create the tunnel to the first and third server with the commands:

```console
ovs-vsctl add-port br0 gre0 -- set interface gre0 type=gre options:remote_ip=1.1.1.1
ovs-vsctl add-port br0 gre0 -- set interface gre2 type=gre options:remote_ip=3.3.3.3
```

On the third server (`3.3.3.3`) we create the tunnel back to the first and second server so the three server mesh is complete:

```console
ovs-vsctl add-port br0 gre0 -- set interface gre0 type=gre options:remote_ip=1.1.1.1
ovs-vsctl add-port br0 gre0 -- set interface gre1 type=gre options:remote_ip=2.2.2.2
```

## Step 5 - Adding IP addresses to the bridges

You can now add an extra field to the exisiting server list which contains the network range.
In the tutorial case the network will be `10.244.0.0/16` network, so the list looks like this:

```csv
server-1 0 gre0 IP: 1.1.1.1 Network: 10.244.1.0
server-2 1 gre1 IP: 2.2.2.2 Network: 10.244.2.0
server-3 2 gre2 IP: 3.3.3.3 Network: 10.244.3.0
```

> **NOTE**
>
> It is important to know what servers uses which IP address to avoid address conflicts.
> If you changed the CIDR of the network range from the tutorial, you also have to change the broadcast address in the below commands.

Now that you have decided what server has what network slice, we can set the interface up and add the IP addresses to the bridge on each server.
On the first server (`1.1.1.1`) the command would look like this:

```console
ip link set br0 up
ip addr add 10.244.1.0/16 broadcast 10.244.255.255 dev br0
```

On the second server (`2.2.2.2`) the command is slightly different due to the other address:

```console
ip addr add 10.244.2.0/16 broadcast 10.244.255.255 dev br0
```

And so on with different IP addresses per server.

## Step 6 - Checking the virtual network connectivity

Now that every server has it's own IP address in the virtual network, we can check the connectivity.
We are going to use the `ping` command for testing the connectivity between the servers.
From the first server (`1.1.1.1`) run:

```console
ping 10.244.2.0
```

If you should not receive a ping response in the next 10 seconds, it may be caused by a setting called `proxy_arp` in the `/sys` `net.ipv4` "category".

> **NOTE**
>
> Where `br0` in the command(s) is your bridge device. Please change it according to your bridge name.

```console
sysctl -w net.ipv4.conf.br0.proxy_arp=1
```

To persist this change you can run:

```console
echo "net.ipv4.conf.br0.proxy_arp=1" >> /etc/sysctl.conf
```

> **NOTE**
>
> The `/etc/sysctl.conf` file is loaded on every boot.

Now after that change, retry to ping and it now should work.

## Summary

As long as you build a good mesh between the servers the virtual network between the servers will be redundant.
But don't over do the mesh building between the servers. As mentioned earlier too many tunnels is too much.

Have Fun!
