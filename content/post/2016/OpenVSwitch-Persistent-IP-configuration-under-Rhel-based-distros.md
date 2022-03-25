---
title: 'OpenVSwitch: Persistent IP configuration under Rhel based distros'
date: "2016-08-11T18:22:22+02:00"
tags:
  - Networking
  - OpenVSwitch
description: 'Persisting the interface IP configuration for OpenVSwitch interfaces/devices under Rhel based distros.'
author: Alexander Trost
cover: /post/2016/OpenVSwitch-Persistent-IP-configuration-under-Rhel-based-distros/Post_Title_Image.png
---

> **NOTE**
>
> This post is a follow up on my post [OpenVSwitch: Multi-Host Overlay Network](/2016/08/09/OpenVSwitch-Multi-Host-Overlay-Network/).
> The interface in this example is named `br0`. Change according to your interface.

## Preparing for using the interface configurations

To persist the configurations you can either use the NetworkManager or use good old network-scripts.
Here I'm going to show how it's done using the good old network-scripts.
First at all we have to disable the NetworkManager service with this command:

```command
systemctl disable NetworkManager.service
```

And enable the old fashioned `network.service` with:

```command
systemctl enable network.service
```
> **WARNING**
>
> You need to have properly configured network-scripts for your other "normal" interfaces too (like `enp3s0`) or else after a reboot the network connectivity to your server will not work correctly!!

We can now go on to creating the configuration for the OpenVSwitch bridges and ports.

## Creating configuration for an interface named obr0

> **NOTE**
>
> You should only need to persist IP configurations for bridge devices and not ports.

Create a file called `/etc/sysconfig/network-scripts/ifcfg-obr0`:

```variable
NAME="obr0"
DEVICE="obr0"
NM_CONTROLLED="yes"
ONBOOT="yes"
IPV6INIT=no
TYPE="OVSBridge"
DEVICETYPE="ovs"
MTU=1400
IPADDR=10.244.1.0
PREFIX=16
```

> **WDWD**
>
* `NAME="YOUR_INTERFACE_NAME"` - The name of the interface.
* `DEVICE="YOUR_DEVICE_NAME"` - The name of the interface.
* `NM_CONTROLLED="yes"` - The name of the interface.
* `ONBOOT="INTERFACE_NAME"` - If `yes`, the interface is created when the server boots. Should be `yes` in most cases.
* `IPV6INIT="INTERFACE_NAME"` - The name of the interface.
* `TYPE="OVSBridge"` - The type of the  interface (see [OpenVSwitch related configuration](#OpenVSwitch-related-configuration) for more info)
* `DEVICETYPE="ovs"` - The device type of the interface (see [OpenVSwitch related configuration](#OpenVSwitch-related-configuration) for more info).
* `MTU=YOUR_MTU` - The MTU of the interface (Only add this option if you know what you are doing).
* `IPADDR=YOUR_INTERFACE_IP_ADDRESS` - The name of the created interface.
* `PREFIX=YOUR_NETWORK_PREFIX` - The name of the created interface.

## OpenVSwitch related configuration

The following options/arguments are important when configuring OpenVSwitch created interfaces:

* `DEVICETYPE` - For a bridge interface use `OVSBridge` and for a port interface use `OVSPort`.
* `TYPE` - Always `ovs` for a OpenVSwitch interface.

## Summary

That's all you need to do, disable the `NetworkManager.service` and activate the good old `network` service.
