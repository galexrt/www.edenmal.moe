---
title: 'GitLab + Kubernetes: GitLab on top of Kubernetes'
description: "How to run GitLab on top of a Kubernetes cluster with persitent storage."
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2017-11-04T18:00:46+02:00"
tags:
  - Continuous Delivery
  - GitLab
  - Kubernetes
  - Container
categories:
  - GitLab
cover: /post/2017/GitLab-Kubernetes-GitLab-on-top-of-Kubernetes/GitLab-Kubernetes-GitLab-on-top-of-Kubernetes.png
---

## Intro

This is the third post in the three post series about Kubernetes and GitLab. The first post can be found here: [Edenmal - GitLab + Kubernetes: Perfect Match for Continuous Delivery with Container]({{< ref "/post/2017/GitLab-Kubernetes-Perfect-Match-for-Continuous-Delivery-with-Container.md" >}}).

This post will not cover how to setup a Postgres and Redis server/cluster for the GitLab.
In the near future I may even publish all my current manifests, that also contain Postgres and Redis server/cluster manifests.

If you don't have a Postgres and Redis, I would recommend you to check out the Kubernetes manifests at [`sameersbn/docker-gitlab`](https://github.com/sameersbn/docker-gitlab) repo, here: https://github.com/sameersbn/docker-gitlab/tree/master/kubernetes They contain a manifest for Postgres and Redis server.

### Decision to use `sameersbn` GitLab image instead of the official

