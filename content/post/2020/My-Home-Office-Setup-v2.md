---
title: "My Home Office Setup v2"
toc: true
sitemap: true
comments: true
tags:
  - Home Office
  - Office
  - Computer
  - Workstation
  - Network
categories:
  - Real Life
author: Alexander Trost
description: "In this post I'm showing you my current gaming and home office setup."
date: 2020-01-10T11:58:26+01:00
cover: /post/2020/My-Home-Office-Setup-v2/work-desk.jpg
---

## It was time

Time to create an updated post of my improved home office setup.
Let's dive right into it.

## Table

The table is 1.60m (~5.24934 feet) long.

The cable management has been improved in comparsion to my previous setup post.
It can still be further improved but it is much better than before and I'm finally happy with it now.

{{< figure src="work-desk.jpg" title="Table / Desk Shot" width="700px" >}}

### Computers

#### Gaming

This compliments my "small" Steam library pretty well and the Valve Index headset which is pretty dope to use and play games on.

* CPU: Intel&copy; i7-7700k (4c/8t)
* Memory: 16GB DDR4-3000
* GPU: ASUS ROG STRIX RTX2080 Super A8G GAMING
* Network: Dual port 10G network card
* Disk(s):
  * 1x 500GB SATA SSD
  * 1x 3TB SATA HDD
  * 1x 4TB SATA HDD
* Case: be quiet! Silent Base 601 Midi-Tower

#### Workstation

The "heart" of working at home.

* CPU: AMD Ryzen 7 1800X (8c/16t)
* Memory: 32GB DDR4-2133
* GPU: 2x Radeon RX 560 OC 4G
* Network: Dual port 10G network card
* Disk(s):
  * 1x 500GB NVMe SSD
  * 1x 500GB SATA SSD
  * 4x 8TB HDDs
* Case: be quiet! Silent Base 601 Midi-Tower

> **NOTE**
>
> For version 3, I'm planning to upgrade the workstation to have at least 64GB, and a newer, bigger AMD processor. A AMD Threadripper would be nice.
> If it is affordable maybe even an AMD EPYC processor.
>
> New GPUs and 40G network card are on the list of potential improvements for version 3. Though new GPUs and network cards will probably "include" a AMD Threadripper + a fitting Motherboard.

### Monitors

