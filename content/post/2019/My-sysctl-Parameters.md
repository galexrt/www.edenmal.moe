---
title: "My Sysctl Parameters"
author: "Author Name"
description: 'These are the sysctl settings I deploy on most of my machines.'
cover: /post/2019/My-sysctl-Parameters/cover.png
categories:
  - Linux
tags:
  - sysctl
  - Tuning
date: 2019-02-18T08:15:20+01:00
---

These are the sysctl settings I deploy on most of my machines.
The "machines" I am speaking of here, are "always" assumed to have at least the following "hardware" (it shouldn't really matter if it is actual metal or virtual machine):

* CPU: Quad or more Core
* RAM: 32GB or more memory
* Network: 1Gbit/s

> **NOTE**
>
> For "thiccer wires", one does simply increase the `net.*mem` parameters.
>
> **NOTE**
>
> I'm using parts of these paramters for machines smaller than the given "specs" too, but then modified a bit accordingly.

If you have comments and/or tips about the parameters, feel free to comment them below.

I will add description and/or reasoning for some of the sysctl parameter "groups" over time below the whole list.

<details>
    <summary>Full list of my sysctl parameters, ready for copy'n'paste - <b>Click to expand</b></summary>
```ini
fs.aio_max_nr = 1048576
fs.file_max = 2097152
fs.inotify.max_user_instances = 5120
fs.inotify.max_user_watches = 1572864
fs.nr_open = 3145728
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
fs.suid_dumpable = 0
kernel.core_uses_pid = 1
kernel.dmesg_restrict = 1
kernel.exec-shield = 1
kernel.kptr_restrict = 1
kernel.yama.ptrace_scope = 2
kernel.panic = 10
kernel.panic_on_oops = 1
kernel.pid_max = 4194303
kernel.randomize_va_space = 2
kernel.sched_autogroup_enabled = 0
kernel.sched_migration_cost = 5000000
kernel.sysrq = 0
net.core.default_qdisc = fq
net.core.netdev_budget = 600
net.core.netdev_max_backlog = 65536
net.core.optmem_max = 2048000
net.core.rmem_max = 2048000
net.core.somaxconn = 65536
net.core.wmem_max = 2048000
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.all.bootp_relay = 0
net.ipv4.conf.all.forwarding = 1
net.ipv4.conf.all.igmpv2_unsolicited_report_interval = 10000
net.ipv4.conf.all.igmpv3_unsolicited_report_interval = 1000
net.ipv4.conf.all.ignore_routes_with_linkdown = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.all.proxy_arp = 0
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.all.secure_redirects = 1
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.default.forwarding = 1
net.ipv4.conf.default.log_martians = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.default.secure_redirects = 1
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.lo.accept_source_route = 1
net.ipv4.fwmark_reflect = 0
net.ipv4.icmp_echo_ignore_all = 0
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1
net.ipv4.icmp_msgs_burst = 50
net.ipv4.icmp_msgs_per_sec = 1000
net.ipv4.ip_forward = 1
net.ipv4.ipfrag_secret_interval = 600
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.neigh.default.gc_thresh1 = 4048
net.ipv4.neigh.default.gc_thresh2 = 6144
net.ipv4.neigh.default.gc_thresh3 = 8192
net.ipv4.netfilter.nf_conntrack_generic_timeout = 300
net.ipv4.netfilter.nf_conntrack_tcp_timeout_time_wait = 60
net.ipv4.tcp_congestion_control = bbr
net.ipv4.tcp_fin_timeout = 10
net.ipv4.tcp_keepalive_intvl = 25
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_keepalive_time = 420
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.tcp_max_tw_buckets = 160000
net.ipv4.tcp_moderate_rcvbuf = 1
net.ipv4.tcp_no_metrics_save = 1
net.ipv4.tcp_notsent_lowat = 16384
net.ipv4.tcp_rfc1337 = 1
net.ipv4.tcp_rmem = 4096 87380 8388608
net.ipv4.tcp_sack = 1
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_synack_retries = 3
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_timestamps = 1
net.ipv4.tcp_tw_recycle = 0
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_wmem = 4096 87380 8388608
net.ipv4.udp_rmem_min = 8192
net.ipv4.udp_wmem_min = 8192
net.ipv4.vs.conntrack = 1
net.ipv4.vs.conn_reuse_mode = 1
net.ipv4.vs.expire_nodest_conn = 1
net.ipv4.vs.sloppy_tcp = 1
net.ipv6.conf.all.accept_ra = 0
net.ipv6.conf.all.accept_ra_defrtr = 0
net.ipv6.conf.all.accept_ra_pinfo = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.all.forwarding = 1
net.ipv6.conf.default.accept_redirects = 0
net.ipv6.conf.default.accept_source_route = 0
net.ipv6.conf.default.autoconf = 1
net.ipv6.conf.default.forwarding = 1
net.ipv6.conf.default.max_addresses = 16
net.ipv6.ip6frag_secret_interval = 600
net.ipv6.route.max_size = 16384
net.ipv6.xfrm6_gc_thresh = 32768
net.netfilter.nf_conntrack_expect_max = 2048
net.netfilter.nf_conntrack_max = 1024000
net.netfilter.nf_conntrack_tcp_timeout_established = 600
net.nf_conntrack_max = 1024000
vm.overcommit_memory = 1
vm.overcommit_ratio = 20
vm.panic_on_oom = 0
```
</details>

## `fs`

* `fs.aio_max_nr = 1048576`
* `fs.file_max = 2097152` Increase maximum file descriptors on kernel level, see [https://serverfault.com/a/122682/367169](https://serverfault.com/a/122682/367169). **SPOILER** You still need to set `ulimits` for "normal" users.
* `fs.inotify.max_user_instances = 5120`
* `fs.inotify.max_user_watches = 1572864`
  * The `fs.inotify.max_user_*` values have been increased as it seems in some Kubernetes clusters there have been issues in regards to flexvolume plugin (possibly also CSI as they also place drivers on the hosts and CSI and/or kubelet are (inotify) watching for them).
* `fs.nr_open = 3145728`
* `fs.protected_hardlinks = 1`
* `fs.protected_symlinks = 1`
* `fs.suid_dumpable = 0` Restrict core dumps.

## `kernel`

* `kernel.core_uses_pid = 1`
* `kernel.dmesg_restrict = 1` Disables `dmesg` for containers without the needed `CAP_SYSLOG` capability and obviously with that non-root users on the host.
* `kernel.exec-shield = 1` Only available on RedHat Enterprise Linux OS.
* `kernel.kptr_restrict = 1` Only allow access to kernel symbol adresses for users with `CAP_SYSLOG` capability.
* `kernel.yama.ptrace_scope = 1` Restrict `ptrace` to parent processes (0 any process with same uid, 1 only parent process, 2 users with `CAP_SYS_PTRACE`, 3 noone can ptrace reboot required to allow `ptrace` again).
* `kernel.panic = 10` Reset the machine on kernel panic after 10 seconds.
* `kernel.panic_on_oops = 1` Cause a kernel panic when a kernel BUG / "Oops" is encountered.
* `kernel.pid_max = 4194303` Increase maximum PID because we are running many containers with many processes (could be set lower, but here just in case so many processes are being run and/or PIDs are "never" going to "overlap").
* `kernel.randomize_va_space = 2`
* `kernel.sched_autogroup_enabled = 0`

    > The migration cost should be increased, almost universally on server
    > systems with many processes. This means systems like PostgreSQL or
    > Apache would benefit from having higher migration costs.
    >
    > \- [PostgreSQL: Two Necessary Kernel Tweaks for Linux Systems](https://www.postgresql.org/message-id/50E4AAB1.9040902@optionshouse.com).

    We have many processes because of containers which are potentially spawned in a manner that would "cause" processes to be "choked out of CPU cycles in favor of less important tasks", so disable it.
* `kernel.sched_migration_cost = 5000000`

    > It basically groups tasks by TTY so perceived responsiveness is improved.
    > But on server systems, large daemons like PostgreSQL are going to be
    > launched from the same pseudo-TTY, and be effectively choked out of CPU
    > cycles in favor of less important tasks.
    >
    > \- [PostgreSQL: Two Necessary Kernel Tweaks for Linux Systems](https://www.postgresql.org/message-id/50E4AAB1.9040902@optionshouse.com).

    Many containers most of the time, depending on the workload, also mean many processes, though it is set not too high as suggested in the PostgreSQL mailing thread.
* `kernel.sysrq = 0` Limit

## `net`

### `core`

* `net.core.default_qdisc = fq` Good for HTTP/2, see [Cloudflare - Optimizing HTTP/2 prioritization with BBR and tcp_notsent_lowat](https://blog.cloudflare.com/http-2-prioritization-with-nginx/).
* `net.core.netdev_max_backlog = 65536`
* `net.core.optmem_max = 2048000`
* `net.core.rmem_max = 2048000`
* `net.core.somaxconn = 65536`
* `net.core.wmem_max = 2048000`

### `ipv4`

* `net.ipv4.conf.all.accept_redirects = 0`
* `net.ipv4.conf.all.accept_source_route = 0`
* `net.ipv4.conf.all.bootp_relay = 0` Disable Bootstrap protocol, as it is superseded by DHCP.
* `net.ipv4.conf.all.forwarding = 1` Allow forwarding of traffic on "all" interfaces (needed for containers).
* `net.ipv4.conf.all.igmpv2_unsolicited_report_interval = 10000`
* `net.ipv4.conf.all.igmpv3_unsolicited_report_interval = 1000`
* `net.ipv4.conf.all.ignore_routes_with_linkdown = 0`
* `net.ipv4.conf.all.log_martians = 1` Log all packets for "all" interfaces that are going to so called [martians addresses](https://serverfault.com/questions/570980/what-is-the-usefulness-of-logging-of-martians-packet-e-g-net-ipv4-conf-all-lo).
* `net.ipv4.conf.all.proxy_arp = 0`
* `net.ipv4.conf.all.rp_filter = 1`
* `net.ipv4.conf.all.secure_redirects = 1`
* `net.ipv4.conf.all.send_redirects = 0`
* `net.ipv4.conf.default.accept_redirects = 0`
* `net.ipv4.conf.default.accept_source_route = 0`
* `net.ipv4.conf.default.forwarding = 1` Allow forwarding of traffic by default for (new) interfaces (needed for containers).
* `net.ipv4.conf.default.log_martians = 1` Log all packets by default for (new) interfaces that are going to so called [martians addresses](https://serverfault.com/questions/570980/what-is-the-usefulness-of-logging-of-martians-packet-e-g-net-ipv4-conf-all-lo).
* `net.ipv4.conf.default.rp_filter = 1`
* `net.ipv4.conf.default.secure_redirects = 1`
* `net.ipv4.conf.default.send_redirects = 0`
* `net.ipv4.conf.lo.accept_source_route = 1`
* `net.ipv4.fwmark_reflect = 0` Don't set fwmark on kernel generated reply packets, see [sysctl-explorer.net - net.ipv4.fwmark_reflect](https://sysctl-explorer.net/net/ipv4/fwmark_reflect/).
* `net.ipv4.icmp_echo_ignore_all = 0`
* `net.ipv4.icmp_echo_ignore_broadcasts = 1`
* `net.ipv4.icmp_ignore_bogus_error_responses = 1` Ignore bogus responses (don't log it in the kernel logs).
* `net.ipv4.icmp_msgs_burst = 50`
* `net.ipv4.icmp_msgs_per_sec = 1000`
* `net.ipv4.ip_forward = 1`
* `net.ipv4.ipfrag_secret_interval = 600`
* `net.ipv4.ip_local_port_range = 1024 65535` Increase the per IP "dynamic" port limit (e.g., used for (S|D)NAT).
* `net.ipv4.neigh.default.gc_thresh1 = 4048`
* `net.ipv4.neigh.default.gc_thresh2 = 6144`
* `net.ipv4.neigh.default.gc_thresh3 = 8192`
* `net.ipv4.netfilter.nf_conntrack_generic_timeout = 300`
* `net.ipv4.netfilter.nf_conntrack_tcp_timeout_time_wait = 60`
* `net.ipv4.tcp_congestion_control = bbr` Good for HTTP/2, see [Cloudflare - Optimizing HTTP/2 prioritization with BBR and tcp_notsent_lowat](https://blog.cloudflare.com/http-2-prioritization-with-nginx/).
* `net.ipv4.tcp_fin_timeout = 10`
* `net.ipv4.tcp_keepalive_intvl = 25`
* `net.ipv4.tcp_keepalive_probes = 5`
* `net.ipv4.tcp_keepalive_time = 420`
* `net.ipv4.tcp_max_syn_backlog = 4096`
* `net.ipv4.tcp_max_tw_buckets = 160000`
* `net.ipv4.tcp_moderate_rcvbuf = 1`
* `net.ipv4.tcp_no_metrics_save = 1`
* `net.ipv4.tcp_notsent_lowat = 16384` Good for HTTP/2, see [Cloudflare - Optimizing HTTP/2 prioritization with BBR and tcp_notsent_lowat](https://blog.cloudflare.com/http-2-prioritization-with-nginx/).
* `net.ipv4.tcp_rfc1337 = 1`
* `net.ipv4.tcp_rmem = 4096 16384 8388608`
* `net.ipv4.tcp_sack = 1`
* `net.ipv4.tcp_slow_start_after_idle = 0`
* `net.ipv4.tcp_synack_retries = 3`
* `net.ipv4.tcp_syncookies = 1`
* `net.ipv4.tcp_syn_retries = 2`
* `net.ipv4.tcp_timestamps = 1`
* `net.ipv4.tcp_tw_recycle = 0`
* `net.ipv4.tcp_tw_reuse = 1`
* `net.ipv4.tcp_window_scaling = 1`
* `net.ipv4.tcp_wmem = 4096 16384 8388608`
* `net.ipv4.udp_rmem_min = 8192`
* `net.ipv4.udp_wmem_min = 8192`
* `net.ipv4.vs.conntrack = 1` Enable IPVS connection tracking.
* `net.ipv4.vs.conn_reuse_mode = 1`
* `net.ipv4.vs.expire_nodest_conn = 1`
* `net.ipv4.vs.sloppy_tcp = 1`

### `ipv6`

* `net.ipv6.conf.all.accept_ra = 0`
* `net.ipv6.conf.all.accept_ra_defrtr = 0`
* `net.ipv6.conf.all.accept_ra_pinfo = 0`
* `net.ipv6.conf.all.accept_redirects = 0`
* `net.ipv6.conf.all.accept_source_route = 0`
* `net.ipv6.conf.all.forwarding = 1` Allow forwarding of traffic on "all" interfaces (needed for containers).
* `net.ipv6.conf.default.max_addresses = 16`
* `net.ipv6.conf.default.accept_redirects = 0`
* `net.ipv6.conf.default.accept_source_route = 0`
* `net.ipv6.conf.default.autoconf = 1`
* `net.ipv6.conf.default.forwarding = 1` Allow forwarding of traffic by default for (new) interfaces (needed for containers).
* `net.ipv6.fwmark_reflect = 0` Don't set fwmark on kernel generated reply packets, see [sysctl-explorer.net - net.ipv4.fwmark_reflect](https://sysctl-explorer.net/net/ipv4/fwmark_reflect/).
* `net.ipv6.ip6frag_secret_interval = 600`
* `net.ipv6.route.max_size = 16384`
* `net.ipv6.xfrm6_gc_thresh = 32768`

### `netfilter` and `nf_conntrack_max`

* `net.netfilter.nf_conntrack_expect_max = 4096`
* `net.netfilter.nf_conntrack_max = 1024000`
* `net.netfilter.nf_conntrack_tcp_timeout_established = 600`

## `vm`

* `vm.max_map_count = 262144` If you run Elasticsearch one requirement for the preflight checks to pass, see [Elasticsearch Documentation Reference - Virtual memory](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html).
* `vm.overcommit_memory = 1` Enable memory overcommitment.
* `vm.overcommit_ratio = 20` How much percent of the total (physical) memory will be allowed to be overcommitet.
* `vm.panic_on_oom = 0` Don't panic on **O**ut **O**f **M**emory situation. It is fine to be out of memory because the OOM Killer will then already be going and killing processes according to their OOM score.
* `vm.swappiness = 0` No swap please. Kubelet does not like it and if you run out of memory and don't have a special use case for swap, your memory is simply sized to low.

As written if you have comments and/or tips about the parameters, feel free to comment them below.

Have Fun!

(The cover photo is an edited screenshot from [die.net Linux Documentation](https://linux.die.net/))

***

## References

Over the years "collecting" these sysctl settings I came across several different sources, sites and posts. This section is a (late) try to collect these so others can see from where certain sysctl values come:

* [https://www.kmotoko.com/articles/linux-hardening-kernel-parameters-with-sysctl/](https://www.kmotoko.com/articles/linux-hardening-kernel-parameters-with-sysctl/)
* [https://www.tecmint.com/protect-hard-and-symbolic-links-in-centos-rhel/](https://www.tecmint.com/protect-hard-and-symbolic-links-in-centos-rhel/)