The manifests below are using [`sameersbn/docker-gitlab`](https://github.com/sameersbn/docker-gitlab) image. You may ask "Why not use the official GitLab image?".
A good question, the answer to that lies in the concept of configuration of GitLab inside the container.
I personally prefer an image that doesn't need a persistent volume for the configuration.
Only time I want to use a persistent volume, is when I have data from an application that needs to persistence.
Last time I looked a the official GitLab Docker image I was required to have a persistent volume for the configuration.

That is not how I imagine an application in a container to be configured. I prefer:

* Configuration through environment variables
* **ONE** "small" configuration (fitting into a Kubernetes ConfigMap)
* Configuration by flag

Having to "move" around a persistent volume which contains the config is a bad thing from my point of view.
That is the reason behind why I am using [`sameersbn/docker-gitlab`](https://github.com/sameersbn/docker-gitlab) image instead of the official [`gitlab/gitlab-ce`](https://hub.docker.com/r/gitlab/gitlab-ce/) image.
Additionally there are some other smaller points, for example what runs in the container is more than should. At best one process per container.

### Requirements

* Kubernetes cluster with Ingress support
* Kubernetes Ingress Controller (example: [nginx-ingress controller]())
* StorageClass configured in Kubernetes
  * `ReadWriteMany` Persistent Storage (example CephFS using [Rook](https://rook.io))
* Domain/Subdomain ready to be used for the GitLab
* `kubectl` binary (with Kubernetes cluster access)
* Postgres server for GitLab
* Redis server/cluster for GitLab

> **NOTE**
>
> Postgres and Redis need to be reachable from inside the Kubernetes cluster.

### Manifests

The manifests shown in this blog post will also be available on GitHub here: [GitHub - galexrt/kubernetes-manifests](https://github.com/galexrt/kubernetes-manifests).
If you want the latest manifests version, I recommend you checkout the repository (though I try to keep the blog post and repository in the same state/version).

## Step 1 - Verify Kubernetes cluster "connectivity"

To check if you have proper Kubernetes cluster connection, run the following command:

```console
$ kubectl cluster-info
kubectl cluster-info
Kubernetes master is running at https://k8s.example.com:443
KubeDNS is running at https://k8s.example.com:443/api/v1/namespaces/kube-system/services/kube-dns/proxy
[...]
To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
$
```

The `kubectl` command `cluster-info` shows you if you can connect to the cluster
and list the available cluster services (in the ouput: Kubernetes apiserver and KubeDNS service).

## Step 2 - Write Kubernetes manifests for GitLab

As written in the [Intro](#Intro), the manifests will cover only the GitLab.

### ConfigMap

The list of all available environment variables for the configuration, can be found here: [sameersbn/docker-gitlab - Available Configuration Parameters](https://github.com/sameersbn/docker-gitlab#available-configuration-parameters).
If you have a variable that would contain a password or token, put it in the [Secret manifest](#Secret) below.

```yaml
apiVersion: v1
data:
  # Timezone
  TZ: "Europe/Berlin"
  GITLAB_TIMEZONE: "Berlin"
  # GitLab
  GITLAB_ROOT_EMAIL: "admin@example.com"
  GITLAB_HOST: "gitlab.example.com"
  GITLAB_PORT: "443"
  GITLAB_SSH_HOST: "ssh.gitlab.example.com"
  GITLAB_SSH_PORT: "22"
  GITLAB_HTTPS: "true"
  GITLAB_NOTIFY_ON_BROKEN_BUILDS: "true"
  GITLAB_NOTIFY_PUSHER: "false"
  GITLAB_PIPELINE_SCHEDULE_WORKER_CRON: "*/5 * * * *"
  # GitLab Backup
  GITLAB_BACKUP_SCHEDULE: "daily"
  GITLAB_BACKUP_TIME: "04:30"
  # GitLab DB
  DB_ADAPTER: "postgresql"
  DB_HOST: "__YOUR_POSTGRES_ADDRESS__"
  DB_PORT: "5432"
  DB_USER: "gitlab"
  DB_NAME: "gitlab"
  # GitLab Redis
  REDIS_HOST: "__YOUR_REDIS_ADDRESS__"
  REDIS_PORT: "6379"
  # Nginx settings
  NGINX_MAX_UPLOAD_SIZE: "100m"
  # GitLab SMTP settings
  GITLAB_EMAIL: "noreply@example.com"
  GITLAB_EMAIL_DISPLAY_NAME: "GitLab ZerBytes"
  GITLAB_EMAIL_REPLY_TO: "gitlab@example.com"
  SMTP_ENABLED: "true"
  SMTP_DOMAIN: "example.com"
  SMTP_HOST: "smtp.example.com"
  SMTP_PORT: "587"
  SMTP_USER: "gitlab"
  SMTP_STARTTLS: "true"
  SMTP_AUTHENTICATION: "login"
  # Your other config vars below
kind: ConfigMap
metadata:
  labels:
    app: gitlab
  name: gitlab-cm
```

### Secret

The values for the `data` keys, need to be `base64` encoded.
This can be done from the command line on most Linuxes using the `base64` command. Like this:

```console
echo -n "YOUR_VALUE" | base64 -w0
```

(The `-w0` stops `base64` wrapping after specific length per line)

In the manifest below there are variables beginning with `__YOUR_...__`, you need to replace those.

* `__YOUR_GITLAB_SECRETS_` variables should be replaced by `base64` encoded randomly generated strings.
* `__YOUR_DB_PASS__` should be replaced by `base64` encoded Postgres database server password.
* `__YOUR_SMTP_PASS__` should be replaced by `base64` encoded SMTP server password.
* `__YOUR_GITLAB_ROOT_PASSWORD__` should be replaced by `base64` encoded chosen first GitLab user `root` password of your choice.

The manifest looks like this:

```yaml
apiVersion: v1
data:
  GITLAB_SECRETS_DB_KEY_BASE: __YOUR_GITLAB_SECRETS_DB_KEY_BASE__
  GITLAB_SECRETS_SECRET_KEY_BASE: __YOUR_GITLAB_SECRETS_SECRET_KEY_BASE__
  GITLAB_SECRETS_OTP_KEY_BASE: __YOUR_GITLAB_SECRETS_OTP_KEY_BASE__
  DB_PASS: __YOUR_DB_PASS__
  SMTP_PASS: __YOUR_SMTP_PASS__
  GITLAB_ROOT_PASSWORD: __YOUR_GITLAB_ROOT_PASSWORD__
kind: Secret
metadata:
  labels:
    app: gitlab
  name: gitlab-secret
type: Opaque
```

### StatefulSet

This `StatefulSet` contains the image used and what is not often used `envFrom`. `envFrom` uses a list of "references" to ConfigMaps and Secrets and puts them as environment variables into the Pod.
Using `envFrom` has one disadvantage, when updating a ConfigMap or Secret referenced, the Pod doesn't get "updated"/recreated.
Depending on how you look at rolling out software every change to a ConfigMap and Secret can be considered a version change aka updating the object to trigger update of the Pods.

You need to replace `__STORAGE_CLASS__` with the available StorageClass in your Kubernetes cluster.

```yaml
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  labels:
    app: gitlab
  name: gitlab
spec:
  serviceName: gitlab
  replicas: 1
  volumeClaimTemplates:
  - metadata:
      name: gitlab-persistent-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: __STORAGE_CLASS__
      resources:
        requests:
          storage: 50Gi
  template:
    metadata:
      labels:
        app: gitlab
    spec:
      containers:
      - name: gitlab
        image: sameersbn/gitlab:10.1.1
        imagePullPolicy: Always
        envFrom:
          - configMapRef:
              name: gitlab-cm
          - secretRef:
              name: gitlab-secret
        ports:
        - containerPort: 22
          name: ssh
          protocol: TCP
        - containerPort: 80
          name: http
          protocol: TCP
        resources:
          limits:
            cpu: "2"
            memory: 4Gi
          requests:
            cpu: "500m"
            memory: "1Gi"
        volumeMounts:
        - name: gitlab-persistent-storage
          mountPath: /home/git/data
```

### Service

This Service is for the Ingress to be able to reach the GitLab.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: gitlab
  name: gitlab
spec:
  ports:
  - name: ssh
    port: 22
    protocol: TCP
  - name: http
    port: 80
    protocol: TCP
  selector:
    app: gitlab
```

### Ingress

To be able to reach the GitLab from outside the cluster over your Ingress controller of choice.
The Ingress requires the Service created in [Service](#Service).
You need to replace `__INGRESS_CLASS__` with your in cluster configured Ingress controller.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: gitlab-examplecom
  annotations:
    kubernetes.io/ingress.class: __INGRESS_CLASS__
spec:
  rules:
  - host: gitlab.example.com
    http:
      paths:
      - path: /
        backend:
          serviceName: gitlab
          servicePort: 80
```

## Step 3 - Create the manifests

You can either a) save all manifests in one file, but then separated by `---` or b) per manifest on file.
To create/run the mnaifests on Kubernetes, you can now go ahead an run:

```console
kubectl create -f FILE_NAME
```

Where `FILE_NAME` is the name of the file containing the mnaifest(s).
If the command I suggest you take a look at the line which `kubectl` told you the error is.

## Step 4 - Login to your new GitLab

If everything was successfull, you should be able to see your GitLab instance in,
depending on the server network bandwith and GitLab database setup speed, about 10-15 minutes.

You should then be able to login to your GitLab over the domain name you used in the [Ingress manifest](#Ingress).
With the example values above the address would be `https://gitlab.example.com`.

The login information for the first "root" user is:

* Username: `root`
* Password: `base64` decoded value chosen in [Secret - GITLAB_ROOT_PASSWORD](#Secret)

## Summary

I hope this gives a good idea on how to run GitLab on Kubernetes or even simply a starting point for extending/customizing the manifests for your needs.
Another starting point that also contains manifests for a single Postgres and Redis server, can be found here: https://github.com/sameersbn/docker-gitlab/tree/master/kubernetes.

Have Fun!
