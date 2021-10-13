---
title: Running ownCloud in Kubernetes with Rook Ceph Storage - Part 2
description: 'How to run ownCloud in Kubernetes with using Rook for a Ceph Cluster.'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2020-01-06T14:56:41+01:00"
tags:
  - ownCloud
categories:
  - Articles
---

This a cross post of a post I wrote for the [ownCloud Blog](https://owncloud.org/news/), the original post can be found here: [Running ownCloud in Kubernetes With Rook Ceph Storage – Step by Step](https://owncloud.org/news/running-owncloud-in-kubernetes-with-rook-ceph-storage-step-by-step/).

Thanks to them for allowing me to write and publish the post on their blog!

***

## Preparations

Let's prepare for the Kubernetes madness!

### Kubernetes Cluster Access

As written in the first part, it is expected that you have (admin) access to a Kubernetes cluster already.

If you don't have a Kubernetes cluster, you can try using the following projects [xetys/hetzner-kube on GitHub](https://github.com/xetys/hetzner-kube), [Kubespray](https://kubespray.io/) and [others (Kubernetes documentation)](https://kubernetes.io/docs/setup/).

minikube is not enough when started with the default resources, be sure to give minikube extra resources otherwise you will run into problems! Be sure to add the following flags to the `minikube start` command: `--memory=4096 --cpus=3 --disk-size=40g`.

You should have `cluster-admin` access to the Kubernetes cluster! Other access can also work, but due to the nature of objects that are created along the way it is easier to have the `cluster-admin` access.

### Kubernetes Cluster

#### Ingress Controller

**WARNING** Only follow this section, if your Kubernetes cluster does not have an Ingress controller yet.

We are going to install the Kubernetes NGINX Ingress Controller.

```console
# Taken from https://github.com/kubernetes/ingress-nginx/blob/master/deploy/static/mandatory.yaml
kubectl apply -f ingress-nginx/
```

The instructions shown here are for an environment without `LoadBalancer` Service type support (e.g., bare metal, "normal" VM provider, not cloud), for installation instructions for other environments checkout [Installation Guide - NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/).

```console
# Taken from # Taken from https://github.com/kubernetes/ingress-nginx/blob/master/deploy/static/provider/baremetal/service-nodeport.yaml
kubectl apply -f ingress-nginx/service-nodeport.yaml
```

As these are bare metal installation instructions, the NGINX Ingress controller will be available through a Service of type `NodePort`. This Service type exposes one or more ports on all Nodes in the Kubernetes cluster.

To get that port run:

```console
$ kubectl get -n ingress-nginx service ingress-nginx
NAME            TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx   NodePort   10.108.254.160   <none>        80:30512/TCP,443:30243/TCP   23m
```

In that output you can see the NodePorts for HTTP and HTTPS on which you can connect to the NGINX Ingress controller and ownCloud later.

Though as written you probably want to look into a more "solid" way to expose the NGINX Ingress controller(s), for bare metal where there is no Kubernetes LoadBalancer integration one can consider using `hostNetwork` option for that: [Bare-metal considerations - NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/baremetal/#via-the-host-network).

#### Namespaces

Through the whole installation we will create 4 Namespaces:

* `rook-ceph` - For the Rook run Ceph cluster + the Rook Ceph operator (will be created in [Rook Ceph storage](#rook-ceph-storage)).
* `owncloud` - For ownCloud and the other operators, such as Zalando's Postgres Operator and KubeDB for Redis.
* `ingress-nginx` - If you don't have an Ingress controller running yet, the namespace is used for the Ingress NGINX controller (it is already created in the [Ingress Controller steps](#ingress-controller)).

```console
kubectl create -f namespaces.yaml
```

## Rook Ceph Storage

Now on to running Ceph in Kubernetes, using the [Rook.io project](https://rook.io/).

In the following sections make sure to use the available `-test` suffixed files if you have less than 3 Nodes which are available to any application / Pod (e.g., depending on your cluster the masters are not available for Pods).
(You can change that, for that be sure to dig into the `CephCluster` object's `spec.placement.tolerations` and the Operator environment variables for the discover and agent daemons. Running application Pods on the masters is not recommended though)

### Operator

The operator will take care of starting up the Ceph components one by one and also preparing of disks and health checking.

```console
kubectl create -f rook-ceph/common.yaml
kubectl create -f rook-ceph/operator.yaml
```

You can check on the Pods to see how it looks:

```console
$ kubectl get -n rook-ceph pod
NAME                                  READY   STATUS    RESTARTS   AGE
rook-ceph-agent-cbrgv                 1/1     Running   0          90s
rook-ceph-agent-wfznr                 1/1     Running   0          90s
rook-ceph-agent-zhgg7                 1/1     Running   0          90s
rook-ceph-operator-6897f5c696-j724m   1/1     Running   0          2m18s
rook-discover-jg798                   1/1     Running   0          90s
rook-discover-kfxc8                   1/1     Running   0          90s
rook-discover-qbhfs                   1/1     Running   0          90s
```

The `rook-discover-*` Pods are each one on each Node of your Kubernetes cluster, as they are discovering the disks of the Nodes so the operator can plan the actions for a given `CephCluster` object which comes up next.

### Ceph Cluster

This is the definition of Ceph cluster that will be created in Kubernetes. It contains the lists and options on which disks to use and on which Nodes.

If you wanna see some example CephCluster objects to see what is possible, be sure to checkout [Rook v1.0 Documentation - CephCluster CRD](https://rook.io/docs/rook/v1.0/ceph-cluster-crd.html).

**INFO** Use the `cluster-test.yaml` when your Kubernetes cluster has less than 3 schedulable Nodes (e.g., minikube)!
When using the `cluster-test.yaml` only one `mon` is started. If that mon is down for whatever reason, the Ceph Cluster will come to a halt to prevent any data "corruption".

```console
$ kubectl create -f rook-ceph/cluster.yaml
```

This will now cause the operator to start the Ceph cluster after the specifications in the CephCluster object.

To see which Pods have already been created by the operator, you can run (output example from a three node cluster):

```console
$ kubectl get -n rook-ceph pod
NAME                                                     READY   STATUS      RESTARTS   AGE
rook-ceph-agent-cbrgv                                    1/1     Running     0          11m
rook-ceph-agent-wfznr                                    1/1     Running     0          11m
rook-ceph-agent-zhgg7                                    1/1     Running     0          11m
rook-ceph-mgr-a-77fc54c489-66mpd                         1/1     Running     0          6m45s
rook-ceph-mon-a-68b94cd66-m48lm                          1/1     Running     0          8m6s
rook-ceph-mon-b-7b679476f-mc7wj                          1/1     Running     0          8m
rook-ceph-mon-c-b5c468c94-f8knt                          1/1     Running     0          7m54s
rook-ceph-operator-6897f5c696-j724m                      1/1     Running     0          11m
rook-ceph-osd-0-5c8d8fcdd-m4gl7                          1/1     Running     0          5m55s
rook-ceph-osd-1-67bfb7d647-vzmpv                         1/1     Running     0          5m56s
rook-ceph-osd-2-c8c55548f-ws8sl                          1/1     Running     0          5m11s
rook-ceph-osd-prepare-owncloudrookceph-worker-01-svvz9   0/2     Completed   0          6m7s
rook-ceph-osd-prepare-owncloudrookceph-worker-02-mhvf2   0/2     Completed   0          6m7s
rook-ceph-osd-prepare-owncloudrookceph-worker-03-nt2gs   0/2     Completed   0          6m7s
rook-discover-jg798                                      1/1     Running     0          11m
rook-discover-kfxc8                                      1/1     Running     0          11m
rook-discover-qbhfs                                      1/1     Running     0          11m
```

### Block storage (RBD)

Before creating the CephFS filesystem, let's create a block storage pool with a StorageClass.
The StorageClass is for the PostgreSQL and if you want even the Redis cluster.

**INFO** Use the `storageclass-test.yaml` when your Kubernetes cluster has less than 3 schedulable Nodes!

```console
kubectl create -f rook-ceph/storageclass.yaml
```

In case of a block storage Pool there are no additional Pods that will be started, we'll verify that the block storage Pool has been created in the [Toolbox section](#toolbox).

One more thing to do is, to set the created StorageClass as default in the Kubernetes cluster by running the following command:

```console
kubectl patch storageclass rook-ceph-block -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

Now you are ready to move onto the storage for the actual data to be stored in ownCloud!

### CephFS

CephFS is the filesystem that Ceph offers, with its POSIX compliance it is a perfect fit to be used with ownCloud.

**INFO** Use the `filesystem-test.yaml` when your Kubernetes cluster has less than 3 schedulable Nodes!

```console
kubectl create -f rook-ceph/filesystem.yaml
```

Creation of the CephFS will cause, so called MDS daemons, MDS Pods to be started.

```console
kubectl get -n rook-ceph pod
NAME                                    READY   STATUS      RESTARTS   AGE
[...]
rook-ceph-mds-myfs-a-747b75bdc7-9nzwx                    1/1     Running     0          11s
rook-ceph-mds-myfs-b-76b9fcc8cc-md8bz                    1/1     Running     0          10s
[...]
```

### Toolbox

This will create a Pod which will allow us to run Ceph commands. It will be use to quickly check the Ceph clusters status.

```console
kubectl create -f rook-ceph/toolbox.yaml
# Wait for the Pod to be `Running`
kubectl get -n rook-ceph pod -l "app=rook-ceph-tools"
NAME                                    READY   STATUS      RESTARTS   AGE
[...]
rook-ceph-tools-5966446d7b-nrw5n                         1/1     Running     0          10s
[...]
```

Now use `kubectl exec` to enter the Rook Ceph Toolbox Pod:

```console
kubectl exec -n rook-ceph -it $(kubectl get -n rook-ceph pod -l "app=rook-ceph-tools" -o jsonpath='{.items[0].metadata.name}') bash
```

In the Rook Ceph Toolbox Pod, run the following command to get the Ceph cluster health status (example output from a 7 Node Kubernetes Rook Ceph cluster):

```console
$ ceph -s
 cluster:
   id:     f8492cd9-3d14-432c-b681-6f73425d6851
   health: HEALTH_OK

 services:
   mon: 3 daemons, quorum c,b,a
   mgr: a(active)
   mds: repl-2-1-2/2/2 up  {0=repl-2-1-c=up:active,1=repl-2-1-b=up:active}, 2 up:standby-replay
   osd: 7 osds: 7 up, 7 in

 data:
   pools:   3 pools, 300 pgs
   objects: 1.41 M objects, 4.0 TiB
   usage:   8.2 TiB used, 17 TiB / 25 TiB avail
   pgs:     300 active+clean

 io:
   client:   6.2 KiB/s rd, 1.5 MiB/s wr, 4 op/s rd, 140 op/s wr

```

You can also get it by using `kubectl`:

```console
$ kubectl get -n rook-ceph cephcluster rook-ceph
NAME        DATADIRHOSTPATH   MONCOUNT   AGE   STATE     HEALTH
rook-ceph   /mnt/sda1/rook    3          14m   Created   HEALTH_OK
```

That even shows you some additional information directly through `kubectl` instead of having to read the `ceph -s` output.

### Summary

This is how it should look Pod wise now in your `rook-ceph` Namespace (example output from a 3 Node Kubernetes cluster):

```console
$ kubectl get -n rook-ceph pod
NAME                                                     READY   STATUS      RESTARTS   AGE
rook-ceph-agent-cbrgv                                    1/1     Running     0          15m
rook-ceph-agent-wfznr                                    1/1     Running     0          15m
rook-ceph-agent-zhgg7                                    1/1     Running     0          15m
rook-ceph-mds-myfs-a-747b75bdc7-9nzwx                    1/1     Running     0          42s
rook-ceph-mds-myfs-b-76b9fcc8cc-md8bz                    1/1     Running     0          41s
rook-ceph-mgr-a-77fc54c489-66mpd                         1/1     Running     0          11m
rook-ceph-mon-a-68b94cd66-m48lm                          1/1     Running     0          12m
rook-ceph-mon-b-7b679476f-mc7wj                          1/1     Running     0          2m22s
rook-ceph-mon-c-b5c468c94-f8knt                          1/1     Running     0          2m6s
rook-ceph-operator-6897f5c696-j724m                      1/1     Running     0          16m
rook-ceph-osd-0-5c8d8fcdd-m4gl7                          1/1     Running     0          10m
rook-ceph-osd-1-67bfb7d647-vzmpv                         1/1     Running     0          10m
rook-ceph-osd-2-c8c55548f-ws8sl                          1/1     Running     0          9m48s
rook-ceph-osd-prepare-owncloudrookceph-worker-01-5xpqk   0/2     Completed   0          73s
rook-ceph-osd-prepare-owncloudrookceph-worker-02-xnl8p   0/2     Completed   0          70s
rook-ceph-osd-prepare-owncloudrookceph-worker-03-2qggs   0/2     Completed   0          68s
rook-ceph-tools-5966446d7b-nrw5n                         1/1     Running     0          8s
rook-discover-jg798                                      1/1     Running     0          15m
rook-discover-kfxc8                                      1/1     Running     0          15m
rook-discover-qbhfs                                      1/1     Running     0          15m
```

The important thing is that the `ceph -s` output or the `kubectl get cephcluster` output shows that the `health` is `HEALTH_OK` and that you have OSD Pods running (`ceph -s` output line: `osd: 3 osds: 3 up, 3 in` (where 3 is basically the amount of OSD Pods).

Should you not have any OSD Pod, make sure all your Nodes are `Ready` and schedulable (e.g., no taints preventing "normal" Pods to run) and make sure to checkout the logs of the `rook-ceph-osd-prepare-*` and if existing `rook-ceph-osd-[0-9]*` Pods. If you don't have any Pods related to `rook-ceph-osd-*` look into the `rook-ceph-operator-*` logs for error messages, be sure to go over each line to make sure you don't miss an error message.

## PostgreSQL

Moving on to the PostgreSQL for ownCloud.

Zalando's PostgreSQL operator does a great job for running PostgreSQL in Kubernetes.

First thing to create is the PostgreSQL Operator which brings the CustomResourceDefinitions, remember the custom Kubernetes objects, with itself.
Using the Ceph block storage (RBD) we are going to create a redundant PostgreSQL instance for ownCloud to use.

```console
$ kubectl create -n owncloud -f postgres/postgres-operator.yaml
# Check for the PostgreSQL operator Pod to be created and running
$ kubectl get -n owncloud pod
NAME                                 READY   STATUS    RESTARTS   AGE
postgres-operator-6464fc9c48-6twrd   1/1     Running   0          5m23s
```

That is the operator created, moving on to the PostgreSQL custom resource object that will cause the operator to create a PostgreSQL instance for use in Kubernetes:

```console
# Make sure the CustomResourceDefinition of the PostgreSQL has been created
$ kubectl get customresourcedefinitions.apiextensions.k8s.io postgresqls.acid.zalan.do
NAME                        CREATED AT
postgresqls.acid.zalan.do   2019-08-04T10:27:59Z
```

The CustomResourceDefinition exists? Perfect, continue with the creation:

```console
kubectl create -n owncloud -f postgres/postgres.yaml
```

It will take a bit for the two PostgreSQL Pods to appear, but in the end you should have two `owncloud-postgres` Pods:

```console
$ kubectl get -n owncloud pod
NAME                                 READY   STATUS    RESTARTS   AGE
owncloud-postgres-0                  1/1     Running   0          92s
owncloud-postgres-1                  1/1     Running   0          64s
postgres-operator-6464fc9c48-6twrd   1/1     Running   0          7m
```

`owncloud-postgres-0` and `owncloud-postgres-1` in `Running` status? That looks good.

Now that the database is running, let's continue to the Redis.

## Redis

To run a Redis cluster we need the KubeDB Operator, installing it can done using a bash script or Helm.

To keep it quick'n'easy we'll use their bash script for that:

```console
curl -fsSL https://raw.githubusercontent.com/kubedb/cli/0.12.0/hack/deploy/kubedb.sh -o kubedb.sh
# Take a look at the script using, e.g., `cat kubedb.sh`
#
# If you are fine with it, run it:
chmod +x kubedb.sh
./kubedb.sh
# It will install the KubeDB operator to the cluster in the `kube-system` Namespace
```

(You can remove the script afterwards: `rm kubedb.sh`)

For more information on the bash script and / or the Helm installation, checkout [KubeDB](https://kubedb.com/docs/0.12.0/setup/install/#install-kubedb-operator).

Moving on to creating the Redis cluster, run:

```console
kubectl create -n owncloud -f redis.yaml
```

It will take a few seconds for the first Redis Pod(s) to be started, to check that it worked look for Pods with `redis-owncloud-` in their name:

```console
$ kubectl get -n owncloud pods
NAME                                 READY   STATUS    RESTARTS   AGE
owncloud-postgres-0                  1/1     Running   0          6m41s
owncloud-postgres-1                  1/1     Running   0          6m13s
postgres-operator-6464fc9c48-6twrd   1/1     Running   0          12m
redis-owncloud-shard0-0              1/1     Running   0          49s
redis-owncloud-shard0-1              1/1     Running   0          40s
redis-owncloud-shard1-0              1/1     Running   0          29s
redis-owncloud-shard1-1              1/1     Running   0          19s
redis-owncloud-shard2-0              1/1     Running   0          14s
redis-owncloud-shard2-1              1/1     Running   0          10s
```

That is how it should like now.

## ownCloud

Now the final "piece", ownCloud.

The folder `owncloud/` contains all the manifests we need.

* ConfigMap and Secret for basic configuration of the ownCloud.
* Deployment to get ownCloud Pods running in Kubernetes.
* Service and Ingress to expose ownCloud to the internet.
* CronJob to run the ownCloud cron task execution (e.g., cleanup and others), instead of having the cron run per instance.

The ownCloud Deployment currently uses a custom built image (`galexrt/owncloud-server:latest`) which has a fix for a clustered Redis configuration issue (pull request has been opened https://github.com/owncloud-docker/base/pull/95).

```console
kubectl create -n owncloud -f owncloud/
# Now we'll wait for ownCloud to have installed the database to then scale the ownCloud up to `2` (or more if you want)
```

The admin username is `myowncloudadmin` and can be changed in the `owncloud/owncloud-configmap.yaml` file. Be sure to restart both ownCloud Pods after changing values in the ConfigMaps and Secrets.

If you want to change the admin password, edit the `owncloud/owncloud-secret.yaml` file line `OWNCLOUD_ADMIN_PASSWORD`. The values in a Kubernetes Secret object are base64 encoded (e.g., `echo -n YOUR_PASSWORD | base64 -w0`)!

To know when your ownCloud is up'n'running check the logs, e.g.:
```console
$ kubectl logs -n owncloud -f owncloud-856fcc4947-crscn
Creating volume folders...
Creating hook folders...
Waiting for PostgreSQL...
wait-for-it: waiting 180 seconds for owncloud-postgres:5432
wait-for-it: owncloud-postgres:5432 is available after 1 seconds
Removing custom folder...
Linking custom folder...
Removing config folder...
Linking config folder...
Writing config file...
Fixing base perms...
Fixing data perms...
Fixing hook perms...
Installing server database...
ownCloud was successfully installed
ownCloud is already latest version
Writing objectstore config...
Writing php config...
Updating htaccess config...
.htaccess has been updated
Writing apache config...
Enabling webcron background...
Set mode for background jobs to 'webcron'
Touching cron configs...
Starting cron daemon...
Starting apache daemon...
[Sun Aug 04 13:26:18.986407 2019] [mpm_prefork:notice] [pid 190] AH00163: Apache/2.4.29 (Ubuntu) configured -- resuming normal operations
[Sun Aug 04 13:26:18.986558 2019] [core:notice] [pid 190] AH00094: Command line: '/usr/sbin/apache2 -f /etc/apache2/apache2.conf -D FOREGROUND'
```

The `Installing server database...` will take some time depending on your network, storage and other factors.

After the `[Sun Aug 04 13:26:18.986558 2019] [core:notice] [pid 190] AH00094: Command line: '/usr/sbin/apache2 -f /etc/apache2/apache2.conf -D FOREGROUND'` you should be able to reach your ownCloud instance through the NodePort Service Port (on HTTP) or through the Ingress (default address `owncloud.example.com`). If you are using the Ingress from the example files, be sure to edit it to use a (sub-) domain pointing to the Ingress controllers in your Kubernetes cluster.

You now have a ownCloud instance running.

### Further points

#### HTTPS

To further improve the experience of running ownCloud in Kubernetes, you will probably want to checkout [Jetstack's cert-manager project on GitHub](https://github.com/jetstack/cert-manager) to get yourself Letsencrypt certificates for your Ingress controller.
The `cert-manager` allows you to request [Let's Encrypt](https://letsencrypt.org/) certificates easily through Kubernetes custom objects and keep them uptodate.

Meaning the ownCloud will then be reachable via HTTPS which combined with the ownCloud encryption makes it pretty secure.

For more information on using TLS with Kubernetes Ingress, checkout [Ingress - Kubernetes](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls).

#### Pod Health Checks

In the `owncloud/owncloud-deployment.yaml` there is a `readinessProbe` and `livenessProbe` in the Deployment sepc but commented out.
After the ownCloud has been installed and you have verified it is running, you can go ahead and uncomment those lines and use `kubectl apply` / `kubectl replace` (don't forget to specify the Namespace `-n owncloud`).

#### Upload Filesize

When changing the upload filesize on the ownCloud instance itself through the environment variables, be sure to also update the Ingress controller with the "max upload file size".

#### Other configuration options

When wanting to change config options, you need to provide them through environment variables. The environment variables are given to the ownCloud Deployment in the `owncloud/owncloud-configmap.yaml`.

A list of all available environment variables can be found here:

* https://github.com/owncloud-docker/server#available-environment-variables
* https://github.com/owncloud-docker/base#available-environment-variables

### Updating ownCloud in Kubernetes

It is the same procedure as with running ownCloud with, e.g., `docker-compose`.

To update ownCloud you need to scale down the Deployment to `1` (`replicas`), then update the image, wait for the one single Pod come up again and then scale up the ownCloud Deployment again to, e.g., `2` or more.

## Summary

This is the end of the two part series on running ownCloud in Kubernetes.

Have Fun!
