---
title: 'CRI-O + Container Linux: How to Install'
description: 'This post is containing steps on how you can install CRI-O on Container Linux.'
sitemap: true
comments: true
author: Alexander Trost
date: "2018-03-06T21:14:11+02:00"
tags:
  - Container
  - 'CRI-O'
  - Kubernetes
  - 'Container Linux'
cover: /post/covers/crio-container-linux-logos.png
---

## Intro

> **WARNING**
>
> **Currently it is very very far from optimal to run CRI-O on a "no package manager" system like Container Linux. For curious people, this should work "perfectly" though.**
>
> **NOTE**
>
> If it is not clear from the above `WARNING`, I wouldn't recommend this for production (yet). Personally I will soon replace Docker with CRI-O in my private Kubernetes cluster though, because Docker causes issues in my cluster.

This post is showing how you can install and run [CRI-O](https://cri-o.io/) for [Kubernetes](https://kubernetes.io/) on [Container Linux](https://coreos.com/os/docs/latest/) (previously CoreOS).
CRI-O is an implementation of the [Kubernetes Container Runtime Interface (CRI)](https://github.com/kubernetes/community/blob/master/contributors/devel/container-runtime-interface.md).
There are still some things not (fully) implemented in CRI-O yet, like Container metrics (see Kubernetes CRI link).

### Requirements

* Golang (e.g. [Getting Started - The Go Programming Language](https://golang.org/doc/install) with a set `$GOPATH`)
* [CRI-O source code](https://github.com/cri-o/cri-o) (`go get` or `git clone`) in your `$GOPATH` (will be explained in [Step 1 - Preparations](#Step-1-Preparations))
* [Container Linux (/ CoreOS)](https://coreos.com/os/docs/latest/) machines
* `ldd` Linux tool to show the shared object dependencies of binaries.

## Why switch to CRI-O?

For me the reason is simple: "Docker seems to break down every few weeks in my private cluster and causes nodes to need a reboot..".
From running CRI-O for a bit now, Kubelet has gone "quiet". No more logs about issues with the container runtime (in my case Docker caused a good amount of logs in Kubelet).

I suggest you take a look at a few posts about CRI-O to get a general understanding of what CRI-O is:

* [6 Reasons why CRI-O is the best runtime for Kubernetes - Project Atomic](https://www.projectatomic.io/blog/2017/06/6-reasons-why-cri-o-is-the-best-runtime-for-kubernetes/)
* [CRI-O, the Project to Run Containers without Docker, Reaches 1.0 - The New Stack](https://thenewstack.io/cri-o-project-run-containers-without-docker-reaches-1-0/)

But you are most likely here because you already know that, right? ;)

Another point for me is that in the best case it will be "shipped" with Kubernetes at some point in time, so that you "just" upgrade Kubelet and et voilà you get the new CRI-O version. I would totally wnat it to be like that.

## Step 1 - Build CRI-O

> **NOTE**
>
> You need to make sure you have the dependencies installed CRI-O expects you to have, they can be found here: [Build and install CRI-O from source - Build and Run Dependencies section on cri-o/cri-o GitHub](https://github.com/cri-o/cri-o/blob/master/tutorials/setup.md#build-and-run-dependencies).

You can either use release binaries (which are not linked to the releases (yet?)) or build CRI-O your own, for that checkout the [Build and install CRI-O from source on cri-o/cri-o GitHub](https://github.com/cri-o/cri-o/blob/master/tutorials/setup.md) ([cri-o/cri-o README.md - Getting started section](https://github.com/cri-o/cri-o#getting-started)).
Before you just go ahead and build from "master" branch, I'd recommend you to checkout [CRI-O's Kubernetes compatibility matrix](https://github.com/cri-o/cri-o#compatibility-matrix-cri-o---kubernetes-clusters) and choose a release branch, e.g., `release-1.14` for Kubernetes `v1.14.x` compatibility.

Summarized to build the binary from source run:

```console
$ go get -u github.com/cri-o/cri-o
$ cd $GOPATH/src/github.com/cri-o/cri-o
$ make
```

That will produce all CRI-O binaries, see:

```console
$ ls -hl $GOPATH/src/github.com/cri-o/cri-o/bin
total 86M
-rwxr-xr-x 1 user user  56K 19. Apr 12:14 conmon
-rwxr-xr-x 1 user user  46M 19. Apr 12:14 crio
-rwxr-xr-x 1 user user  40M 19. Apr 12:14 crio-config
-rwxr-xr-x 1 user user 743K 19. Apr 12:14 pause
```

These binaries are needed and will be referenced to in the  upcoming steps.

## Step 2 - Upload CRI-O and "Dependencies"

> **NOTE**
>
> It is possible that the dependent libraries are named differently on your (build) machine.
> Use `ldd FILENAME` (`ldd crio`) to show which libraries need to be copied. All libraries with `not found` need to be copied to the `/opt/lib64` directory.

On "all" servers which should be switched to use CRI-O as the Container Runtime we need to create some directory:

```console
mkdir -p /opt/bin /opt/lib64 /etc/crio /var/lib/crio
```

Now upload the compiled `crio` and `conmon` (not `common`) binaries from [Step 1 - Preparations](#Step-1-Preparations) to the `/opt/bin` directory on the hosts.
After that run `ldd /opt/bin/crio` (and for `conmon` too), to see which libraries need to uploaded too.

**Example Output** of `ldd /usr/bin/ffmpeg`:
```console
ldd /usr/bin/ffmpeg
    linux-vdso.so.1 =>  (0x00007ffffc1fe000)
    libavfilter.so.0 => not found
    libpostproc.so.51 => not found
    libswscale.so.0 => not found
    libavdevice.so.52 => not found
    libavformat.so.52 => not found
    libavcodec.so.52 => not found
    libavutil.so.49 => not found
    libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007fdd18259000)
    libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007fdd1803a000)
    libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fdd17c75000)
    /lib64/ld-linux-x86-64.so.2 (0x00007fdd18583000)
```

If you look at the example output for, unrelated, `ffmpeg` binary, you see some entries having `not found` behind the arrow. These libraries need to be copied to the hosts.

For CRI-O this can possibly be the `libgpgme.so.11` library. Meaning that you copy the `libgpgme.so.11` of your build machine / laptop to the hosts `/opt/lib64` directory.

Upload all libraries that are `not found` in the `ldd` output for `crio` and `conmon` binary. The path to each library should be shown as in the above example output.

To verify that the libraries copied are correct, you can run `LD_LIBRARY_PATH=:/opt/lib64 ldd /opt/bin/crio` and it should now show no `not found` entries anymore.

### Software dependencies

Depending on which version of Container Linux (CoreOS), you may need to copy the following software dependencies of the following dependencies to your hosts `/opt/bin` directory.

Make sure to verify that the software are not on the servers already, e.g., use `command -v runc` or `which runc` (where `runc` is the software you are checking for).

* `runc` - If that is missing something is probably "wrong" with your host's Container Linux.
* `socat`
* `iproute`
* `iptables`

**Example for `conntrack` binary**:

Upload `conntrack` binary to `/opt/bin` and the `not found` library dependencies to `/opt/lib64` which would be:

* `libnetfilter_conntrack.so.3`
* `libnfnetlink.so.0`

Running `LD_LIBRARY_PATH=:/opt/lib64 ldd /opt/bin/conntrack` should show no `not found` library entries.

## Step 3 - CRI-O Systemd Service

> **NOTE**
>
> The Systemd service units shown here are modified versions of the originals!
> Keep that in mind if you have made your own modifications to the service unit files.

Create Systemd service unit at `/etc/systemd/system/crio.service`:

```ini
[Unit]
Description=Open Container Initiative Daemon
Documentation=https://github.com/cri-o/cri-o
Wants=network-online.target
After=network-online.target

[Service]
Type=notify
EnvironmentFile=-/etc/sysconfig/crio
Environment=GOTRACEBACK=crash
Environment=LD_LIBRARY_PATH=:/opt/lib64
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/bin
ExecStart=/usr/local/bin/crio \
          $CRIO_STORAGE_OPTIONS \
          $CRIO_NETWORK_OPTIONS \
          $CRIO_METRICS_OPTIONS
ExecReload=/bin/kill -s HUP $MAINPID
TasksMax=infinity
LimitNOFILE=1048576
LimitNPROC=1048576
LimitCORE=infinity
OOMScoreAdjust=-999
TimeoutStartSec=0
Restart=on-abnormal

[Install]
WantedBy=multi-user.target
```

The original Systemd service unit was taken from [GitHub cri-o/cri-o - master `contrib/systemd/crio.service`](https://github.com/cri-o/cri-o/blob/master/contrib/systemd/crio.service).

To signal CRI-O that a shutdown has started, a second Systemd service unit is used at `/etc/systemd/system/crio-shutdown.service`:
```ini
[Unit]
Description=Shutdown CRIO containers before shutting down the system
Wants=crio.service
After=crio.service
Documentation=man:crio(8)

[Service]
Type=oneshot
ExecStart=/usr/bin/rm -f /var/lib/crio/crio.shutdown
ExecStop=/usr/bin/bash -c "/usr/bin/mkdir /var/lib/crio; /usr/bin/touch /var/lib/crio/crio.shutdown"
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

The original Systemd service unit was taken from [GitHub cri-o/cri-o - master `contrib/systemd/crio-shutdown.service`](https://github.com/cri-o/cri-o/blob/master/contrib/systemd/crio-shutdown.service).

## Step 4 - Configure CRI-O

Create the directory `/etc/sysconfig` if it doesn't exist yet, and create / update the file `/etc/sysconfig/crio` in it with the following content:

```console
# /etc/sysconfig/crio

# use "--enable-metrics" and "--metrics-port value"
#CRIO_METRICS_OPTIONS="--enable-metrics"

#CRIO_NETWORK_OPTIONS=
CRIO_NETWORK_OPTIONS="--conmon=/opt/bin/conmon"
#CRIO_STORAGE_OPTIONS=
```

The `/etc/sysconfig/crio` file holds a few flags which do the following:

* `--conmon=/opt/bin/conmon` - Use `/opt/bin/conmon` for the `conmon` binary, instead of searching through `$PATH`.

There are two other files needed from the [GitHub cri-o/cri-o repository](https://github.com/cri-o/cri-o):

First file is to be placed at `/etc/crio/seccomp.json`, it can be found here: [GitHub kubernetes-incubator - master `seccomp.json`](https://github.com/cri-o/cri-o/blob/master/seccomp.json).

Second to be placed at `/etc/containers/policy.json`, the original can be found here: [GitHub kubernetes-incubator - master `test/policy.json`](https://github.com/cri-o/cri-o/blob/master/test/policy.json), as you may see from the path where the file is located, it is probably just used for testing, so I'd recommend you to use this "slimmed down" version:

```json
{
    "default": [
        {
            "type": "insecureAcceptAnything"
        }
    ],
    "transports": {
        "docker": {}
    }
}
```

(This file is also available as a Gist: [GitHub Gist - galexrt - My current CRI-O config file - `policy.json`](https://gist.github.com/galexrt/5ff3b48994328368330949a8ed0634ea#file-policy-json))

Now that the parts around CRI-O are configured, let's configure CRI-O "in-depth" using the `crio.conf` file.
You can use the `crio config --default > /etc/crio/crio.conf` command to generate a config with sane defaults (`--default` flag adds the sane defaults).

An important point to change in the `crio.conf` to make CRI-O "Docker backwards compatible" is to make CRI-O not fail for images without an image registry server. Normally such images are served from Docker Hub, but CRI-O by default would fail. To fix that modify the `/etc/crio/crio.conf` as follows:

```ini
[...]
# List of registries to be used when pulling an unqualified image (e.g.,
# "alpine:latest"). By default, registries is set to "docker.io" for
# compatibility reasons. Depending on your workload and usecase you may add more
# registries (e.g., "quay.io", "registry.fedoraproject.org",
# "registry.opensuse.org", etc.).
registries = [
 	"docker.io",
]
[...]
```

The change is to uncomment / add `"docker.io",` to the list of "default" / unqualified registries to pull from.

Also I recommend you to change the following other values too:

* `storage_driver = ""` - To `storage_driver = "overlay"` to use overlay storage for the containers and images. `overlay` is the default, but it is good to "enforce" a default in case that may change at one point.
* `pids_limit = 10240` (or higher) - Set the maximum process ID limit for a container.
* `enable_shared_pid_namespace = false` - Enable shared Process ID namespace between containers of a Pod (depends on if you want / need it).

You may also need to change the `network_dir` config option to reflect the CNI (config) path used by your setup (default is `/etc/cni/net.d/`).

> **NOTE**
>
> The full `/etc/crio/crio.conf` I am using is available on GitHub as a Gist:
> <details><summary>GitHub Gist - galexrt - My current CRI-O config file - **Click to expand**</summary><script src="https://gist.github.com/galexrt/5ff3b48994328368330949a8ed0634ea.js"></script></details>

Now that CRI-O is ready to be used, we can continue to configure Kubelet to use CRI-O.

## Step 5 - Configure Kubelet to use CRI-O

The following flags need to be added to the `kubelet.service`:

* `--container-runtime=remote` - Use the Container Runtime `remote`.
* `--container-runtime-endpoint=unix:///run/crio/crio.sock` - Where the Container Runtime can be reached.
* `--image-service-endpoint=unix:///run/crio/crio.sock` - Where the (Container Runtime) Image Service endpoint can be reached.
* `--runtime-request-timeout=10m` - Timeout for Container Runtime requests.

(If you are using dynamic kubelet configuration files, the option to change is `criSocket:`. Set it to `criSocket: /run/crio/crio.sock`)

The below snippet is from a `kubelet.service` that uses the `/usr/lib/coreos/kubelet-wrapper`:

```ini
ExecStart=/usr/lib/coreos/kubelet-wrapper \
[...]
  --container-runtime=remote \
  --container-runtime-endpoint=unix:///run/crio/crio.sock \
  --image-service-endpoint=unix:///run/crio/crio.sock \
  --runtime-request-timeout=10m \
[...]
```

More details on the flags and / or commands can be found at [GitHub cri-o/cri-o - master `kubernetes.md`](https://github.com/cri-o/cri-o/blob/master/tutorials/kubernetes.md#preparing-kubelet).

Additionally you need to add a mount for the host path `/opt/bin` to the same path in the `kubelet-wrapper`, that is so that the `kubelet` is able to reach the CRI-O binaries as they were / are not shipped within the `gcr.io/google-containers/hyperkube-amd64` images.
The lines for that will look like that:

```ini
	--volume opt-bin,kind=host,source=/opt/bin,readOnly=true \
	--mount volume=opt-bin,target=/opt/bin \
```
(These lines need to be added to the `RKT_RUN_ARGS` environment variable in your `kubelet.service` unit file, example on how this can look like can be found here: [kubelet-wrapper "Allow pods to use rbd volumes" documentation- coreos/coreos-kubernetes GitHub repository](https://github.com/coreos/coreos-kubernetes/blob/master/Documentation/kubelet-wrapper.md#allow-pods-to-use-rbd-volumes))

After that we should add the `crio.service` as a dependency to the `kubelet.service`, this causes systemd to start up `kubelet` only after `crio.service` is running. This can be achieved by adding / editing the `After=` section in your `kubelet.service` unit file.
If `docker.service` is in the `After=` section, go ahead and remove it.

It should look like this:

```ini
[Unit]
...
After=crio.service
...
```

Now that the CRI-O and Kubelet Systemd service units have been created and/or modified we need to reload Systemd:

```console
systemctl daemon-reload
```

## Step 6 - Start CRI-O and restart Kubelet

```console
systemctl enable crio.service crio-shutdown.service
systemctl start crio.service crio-shutdown.service
```

> **NOTE** The `.service` can be omitted in this case as there is no other unit (example `.mount` or `.device`) with that name. For more info on that please refer to the [Systemd man pages](https://www.freedesktop.org/software/systemd/man/systemctl.html).

If there was no error during the start CRI-O, you are ready to restart Kubelet and let it start the containers through CRI-O:

```console
systemctl restart kubelet.service
```

If you want to make sure that Kubelet uses CRI-O successfully, you can check the logs of Kubelet by running `journalctl -u kubelet -xe`.

Now that Kubelet should use CRI-O as the Container Runtime (CRI), you can move on the [Step 7 - Test your new Container Runtime](#Step-7-Test-your-new-Container-Runtime).

## Step 8 - Test your new Container Runtime

There are multiple ways to test if CRI-O starts containers:

* [`cri-tools` - `crictl`](https://github.com/kubernetes-incubator/cri-tools) can list the containers and images on the node. Example to list the containers: `crictl --image-endpoint=/run/crio/crio.sock --runtime-endpoint=/run/crio/crio.sock ps`, for more information on how to use `crictl` see [GitHub kubernetes-incubator - master `docs/crictl.md`](https://github.com/kubernetes-incubator/cri-tools/blob/master/docs/crictl.md).
* `runc` can be used like this: `runc list`.
* Kubernetes shows you the Pod status per node: `kubectl get --all-namespaces pods -o wide | grep $NODE_NAME`.

## Step 9 - Disable and stop `docker.service`

Now that we are sure containers are running fine with CRI-O, go ahead stop and disable the `docker.service` on the host(s) using the following commands:

```console
systemctl stop docker.service
systemctl disable docker.service

## If you want to make extra sure Docker will never start up again on the hosts, run:
systemctl mask docker.service
```

This masks the `docker.service`, systemd will then symlink `/dev/null` "in place" of the `docker.service`.

## Troubleshooting

### "Timeout" or "Connection refuesd" when trying to `kubectl exec` into a Pod

If you have a firewall on the nodes, you may need to allow CRI-O's so called `stream_port` which is by default listening on `10010/TCP`. It needs to be accessible by the Kubernetes masters.

## Summary

This should get you started with installing and running [CRI-O](https://cri-o.io/) for Kubernetes on Container Linux (previously CoreOS).

You can basically put most of these "copy files commands" into your [Container Linux / Ignition Config](https://coreos.com/os/docs/latest/cluster-architectures.html), even [cloud-config](https://cloudinit.readthedocs.io/en/latest/index.html) would be one way to automate it during OS install / boot.

For questions about the post, please leave a comment below, thanks!

Have Fun!
