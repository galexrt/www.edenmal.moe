---
title: 'Container Linux: Deploy on Bare-Metal without DHCP server'
description: 'This is more of a quick writeup in form of a note on how to deploy Container Linux on bare-metal without DHCP server.'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2017-08-31T19:41:04+02:00"
tags:
  - Container
  - 'Container Linux'
  - 'Bare Metal'
cover: /post/covers/Container_Linux_Logo.png
---

## Intro

This post shows you how you can run Container Linux without a DHCP server configured for custom iPXE boot.

### Clarification

Thanks to [Baju Judiantara](https://disqus.com/by/judiantara/) for his [comment](http://disq.us/p/1p8dqa7)!
He correctly found that the title is contradict to the IPXE boot script in [Step 4 - Add grub config for iPXE boot](#Step-4-Add-grub-config-for-iPXE-boot).
To resolve the conratdict of the title with the post I have added a snippet which does the interface configuration manual and not over DHCP.

## Step 1 - Setup Matchbox

I will not go over this here, as the CoreOS documentation about this is pretty good, see here: [coreos/matchbox Documentation - Getting Started](https://github.com/coreos/matchbox/blob/master/Documentation/getting-started.md#matchbox).
At least for my I did something like this:

* Download and install matchbox (the way to run Matchbox as a Docker container be seen below).
* Create `/var/lib/matchbox/assets` and `/etc/matchbox` directory (`mkdir -p /var/lib/matchbox/assets /etc/matchbox`).
* Git clone the Matchbox repository `https://github.com/coreos/matchbox.git` (`git clone https://github.com/coreos/matchbox.git`).
* Enter the cloned Matchbox repository.
* Generate certificates with the `./scripts/tls/cert-gen` script from the Matchbox repository (enter the `scripts/` directory before execution).
* Download Container Linux with the `./scripts/get-coreos` script from the Matchbox repository (enter the `scripts/` directory before execution).
    * An example to download Container Linux stable version `1465.7.0`: `./scripts/get-coreos stable 1465.7.0 /var/lib/matchbox/assets`
* (When Docker is used to run Matchbox) Run matchbox, with the following `docker run` command.

The `docker run` command I used looked like this:
```console
$ docker run \
    --net=host \
    -d \
    -v /var/lib/matchbox:/var/lib/matchbox:Z \
    -v /etc/matchbox:/etc/matchbox:Z,ro \
    quay.io/coreos/matchbox:latest \
    -address=0.0.0.0:8080 \
    -rpc-address=0.0.0.0:8081 \
    -log-level=debug
```

## Step 2 - Reboot the servers into a Resuce system

The title says it all, reboot all the servers you want to run Container Linux on into a rescue/recovery system based on Linux.

## Step 3 - (Optional) clear the disks yourself to prevent bootloader "issues"

> **NOTE**
>
> Replace `/dev/sda` with the disk in your server(s). This needs to be done in this and the next steps that work with the disk(s).

This is more of a "brute force" to clear the disks completely.
First two commands disable and "remove" LVM devices. `umount` to unmount the disk's partitions and `mdadm` to zero the disks (`/dev/sd{a,b}`) superblocks so no mdadm RAID is detected. The `dd` additionally clears the first 10M of the disk, this is more than just the partition table and MBR, but I personally like to simply erase a bit more just in case.. The end runs `cgpt` to "repair" the disks GPT tables, this fixed issues with Container Linux having trouble creating the partitions during the installation process for me.

```console
lvscan 2>/dev/null | awk '{print "lvremove -f "$2}' | sh
vgremove 2>/dev/null
mdadm --stop --scan
umount /dev/sda[1-9] 2>/dev/null
mdadm --zero-superblock /dev/sda
dd if=/dev/zero of=/dev/sda bs=10M count=10
cgpt repair /dev/sda
```

If you are on a Debian based resuce/recovery system, you need to install `cgpt` you can do this by running:

```console
apt-get update
apt-get install -y cgpt
```

## Step 4 - Add grub config for iPXE boot

The following commands do the following:

1. "Zap"/Clear the disk `/dev/sda` just in case again.
```console
sgdisk --zap-all --clear /dev/sda >/dev/null
```
2. Create a BIOS boot partition (size ~4096M) on the disk.
```console
sgdisk --new 1:2048:4095 -c 1:"BIOS Boot Partition" -t 1:ef02 /dev/sda >/dev/null
```
3. Create a partition for "data" which will be used for the grub configs.
```console
sgdisk --new 2:4096:500M -c 2:"Linux Boot Partition" /dev/sda >/dev/null
```
4. The next three commands, format the data partition with `ext2`, create the mount target directory and mount the data partition to `/boot`.
```console
mkfs.ext2 -F -q /dev/sda2
mkdir /boot
mount -t ext2 /dev/sda2 /boot
```

Next up is to add a `menuentry` for iPXE boot to a file named `/boot/grub2/grub.cfg`. But first the folder structure needs to be created with a simple `mkdir /boot/grub2`.
The content in the code block needs to be put in the `grub.cfg` in the given path:

```c
menuentry "Network boot (iPXE)" {
    linux16 /ipxe.lkrn
    initrd16 /matchbox.ipxe
}
```
After creating the `grub.cfg` we need to install grub to the disk.
This can be done via (for `/dev/sda`):

```console
grub-install --no-floppy /dev/sda
```

Download ipxe.lkrn from boot.ipxe.org to `/boot`: https://boot.ipxe.org/ipxe.lkrn. This can be done by curl or wget whatever you prefer.
An example with `curl` looks like this:

```console
curl -L https://boot.ipxe.org/ipxe.lkrn -o /boot/ipxe.lkrn
```

Now that grub and the iPXE "loader" is installed, we just need to tell grub what to "handover" to the iPXE "loader".
For that we add a file named `matchbox.ipxe` to the `/boot` directory. The file content looks like this:

Even though the title says "without DHCP server", if you should "only" have the issue that you are not allowed to boot (custom) IPXE over your DHCP server, but are using DHCP for address configuration checkout the second snippet below.

For manual interface configuration in IPXE can be done like this:

```console
#!ipxe

# set IP of first interface
set net0/ip 192.168.0.100
# set netmask of first interface
set net0/netmask 255.255.255.0
# set gateway of first interface
set net0/gateway 192.168.0.1
# set dns to google ns a
set dns 8.8.8.8

chain http://matchbox.example.net:8080/boot.ipxe
```

More info on IPXE `set` command, can be found here: [iPXE - open source boot firmware \[cmd:set\]](http://ipxe.org/cmd/set).

If you use a DHCP server for address configuration, you can try using this snippet:
(This is useful for public cloud providers which don't allow custom IPXE chains)

```console
#!ipxe

dhcp
# set dns to google ns a
set dns 8.8.8.8
# enable the first network interface
ifopen net0
# call the Matchbox server for the next iPXE steps
chain http://matchbox.example.net:8080/boot.ipxe
```
Replace `matchbox.example.net:8080` with your Matchbox server address/IP.

> **NOTE**
>
> Don't reboot the servres yet! Wait with the rebooting until we have configured a Matchbox profile in [Step 5 - Create a profile and group for Container Linux for the Deployment](#Step-5-Create-a-profile-and-group-for-Container-Linux-for-the-Deployment).

## Step 5 - Create a profile and group for Container Linux for the Deployment

For this please take a look at the examples provided in the Matchobx repository, which can be seen here: [GitHub CoreOS Matchbox - Examples Folder](https://github.com/coreos/matchbox/tree/master/examples).
If you need help by that the full documentation, can be found here: [Matchbox latest documentation](https://coreos.com/matchbox/docs/latest).

Don't forget to add your own SSH key to the profile or else [Step 7 - Connect to a server by SSH](Step-7-Connect-to-a-server-by-SSH) won't work for you.

An basic example profile for running Container Linux on all servers:

```json
{
    "id": "coreos",
    "name": "Simple CoreOS Container Linux catch-all profile",
    "ignition_id": "coreos-install.yaml.tmpl",
    "boot": {
        "kernel": "/assets/coreos/1465.7.0/coreos_production_pxe.vmlinuz",
        "initrd": [
            "/assets/coreos/1465.7.0/coreos_production_pxe_image.cpio.gz"
        ],
        "args": [
            "coreos.config.url=http://matchbox.example.net:8080/ignition?uuid=${uuid}\u0026mac=${mac:hexhyp}",
            "coreos.first_boot=yes",
            "console=tty0",
            "console=ttyS0"
        ]
    }
}
```

(This is an slightly altered example taken from here: [GitHub coreos/matchbox: examples/profiles/simple/default.json](https://github.com/coreos/matchbox/blob/master/examples/profiles/simple/default.json)).

Replace `1465.7.0` with the chosen Container Linux version and also as earlier replace `matchbox.example.net:8080` with your Matchbox server address/IP.

A catch-all/wildcard group looks like this:

```json
{
	"id": "coreos-catch-all",
	"profile": "coreos",
	"metadata": {
		"ssh_authorized_key": "ssh-rsa [...]"
	}
}
```

(This is an slightly altered example taken from here: [GitHub coreos/matchbox: examples/groups/simple/default.json](https://github.com/coreos/matchbox/blob/master/examples/groups/simple/default.json)).

The profiles go into the `/var/lib/matchbox/profiles` and the groups into `/var/lib/matchbox/groups` directory.

## Step 6 - Reboot the servers

As the title suggests reboot your servers.
When you now have rebooted your servers, you should see some activity in the Matchbox server ("access") log.
To view the logs of Matchbox when running in Docker with the command in [Step 1 - Setup Matchbox](#Step-1-Setup-matchbox)

```console
[...]
time="2017-09-09T14:43:26Z" level=debug msg="Matched an Ignition or Container Linux Config template" group=coreos-install-container-linux-node01 labels=map[mac:XX-XX-XX-XX-XX-XX uuid:[...]] profile=coreos-install
time="2017-09-09T14:43:30Z" level=info msg="HTTP GET /ignition?uuid=[...]&mac=XX-XX-XX-XX-XX-XX"
[...]
```

(Where `coreos-install` is the name of the profile you created)

## Step 7 - Connect to a server by SSH

Again just what the title says. Just connect to one of your servers with username `core` over SSH (port 22).

## Summary

For questions about the post, please leave a comment below or send me an email, thanks!

Have Fun!
