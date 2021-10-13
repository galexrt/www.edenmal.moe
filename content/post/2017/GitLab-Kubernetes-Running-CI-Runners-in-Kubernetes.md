---
title: 'GitLab + Kubernetes: Running CI Runners in Kubernetes'
description: "How to run GitLab CI Runners in Kubernetes using the GitLab CI Runner's Kubernetes executor."
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2017-08-31T09:30:00+02:00"
tags:
  - Continuous Delivery
  - GitLab
  - Kubernetes
  - Container
categories:
  - GitLab
cover: /post/2017/GitLab-Kubernetes-Running-CI-Runners-in-Kubernetes/GitLab-Kubernetes-Running-CI-Runners-in-Kubernetes.png
---

## Intro

In this post, I'll be going over using GitLab CI to create your application's container Continuous Delivery to Kubernetes.
This is the second post in the three post series about Kubernetes and GitLab. The first post can be found here: [Edenmal - GitLab + Kubernetes: Perfect Match for Continuous Delivery with Container]({{< ref "/post/2017/GitLab-Kubernetes-Perfect-Match-for-Continuous-Delivery-with-Container.md" >}}).

> **NOTE** Please check the requirements before beginning.

### Requirements

* Kubernetes cluster
* Running GitLab instance
* `kubectl` binary (with Kubernetes cluster access)
* StorageClass configured in Kubernetes
  * `ReadWriteMany` Persistent Storage (example CephFS using [Rook](https://rook.io))

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

The `kubectl` command `cluster-info` shows you if you can connect to the cluster and list the available cluster services (in the ouput: Kubernetes apiserver and KubeDNS service).

## Step 2 - Get GitLab CI Register Token from GitLab

Go to your GitLab instance and go to the Admin area.

To go to your Admin area, click the wrench icon next to the search bar in the top right of any GitLab page:
![GitLab Admin area icon position](gitlab-admin-area-icon-position.png)

Next click on the Runners tab in the navbar.
![GitLab Admin area Runners tab](gitlab-admin-area-navbar.png)

Et-voilà! There is your token (in the picture the token would be where the blanked out area is).
![GitLab Admin area Runners Token](gitlab-admin-area-token.png)

Now copy the token somewhere safe for usage in [Step 3 - Write manifest for GitLab CI Runners](#Step-3-Write-manifest-for-GitLab-CI-Runners).

> **NOTE** Keep the token securely stored!

## Step 3 - Write Kubernetes manifests for GitLab CI Runners

This step will show you the manifests for the GitLab CI runner manifests for Kubernetes.

### Kubernetes API References

The Kubernetes API references can be found on the official [Kubernetes.io](https://kubernetes.io) page here: https://kubernetes.io/docs/reference/
All manifests should be compatible with Kubernetes `1.7`.

### Namespace for the build tasks

Replace `YOUR_GITLAB_BUILD_NAMESPACE` with a name for the namespace in which the GitLab CI builds are run. The separate namespace for the GitLab CI builds is useful for detecting stuck containers (for example when there was an issue with the runner not cleaning up).

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: YOUR_GITLAB_BUILD_NAMESPACE
```

### ConfigMap for the Environment Variables and Script

First we gonna start with the `ConfigMap` for the basic configuration using environment variables of the GitLab CI Runner image:
You have to point `YOUR_GITLAB_CI_SERVER_URL` to your GitLab instance's URL with `/ci` appended to it (like this `https://gitlab.example.com/ci`).
Also you need to replace `YOUR_GITLAB_BUILD_NAMESPACE` with the name of the namespace from the step [Namespace for the build tasks](#Namespace-for-the-build-tasks) in every manifest coming up.

```yaml
apiVersion: v1
data:
  REGISTER_NON_INTERACTIVE: "true"
  REGISTER_LOCKED: "false"
  CI_SERVER_URL: "YOUR_GITLAB_CI_SERVER_URL"
  METRICS_SERVER: "0.0.0.0:9100"
  RUNNER_REQUEST_CONCURRENCY: "4"
  RUNNER_EXECUTOR: "kubernetes"
  KUBERNETES_NAMESPACE: "YOUR_GITLAB_BUILD_NAMESPACE"
  KUBERNETES_PRIVILEGED: "true"
  KUBERNETES_CPU_REQUEST: "250m"
  KUBERNETES_MEMORY_REQUEST: "256Mi"
  KUBERNETES_CPU_LIMIT: "1"
  KUBERNETES_MEMORY_LIMIT: "1Gi"
  KUBERNETES_SERVICE_CPU_REQUEST: "150m"
  KUBERNETES_SERVICE_MEMORY_REQUEST: "256Mi"
  KUBERNETES_SERVICE_CPU_LIMIT: "1"
  KUBERNETES_SERVICE_MEMORY_LIMIT: "1Gi"
  KUBERNETES_HELPER_CPU_REQUEST: "150m"
  KUBERNETES_HELPER_MEMORY_REQUEST: "100Mi"
  KUBERNETES_HELPER_CPU_LIMIT: "500m"
  KUBERNETES_HELPER_MEMORY_LIMIT: "200Mi"
  KUBERNETES_PULL_POLICY: "if-not-present"
  KUBERNETES_TERMINATIONGRACEPERIODSECONDS: "10"
  KUBERNETES_POLL_INTERVAL: "5"
  KUBERNETES_POLL_TIMEOUT: "360"
kind: ConfigMap
metadata:
  labels:
    app: gitlab-ci-runner
  name: gitlab-ci-runner-cm
  namespace: YOUR_GITLAB_BUILD_NAMESPACE
```

The above `ConfigMap` also adds resource requests and limits to the build containers run. You can change them as long as they follow the Kubernetes resource limits units.

> **NOTE**
>
> When you have added new options to the `ConfigMap`, you need to delete each GitLab CI Runner Pod. This is currently a limitation of using Kubernetes `envFrom` instead of `env` directly (`envFrom` helps keep manifests shorter by moving the environment variables out to `ConfigMap`s or `Secret`s).
>
> **NOTE**
>
> To add additional options (/flags), you need to run `gitlab-ci-multi-runner register --help` in the `Pod` to see all available flags with their matching environment variable counter part (in square brackets, without the `$` sign) next to the flag name.
> You just add the env vars for the flags you want to configure, as shown in the above `ConfigMap`.
>
> Example output of `gitlab-ci-multi-runner register --help`:
>
```console
gitlab-runner@gitlab-ci-runner-0:/$ gitlab-ci-multi-runner --help
[...]
--kubernetes-cpu-limit value                          The CPU allocation given to build containers (default: "1") [$KUBERNETES_CPU_LIMIT]
--kubernetes-memory-limit value                       The amount of memory allocated to build containers (default: "4Gi") [$KUBERNETES_MEMORY_LIMIT]
--kubernetes-service-cpu-limit value                  The CPU allocation given to build service containers (default: "1") [$KUBERNETES_SERVICE_CPU_LIMIT]
--kubernetes-service-memory-limit value               The amount of memory allocated to build service containers (default: "1Gi") [$KUBERNETES_SERVICE_MEMORY_LIMIT]
--kubernetes-helper-cpu-limit value                   The CPU allocation given to build helper containers (default: "500m") [$KUBERNETES_HELPER_CPU_LIMIT]
--kubernetes-helper-memory-limit value                The amount of memory allocated to build helper containers (default: "3Gi") [$KUBERNETES_HELPER_MEMORY_LIMIT]
--kubernetes-cpu-request value                        The CPU allocation requested for build containers [$KUBERNETES_CPU_REQUEST]
[...]
```

> **NOTE**
>
> To run a command in the GitLab CI Runner Pods, use `kubectl exec -n YOUR_GITLAB_BUILD_NAMESPACE -it gitlab-ci-runner-0 /bin/bash`. This will drop you into the Pod and give you `bash` shell.

Next up is the `ConfigMap` which contains a small script which registers, runs and unregisters the GitLab CI Runner.
The runner unregister will only be triggered when the Pod is normally terminated through Kubernetes (`TERM` signal).
In case of a forced termination of the Pod (`SIGKILL` signal), the CI runner won't unregister itself. Cleanup of such "killed" CI Runners has to be done manually.
More information on Pod termination can be found here: [Kubernetes - Pods - Termination of Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods).

```yaml
apiVersion: v1
data:
  run.sh: |
    #!/bin/bash
    unregister() {
        kill %1
        echo "Unregistering runner ${RUNNER_NAME} ..."
        /usr/bin/gitlab-ci-multi-runner unregister -t "$(/usr/bin/gitlab-ci-multi-runner list 2>&1 | tail -n1 | awk '{print $4}' | cut -d'=' -f2)" -n ${RUNNER_NAME}
        exit $?
    }
    trap 'unregister' EXIT HUP INT QUIT PIPE TERM
    echo "Registering runner ${RUNNER_NAME} ..."
    /usr/bin/gitlab-ci-multi-runner register -r ${GITLAB_CI_TOKEN}
    sed -i 's/^concurrent.*/concurrent = '"${RUNNER_REQUEST_CONCURRENCY}"'/' /home/gitlab-runner/.gitlab-runner/config.toml
    echo "Starting runner ${RUNNER_NAME} ..."
    /usr/bin/gitlab-ci-multi-runner run -n ${RUNNER_NAME} &
    wait
kind: ConfigMap
metadata:
  labels:
    app: gitlab-ci-runner
  name: gitlab-ci-runner-scripts
  namespace: YOUR_GITLAB_BUILD_NAMESPACE
```

### Secret for the Token Environment Variable

Then we'll use the GitLab CI runner token to create a secret in Kubernetes for it to use it in the `Statefulset`.

To encode the token as base64, you can run something like this:

```console
$ echo YOUR_GITLAB_CI_TOKEN | base64 -w0
```

(`base64` should be available and already installed on most Linux distributions)

Replace `YOUR_BASE64_ENCODED_TOKEN` with the output from the above command.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gitlab-ci-token
  namespace: YOUR_GITLAB_BUILD_NAMESPACE
  labels:
    app: gitlab-ci-runner
data:
  GITLAB_CI_TOKEN: YOUR_BASE64_ENCODED_TOKEN
```

### Statefulset for the actually running the Runners in Kubernetes

This container specification for the GitLab CI runner has a twist added to it. On start the runer tries to unregister any runner with the same name. This is especially useful when a node is lost (aka `NodeLost` event). It then tries to re-register itself and then begin to run. On a normal stop of the Pod, the GitLab CI runner will run the `unregister` command to try to unregister itself, so it won't be used by GitLab anymore. This is done by using Kubernetes `lifecycle` "hooks", documentation about them can be found here: [Kubernetes.io - Container Lifecycle Hooks](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/).

Another awesome thing is that using `envFrom` allows to specify `Secret`s and `ConfigMap`s to be used as environment variables (variables are only set when they match the specific regex for environment variables).

```yaml
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  name: gitlab-ci-runner
  namespace: YOUR_GITLAB_BUILD_NAMESPACE
  labels:
    app: gitlab-ci-runner
spec:
  updateStrategy:
    type: RollingUpdate
  replicas: 2
  serviceName: gitlab-ci-runner
  template:
    metadata:
      labels:
        app: gitlab-ci-runner
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - topologyKey: "kubernetes.io/hostname"
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - gitlab-ci-runner
      volumes:
      - name: gitlab-ci-runner-scripts
        projected:
          sources:
          - configMap:
              name: gitlab-ci-runner-scripts
              items:
              - key: run.sh
                path: run.sh
                mode: 0755
      serviceAccountName: gitlab-ci
      securityContext:
        runAsNonRoot: true
        runAsUser: 999
        supplementalGroups: [999]
      containers:
      - image: gitlab/gitlab-runner:v12.6.0
        name: gitlab-ci-runner
        command:
        - /scripts/run.sh
        envFrom:
        - configMapRef:
            name: gitlab-ci-runner-cm
        - secretRef:
            name: gitlab-ci-token
        env:
        - name: RUNNER_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        ports:
        - containerPort: 9100
          name: http-metrics
          protocol: TCP
        volumeMounts:
        - name: gitlab-ci-runner-scripts
          mountPath: "/scripts"
          readOnly: true
      restartPolicy: Always
```

> **NOTE**
>
> Be sure to use the "latest" available image tag for the GitLab CI runner (`image:`).
> The available image tags for the `gitlab/gitlab-runner` image can be found here: [gitlab/gitlab-runner Tags - Docker Hub](https://hub.docker.com/r/gitlab/gitlab-runner/tags).
>
> It is not recommended to use "dynamic static" tags (e.g., `latest`, `bleeding`, etc). Best is to use a specific tag, which makes debugging easier.

### RBAC: ServiceAccount, Role and Rolebinding

> **NOTE**
>
> If you are not using RBAC, skip this section.
>
> **NOTE**
>
> I know for myself that the `Role` used here can and should be improved. Though as it is **not** a wildcard `ClusterRole` it is not that worse at least for my setup as the `YOUR_GITLAB_BUILD_NAMESPACE` namespace is dedicated for GitLab CI.

As noted above:

* These are very very very (did I say very?) open permissions granted to the GitLab CI runners.
* These can/should/must be refined and reduced for "real" production environments.

If you had the time to refine/reduce them, please let me know in the comments. I'm happy to give you a shoutout in the post and add your improved `Role`, thanks!

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gitlab-ci
  namespace: YOUR_GITLAB_BUILD_NAMESPACE
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: YOUR_GITLAB_BUILD_NAMESPACE
  name: gitlab-ci
rules:
  - apiGroups: [""]
    resources: ["*"]
    verbs: ["*"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: gitlab-ci
  namespace: YOUR_GITLAB_BUILD_NAMESPACE
subjects:
  - kind: ServiceAccount
    name: gitlab-ci
    namespace: YOUR_GITLAB_BUILD_NAMESPACE
roleRef:
  kind: Role
  name: gitlab-ci
  apiGroup: rbac.authorization.k8s.io
```

Should you experience issues creating the `Role` object and you are on GKE (other Kubernetes as a Service platforms maybe affected too), please take a look at this GitHub issue: [GitHub coreos/prometheus-operator RBAC on GKE - extra step needed #357](https://github.com/coreos/prometheus-operator/issues/357#issue-227263978).
Thanks to [Parama Danoesubroto](https://disqus.com/by/paramaw/) for commenting about this for GKE (see his comment http://disq.us/p/1r9y13d)!

## Step 4 - Create the manifests

To interact with the Kubernetes cluster the `kubectl` programm is used. To create/"run" a manifest on the Kubernetes cluster the subcommand `create` is used.
An example, like this:

```console
kubectl create -f FILE_NAME
```

The `FILE_NAME` would be the corresponding name of file you saved the manifest(s) in.
To specify multiple manifests in one go, just add `-f FILE_NAME` per file behind the `create`. Like this `kubectl create -f FILE_NAME_1 -f FILE_NAME_2 -f FILE_NAME_3 ...`.

Now specify the manifests you created in the [Step 3 - Write manifest for GitLab CI Runners](#Step-3-Write-manifest-for-GitLab-CI-Runners).

## Step 5 - Check the GitLab CI Runners

> **NOTE**
>
> For an example GitLab CI pipeline construct, please take a look at the repository on GitHub [galexrt/presentation-gitlab-k8s](https://github.com/galexrt/presentation-gitlab-k8s).

Go to the GitLab Admin area and there to the "Runners" tab as shown above.

{{< figure src="gitlab-runners-list.png" width="100%" title="GitLab Runners List" >}}

In the table/list below where you got the GitLab runner token from, the runners should habe appeared.
If not check the [Troubleshooting](#Troubleshooting) section below.

## Troubleshooting

### Check the logs of the GitLab CI runner Pods

To get logs from one of the GitLab CI runner pods, you can use the following command:

```console
$ kubectl logs -f gitlab-ci-runner-0
[...]
GITLAB_CI_RUNNER_0_POD_LOGS_HERE
[...]
```

The `-f` option is causing the logs to be streamed, like with the `tail` command.
Check the logs for any errors.

## Summary

Now you should have two (or more depending if you have changed the `replicas` count in the `StatefulSet` manifest) GitLab CI runner that use Kubernetes as an so called executor for CI tasks.

Have Fun!