* 4x [LG 29UM68-P 29" 21:9 UltraWide LED monitors](http://www.lg.com/us/monitors/lg-29UM68-P-ultrawide-monitor)
* 1x [Grundig 32 VLE 6220 BH 80 cm (32 Zoll)](https://amazon.de/Grundig-VLE-6220-Fernseher-Tuner/dp/B0092K3C6I)

A big shoutout to [Ricoo Medientechnik](https://www.ricoo.eu/) as their monitor stands are awesome and not too expensive!

I'm using the following monitor stands from Ricoo:

* 1x [Ricoo Monitor Stand TS3511 Table Mount for 2 Monitors (TS3011)](https://www.ricoo.eu/en/ricoo-pc-screen-led-monitor-stand-ts3511-table-mount-for-2-monitors-monitor-brackets-tft-swivel-arm-monitor-mount-pivoting-monitor-fastener-monitor-rack-monitor-arm-compatible-with-vesa-100x100/a-11189/)
* 2x Ricoo Desk Monitor Mount Arm (TS3011) (not available anymore, a newer model has been released)
* 1x [Ricoo Desk Monitor Mount Arm (TS9711)](https://www.ricoo.eu/monitor-tv-tischhalterung-haeoehenverstellbar-schwenkbar-neigbar-ts9711/a-11377/)
  * Note: It almost as good as the old TS3011 model. The thing that I would have wished for is to have an additional cable channel in the lower part of the arm.

### Audio

Moving on to the audio equipment, I use the following pieces for audio input and output control:

* Input
  * [Rode NT1-A Complete Vocal Recording](https://www.thomann.de/de/rode_nt1a_complete_vocal_recording.htm)
  * [Mackie ProFX10v3](https://mackie.com/products/profxv3-professional-effects-mixers-usb)
  * [DBX 286 S](https://www.thomann.de/de/dbx_286_s.htm) (Temporarily removed due to some audio issues)
  * [Mini 2(1)-IN-1(2)-OUT 3.5mm Stereo Audio Switcher Passive Selector Splitter Box MC102 - Nobsound](http://www.doukaudio.com/mini-21-in-12-out-35mm-stereo-audio-switcher-passive-selector-splitter-box-p0088.html)
* Output
  * [Numark M 4](https://www.thomann.de/gb/numark_m_4_black.htm) (The link is to the black edition, I have the grey one. I got it cheap from [Rockshop.de](https://www.rockshop.de/))

To "blast" music at the neighbors I have a very old 5.1 sound system, which sadly has a high level of noise when no sound is played.
I'll probably replace the sound system with something better and check if it is worth to go for some USB sound cards.

### Chair

A [noblechairs EPIC Gaming Stuhl - schwarz/gold](https://www.caseking.de/noblechairs-epic-gaming-stuhl-schwarz-gold-gagc-038.html) because your arse and back will thank you for it.

Pretty good chair, though if you want to spend more go for a more expensive one with, e.g., "limitless" backrest and more features.

## Home Automation (+ Lighting)

I'm using the awesome [Home Assistant](https://www.home-assistant.io/) to control the lights in all rooms of my apartment.
I also have temperature sensors and power measuring power plugs, etc to "keep an eye" on the apartment.

The following video is a demo of me cycling the color of the desk lights.

{{< video mp4="homeassistant-lightning-show.mp4" poster="/post/2020/My-Home-Office-Setup-v2/homeassistant-lightning-show.jpg" >}}

## Network

### Network Map

A network map showing the cable connections between the routers, switches, clients, etc.

<div class="fullwidthimg">
{{< figure src="homenetwork-diagram.png" title="Network Map Diagram (click image to enlarge)" width="500px" >}}
</div>

**Icon / Image Credits**:

* ["Raspberry Pi 4 Model B" diagram is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License by Jstrom99](https://commons.wikimedia.org/wiki/File:RaspberryPi_4_Model_B.svg)
* [Mikrotik Product Images / Icons](https://mikrotik.com/) are subject to Mikrotik's copyright.
* Other icons / diagrams are from [yEd Graph Editor by yworks](https://www.yworks.com/products/yed).

The Network Rack is shown in detail in the [next section below](#network-rack).

### Network Rack

The rack is 12 units (12U / 12HE) high and 600mm in depth.

I have added some Noctua fans to the top / "roof" of the track to have some air pushed into the rack. The fans are controlled by a NZXT Grid+ V3 (AC-GRDP3-M1; the [NZXT website](https://www.nzxt.com/) does not list it anymore..).

I'm a huge [Neon Genesis Evangelion and Evangelion Rebuilds](https://en.wikipedia.org/wiki/Neon_Genesis_Evangelion) fan so I put some cool stickers on the front.

<div class="fullwidthimg">
{{< figure src="network-rack-front-closed.jpg" title="Network Rack Front Shot (a slightly older picture than from the front overview below)" width="500px" >}}
</div>

The network rack provides up to 10G network and power to my PoE powered devices.

> **NOTE**
>
> Version 3 will probably have 40G network. The prices for used 40G network cards (and other equipment) are getting lower and lower every day.
> In addition to that I want to be able to monitor the power used by the equipment, which is definitely high on the list to have for version 3.

#### Rack Contents

* [the t.racks Power 8 S - thomann](https://www.thomann.de/intl/the_t_racks_power_8_s.htm)
* [Adam Hall 87551 Rack Tray 19" 1HE - thomann](https://www.thomann.de/intl/adam_hall_87551_ablage_19_1he.htm)
  * A few [Raspberry PIs](https://www.raspberrypi.org/)
    * Used for several tasks like Home automation, Security, Monitoring, etc.
* [Mikrotik RB4011iGS+RM](https://mikrotik.com/product/rb4011igs_rm)
* [Mikrotik CRS309-1G-8S+IN](https://mikrotik.com/product/crs309_1g_8s_in)
* [Mikrotik CRS112-8P-4S-IN](https://mikrotik.com/product/crs112_8p_4s_in)
* [1U 19" Cable Management Panel with 5 Detachable Plastic D-rings and Lacing Bar on the Blank Rackmount Fiber Patch Panel](https://www.fs.com/products/72910.html)
  * [6-Port FHD Multimedia Modular Panel with 6x Plastic Clips](https://www.fs.com/products/66602.html)
    * [Cat6 RJ45 (8P8C) Unshielded Coupler Keystone Insert Module](https://www.fs.com/de/products/41438.html)
  * [12 port LC Duplex, 24 Fibers OM4 Multimode FHD Fiber Adapter Panel](https://www.fs.com/de/products/41998.html)
* [OPNSense](https://opnsense.org/) Router / Firewall
* [Synology DiskStation DS413](https://www.synology.com/en-global/company/news/article/Synology_Presents_DiskStation_DS413)

The cables are mostly from [FS.COM GmbH](https://www.fs.com/). The "icing on the cake" is that some cables are custom lengths (e.g., 0.15-0.25m) so they fit just right and not have too much cable leftover.

<div class="fullwidthimg">
{{< figure src="network-rack-front.jpg" title="Network Rack Front Shot" width="500px" >}}
</div>

#### OPNSense Firewall / Router Specs

* CPU: Intel Celeron G4900
  * Fan: Noctua NH-L9x65 CPU-Kühler
* RAM: 2x Crucial Ballistix DDR4-2666 4GB
* Mainboard: Gigabyte B360N WIFI
* Network: Dual port 10G network card
* PSU: Kolink SFX-350
* Sorage:
  * 1x 260GB SSD
* Case: Kolink - Satellite Mini-ITX- / Micro-ATX-Gehäuse - schwarz

## Additional Equipment

From the [Network Rack](#network-rack) there is an empty "pipe" (German: Leerrohr) for cabling going through the wall and outside down to the basement.
The "pipe" holds fiber and coper cables inside, and "zip tied" to the outside of the "pipe" is a compressed air line to a compressor.

Having compressed air available for cleaning computers and other equipment is cool to have.

## Summary

Well, what is there to say? I beefed up my setup even further to be able to achieve more and have fun getting to know the new hardware.

Have Fun!
