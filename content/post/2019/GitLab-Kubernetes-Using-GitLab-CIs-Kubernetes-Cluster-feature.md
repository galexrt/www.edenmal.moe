---
title: "GitLab + Kubernetes: Using GitLab CI's Kubernetes Cluster feature - UPDATED"
description: 'This post shows possibilites on how to use GitLab in combination with Kubernetes to contionously deliver your applications with Container, using the new GitLab CI Kubernetes Cluster feature.'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2019-06-10T14:53:20+02:00"
tags:
  - Continuous Delivery
  - GitLab
  - Kubernetes
  - Container
categories:
  - GitLab
cover: /post/2018/GitLab-Kubernetes-Using-GitLab-CIs-Kubernetes-Cluster-feature/GitLab-Kubernetes-Using-GitLab-CIs-Kubernetes-Cluster-feature.png
---

## Intro
This post walks through using GitLab CI's Kubernetes Cluster feature to deploy built container images to Kubernetes.

This is an update to my old guide which uses the in GitLab `10.3` deprecated Kubernetes integration feature, see: [GitLab + Kubernetes: Perfect Match for Continuous Delivery with Container]({{< ref "/post/2017/GitLab-Kubernetes-Perfect-Match-for-Continuous-Delivery-with-Container.md" >}}).

> **NOTE**
>
> Please check the requirements before beginning.

### Requirements

* Kubernetes Cluster
* GitLab instance
    * GitLab Container Registry enabled.
    * GitLab CI runner configured and enabled.
        * The CI runners must be able to access the Kubernetes apiserver.
* `kubectl` configured with Kubernetes cluster access.
* Kubernetes `ServiceAccount`
    * That has specific permissions, for more information see [Step 2 - Get ServiceAccount Token from Kubernetes](#Step-2-Get-ServiceAccount-Token-from-Kubernetes).

> **NOTE**
>
> In this post the Kubernetes `Namespace` `presentation-gitlab-k8s` will be used for "everything". If you want to use your own, be sure to replace `presentation-gitlab-k8s` `Namespace` in the example fiels and / or snippets in the post.

## GitLab CI Kubernetes Cluster Feature

The GitLab CI Kubernetes Cluster feature is the successor of the deprecated and beginning with `10.3d` disabled Kubernetes project integration.
Thankfully it is "100%" backwards compatible.

Though I have to note that I find it a bit "mehh" that you can only create/add one Kubernetes cluster in the GitLab community edition (CE).

## Step 1 - Download and "import" example Repository
The repository with the files used in this blog post are available on GitHub: [galexrt/presentation-gitlab-k8s](https://github.com/galexrt/presentation-gitlab-k8s).
You can use the GitLab repository import functionality to import the repository. If you imported the repository into your GitLab, you should already see GitLab CI begin to do it's work, but fail on the `release_upload` and at latest on the `deploy_dev` task, as you shouldn't have the Kubernetes integration configured and activated before you even read the post yet ;)

> **NOTE**
>
> If you have now/already imported the repository, jump to [Step 2 - Get ServiceAccount Token from Kubernetes](#Step-2-Get-ServiceAccount-Token-from-Kubernetes)-

When creating the repository, keep it empty! Don't add a `README` or anything at all to it.
Go ahead and clone my repository with the files locally. To import the repository the remote needs to be changed. For this we run the following commands:

```console
$ git clone https://github.com/galexrt/presentation-gitlab-k8s.git
$ cd presentation-gitlab-k8s
# Change the remote of the repository
$ git remote set-url origin YOUR_GITLAB_PROJECT_URL
# Now to push/"import" the repository run:
$ git push -u origin master
```

In the end it should have been successful and when navigating to the repository in the GitLab, you should see the files in the repository.
If you have problems with importing the repository, please see this Stackoverflow post: https://stackoverflow.com/a/20360068/2172930.

Now we can begin with the GitLab Kubernetes integration.

## Step 2 - Get a `ServiceAccount` Token from Kubernetes

Before continuing, make sure that the `Namespace` for the example files of the repository exist by running:

```console
kubectl create ns presentation-gitlab-k8s
```

For the GitLab Kubernetes integration a `ServiceAccount` token is needed.
The `ServiceAccount` token is used during `environment` builds, builds by which an environment should be deployed, by the GitLab CI Runner to connect and authenticate with your Kubernetes cluster and apply the manifests.

The GitLab documentation has an example for creating a `ServiceAccount` with the necessary permissions though I would not recommed to use it.
Because it is very open permissions-wise, as it uses the `cluster-admin` ClusterRole on a cluster-wide scope. This basically grants the person that has the `ServiceAccount` token full access to the Kubernetes cluster, which I personally **do not** recommend!

The following snippet is a `ServiceAccount` with a `Role` and `RoleBinding`, which means that the `ServiceAccount` only gets the permissions of the `Role` `gitlab-ci` in the `presentation-gitlab-k8s` `Namespaces` the `RoleBinding` exists in.
This allows for fine grained control to which the `ServiceAccount` has access to, so that if you need to deploy to more than one `Namespace` you can simply create the `Role` and `RoleBinding` to be in another `Namespace` while leaving the `namespace:` field in the `subjets:` list as is targeting the `ServiceAccount` in the `Namespace` the token is used from.

> **FILE** [`gitlab-ci/rbac.yaml`](https://github.com/galexrt/presentation-gitlab-k8s/blob/master/gitlab-ci/rbac.yaml)

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gitlab-ci
  namespace: presentation-gitlab-k8s
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: presentation-gitlab-k8s
  name: gitlab-ci
rules:
- apiGroups: [""]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["apps"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["batch"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["extensions"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["autoscaling"]
  resources: ["*"]
  verbs: ["*"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: gitlab-ci
  namespace: presentation-gitlab-k8s
subjects:
- kind: ServiceAccount
  name: gitlab-ci
  namespace: presentation-gitlab-k8s
roleRef:
  kind: Role
  name: gitlab-ci
  apiGroup: rbac.authorization.k8s.io
```

> **NOTE**
>
> It is highly recommended to **have a separate `ServiceAccount` for each application** accessing the Kubernetes API!
> Another project should always get its own token, so in the access logs it can be better seen which token has been (mis-)used.
>
> Should you experience issues creating the `ClusterRole(Binding)` / `Role(Binding)` object, and you are on GKE or other Kubernetes as a Service platforms, please take a look at this GitHub issue: [GitHub coreos/prometheus-operator RBAC on GKE - extra step needed #357](https://github.com/coreos/prometheus-operator/issues/357#issue-227263978).

In my case even if it not the best way, I'll go with the default `ServiceAccount` created in the namespace where I will run the application.
For that I check what `Secrets` exist, then get the secret and base64 decode it.

```console
$ kubectl get -n presentation-gitlab-k8s secret
NAME                    TYPE                                  DATA   AGE
default-token-2kmsr     kubernetes.io/service-account-token   3      3m11s
gitlab-ci-token-jlc58   kubernetes.io/service-account-token   3      118s
# In this case the ServiceAccount token Secret is named `gitlab-ci-token-jlc58`,
# the name of the Secret will differ between clusters (it will always start with `gitlab-ci-token-`)
$ kubectl get -n presentation-gitlab-k8s secret gitlab-ci-token-jlc58 -o yaml
apiVersion: v1
data:
  ca.crt: [REDACATED]
  namespace: [REDACATED]
  token: [BASE64_ENCODED_TOKEN_HERE]
kind: Secret
metadata:
[...]
  name: gitlab-ci-token-jlc58
  namespace: presentation-gitlab-k8s
[...]
type: kubernetes.io/service-account-token
$ echo BASE64_ENCODED_TOKEN_HERE | base64 -d
YOUR_DECODED_TOKEN
# Long cryptic looking output, copy it.
```

Copy `YOUR_DECODED_TOKEN` somewhere safe for an upcoming step.

## Step 3 - Get the Kubernetes CA Certificate

As you may have seen in [Step 2 - Get a `ServiceAccount` Token from Kubernetes](#step-2-get-a-serviceaccount-token-from-kubernetes) from the `kubectl get secrets` command output, there was a key named `ca.crt` in it.

```console
$ kubectl get -n presentation-gitlab-k8s secret
NAME                    TYPE                                  DATA   AGE
default-token-2kmsr     kubernetes.io/service-account-token   3      3m11s
gitlab-ci-token-jlc58   kubernetes.io/service-account-token   3      118s
# In this case the ServiceAccount token Secret is named `gitlab-ci-token-jlc58`,
# the name of the Secret will differ between clusters (it will always start with `gitlab-ci-token-`)
$ kubectl get -n presentation-gitlab-k8s secret gitlab-ci-token-jlc58 -o yaml
apiVersion: v1
data:
  ca.crt: [BASE64_ENCODED_CA_CERT_HERE]
  namespace: [REDACATED]
  token: [REDACATED]
kind: Secret
metadata:
[...]
  name: gitlab-ci-token-jlc58
  namespace: presentation-gitlab-k8s
[...]
type: kubernetes.io/service-account-token
$ echo BASE64_ENCODED_CA_CERT_HERE | base64 -d
YOUR_BASE64_DECODED_CA_CERT_HERE

# Looks something like this:
-----BEGIN CERTIFICATE-----
[REDACATED]
-----END CERTIFICATE-----
```

> **NOTE**
>
> If you have not been able to get the Kubernetes CA certificate through this method, there might be something wrong with your Kuberleltes cluster. Be sure to contact your Kubernetes cluster administrator / support team.

Save the CA certificate (`YOUR_BASE64_DECODED_CA_CERT_HERE`) somewhere safe with the token from [Step 2 - Get `ServiceAccount` Token from Kubernetes](#step-2-get-a-serviceaccount-token-from-kubernetes).

## Step 4 - Create a Kubernetes cluster in GitLab CI

You will now need the `ServiceAccount` token, the CA certificate, Kubernetes API server address and the namespace you want to run the application in.

In your GitLab's sidebar, go to `Operations` -> `Kubernetes` and you should get to this page:

{{< figure src="gitlab-ci-kubernetes-cluster-empty-cluster-list.png" width="800px" title="GitLab CI Kubernetes cluster - Cluster list page" >}}

Now click the `Add Kubernetes cluster` button and you come to this page with two tabs.
On this page you can decide, if you want to create a new Google GKE cluster or add an existing cluster.

Click the `Add existing cluster` tab, in which we can input the Kubernetes cluster information we just gathered the information in the last few steps:_

{{< figure src="gitlab-ci-kubernetes-cluster-add-form.png" width="800px" title="GitLab CI Kubernetes cluster - Add existing cluster form" >}}

Fill in the fields as follows:

* `Kubernetes cluster name` - can be "anything", pick something you are able to identify the cluster later on again in case of issues. The other fields should be filled with the information we gathered it in the previous steps.
* `API URL` - the address of the Kubernetes API server, this depends on where your GitLab CI runners are running. If they are running inside the Kubernetes cluster (e.g., followed the [tutorial on my blog]({{< ref "/post/2017/GitLab-Kubernetes-Running-CI-Runners-in-Kubernetes.md" >}})), you should put `https://kubernetes.default.svc.cluster.local:443` there. When the runners are external to the clusters put the load balanced Kubernetes API Server address here.
    * Keep in mind that the `cluster.local` is Kubernetes default cluster domain name, be sure to set it according to your Kubernetes.
* `CA Certificate` - CA certificate of your Kubernetes cluster from [Step 3 - Get the Kubernetes CA Certificate](#step-3-get-the-kubernetes-ca-certificate).
* `Service Token` - The `ServiceAccount` token we extracted in [Step 2 - Get `ServiceAccount` Token from Kubernetes](#step-2-get-a-serviceaccount-token-from-kubernetes).
* `Project namespace (optional, unique)` - Optional. I highly recommend setting the `Namespace` to be used in Kubernetes here.
    * In case of the example files / repository, the `Namespace` `presentation-gitlab-k8s` is used. If you wanna use your own `Namespace` here, please be sure that you have created everything till now in your `Namespace` and are going to edit / set / modify all the manifests with your `Namespace`.
* `RBAC-enabled cluster` - Should be ticked as hopefully only Kubernetes clusters with RBAC enabled exists anymore.
* `GitLab-managed cluster` - Untick as you the project owner should take care of creating Namespaces for your projects. Due to the lowered permissions scoped to Namespaces and not the whole cluster, see [Step 2 - Get a `ServiceAccount` Token from Kubernetes](#step-2-get-a-serviceaccount-token-from-kubernetes).

Click `Add Kubernetes cluster` to add the cluster to GitLab and you now have the Kubernetes cluster feature / integration activated and ready.

## Step 5 - Add a `.gitlab-ci.yml` to your project

> **NOTE**
>
> Replace `registry.example.com` is the address to your GitLab container registry.
> `s3.example.com` is just a [minio](https://minio.io/) instance where I upload the artifact to an "external" destination for demonstration. To remove this step just delete the `release_upload` structure.
> Replace `{gitlab,s3,registry}.example.com` with your corresponding domain name!

> **WARNING**
>
> You should first commit when you are done with adding all the manifests from all the other **sixth step** to come too!

A job in the `.gitlab-ci.yml` file looks like this:

```yaml
# run the golang application tests
test:
    stage: test
    script:
        - go test ./...
```
The job above would run for the `test` stage.

To specify the stages to be run, you put a simple list of the names anywhere in the file:
```yaml
# list of all stages
stages:
    - test
    - build
    - release
    - deploy
```

You can specify the image to be used to run the commands on a global level or on a per job basis. To extend the given job example, see below how you can specify the image:

```yaml
# For jobs without a image specified use the below Docker image
image: golang:1.12.5-stretch
# Or for the test job the image `golang:1.9` will be used:
test:
    stage: test
    image: python:3
    script:
        - echo Something in the test step in a python:3 image
```

> **NOTE**
>
> For other parts of the `.gitlab-ci.yml`, please check the comments in the file below or just checkout the GitLab CI documentation for all possible settings/parameters here: https://docs.gitlab.com/ce/ci/yaml/README.html.

In the `.gitlab-ci.yml` 4 stages are defined `test`, `build`, `release` and `deploy`:

* `test` stage simply runs [go test](https://golang.org/cmd/go/#hdr-Test_packages) to test the example Golang application in this case.
* `build` stage compiles the application and tells GitLab CI that the end binary `app` is an artifact to be preserved in GitLab and the build containers.
* `release` stage in which the `image_build` job, builds the Docker image and pushes it into the GitLab Container Registry. In the `release` stage, I also upload the artifact `app` into a S3.
* `deploy` stage for branches always deploys to the `dev` environment, for tags it will be deployed to `dev` and the manually triggered into `live` environment.

> **FILE** [`.gitlab-ci.yml`](https://github.com/galexrt/presentation-gitlab-k8s/blob/master/.gitlab-ci.yml)

The whole `.gitlab-ci.yml` file looks like this:

```yaml
image:
  name: golang:1.12.5-stretch
  entrypoint: ["/bin/sh", "-c"]

# The problem is that to be able to use go get, one needs to put
# the repository in the $GOPATH. So for example if your gitlab domain
# is mydomainperso.com, and that your repository is repos/projectname, and
# the default GOPATH being /go, then you'd need to have your
# repository in /go/src/mydomainperso.com/repos/projectname
# Thus, making a symbolic link corrects this.
before_script:
  - mkdir -p "/go/src/gitlab.example.com/${CI_PROJECT_PATH}"
  - ln -sf "${CI_PROJECT_DIR}" "/go/src/gitlab.example.com/${CI_PROJECT_PATH}"
  - cd "/go/src/gitlab.example.com/${CI_PROJECT_PATH}/"

stages:
  - test
  - build
  - release
  - review
  - deploy

test:
  stage: test
  script:
    - make test

test2:
  stage: test
  script:
    - sleep 3
    - echo "We did it! Something else runs in parallel!"

compile:
  stage: build
  script:
    # Add here all the dependencies, or use glide/govendor/...
    # to get them automatically.
    - make build
  artifacts:
    paths:
      - app

# Example job to upload the built release to a S3 server with mc
# For this you need to set `S3_ACCESS_KEY` and `S3_SECRET_KEY` in your GitLab project CI's secret variables
#release_upload:
#  stage: release
#  image:
#    name: minio/mc
#    entrypoint: ["/bin/sh", "-c"]
#  script:
#    - echo "=> We already have artifact sotrage in GitLab! This is for demonstational purposes only."
#    - mc config host add edenmalmoe https://s3.edenmal.net ${ACCESS_KEY} ${SECRET_KEY} S3v4
#    - mc mb -p edenmalmoe/build-release-${CI_PROJECT_NAME}/
#    - mc cp app edenmalmoe/build-release-${CI_PROJECT_NAME}/


image_build:
  stage: release
  image:
    name: docker:latest
    entrypoint: ["/bin/sh", "-c"]
  variables:
    DOCKER_HOST: tcp://localhost:2375
  services:
    - docker:dind
  script:
    - docker info
    - docker login -u "${CI_REGISTRY_USER}" -p "${CI_REGISTRY_PASSWORD}" "${CI_REGISTRY}"
    - docker build -t "${CI_REGISTRY_IMAGE}:latest" .
    - docker tag "${CI_REGISTRY_IMAGE}:latest" "${CI_REGISTRY_IMAGE}:${CI_COMMIT_REF_NAME}"
    - test ! -z "${CI_COMMIT_TAG}" && docker push "${CI_REGISTRY_IMAGE}:latest"
    - docker push "${CI_REGISTRY_IMAGE}:${CI_COMMIT_REF_NAME}"

deploy_review:
  image:
    name: lachlanevenson/k8s-kubectl:latest
    entrypoint: ["/bin/sh", "-c"]
  stage: review
  only:
    - branches
  except:
    - tags
  environment:
    name: review/$CI_BUILD_REF_NAME
    url: https://$CI_ENVIRONMENT_SLUG-presentation-gitlab-k8s.edenmal.net
    on_stop: stop_review
    kubernetes:
      namespace: presentation-gitlab-k8s
  script:
    - kubectl version
    - cd manifests/
    - sed -i "s~__CI_REGISTRY_IMAGE__~${CI_REGISTRY_IMAGE}~" deployment.yaml
    - sed -i "s/__CI_ENVIRONMENT_SLUG__/${CI_ENVIRONMENT_SLUG}/" deployment.yaml ingress.yaml service.yaml
    - sed -i "s/__VERSION__/${CI_COMMIT_REF_NAME}/" deployment.yaml ingress.yaml service.yaml
    - |
      if kubectl apply -f deployment.yaml | grep -q unchanged; then
          echo "=> Patching deployment to force image update."
          kubectl patch -f deployment.yaml -p "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"ci-last-updated\":\"$(date +'%s')\"}}}}}"
      else
          echo "=> Deployment apply has changed the object, no need to force image update."
      fi
    - kubectl apply -f service.yaml || true
    - kubectl apply -f ingress.yaml
    - kubectl rollout status -f deployment.yaml
    - kubectl get all,ing -l ref=${CI_ENVIRONMENT_SLUG}

stop_review:
  image:
    name: lachlanevenson/k8s-kubectl:latest
    entrypoint: ["/bin/sh", "-c"]
  stage: review
  variables:
    GIT_STRATEGY: none
  when: manual
  only:
    - branches
  except:
    - master
    - tags
  environment:
    name: review/$CI_BUILD_REF_NAME
    action: stop
    kubernetes:
      namespace: presentation-gitlab-k8s
  script:
    - kubectl version
    - kubectl delete ing -l ref=${CI_ENVIRONMENT_SLUG}
    - kubectl delete all -l ref=${CI_ENVIRONMENT_SLUG}

deploy_live:
  image:
    name: lachlanevenson/k8s-kubectl:latest
    entrypoint: ["/bin/sh", "-c"]
  stage: deploy
  environment:
    name: live
    url: https://live-presentation-gitlab-k8s.edenmal.net
    kubernetes:
      namespace: presentation-gitlab-k8s
  only:
    - tags
  when: manual
  script:
    - kubectl version
    - cd manifests/
    - sed -i "s~__CI_REGISTRY_IMAGE__~${CI_REGISTRY_IMAGE}~" deployment.yaml
    - sed -i "s/__CI_ENVIRONMENT_SLUG__/${CI_ENVIRONMENT_SLUG}/" deployment.yaml ingress.yaml service.yaml
    - sed -i "s/__VERSION__/${CI_COMMIT_REF_NAME}/" deployment.yaml ingress.yaml service.yaml
    - kubectl apply -f deployment.yaml
    - kubectl apply -f service.yaml
    - kubectl apply -f ingress.yaml
    - kubectl rollout status -f deployment.yaml
    - kubectl get all,ing -l ref=${CI_ENVIRONMENT_SLUG}
```
> **NOTE**
>
> Be sure to replace `gitlab.example.com` with your GitLab address and / or remove the top `before_script:` part when using `go mod`.

There are special control keys like `when` and `only` that allow for limiting the runs of the CI, to for example with `only: ["tags"]` to run for created tags only and so on.
More on this topic can be found at the GitLab CI YAML file documentation here: https://docs.gitlab.com/ce/ci/yaml/README.html

I hope you can what it does by looking at the `script` parts of the jobs and the stages that will be run.

## Step 6 - Add Docker login information to Kubernetes

To be able to deploy the built image from the GitLab registry later on, you need to add the Docker login information for the GitLab Registry as a `Secret` to Kubernetes. You need to have `kubectl` downloaded and usable on your system for that.

Be sure to replace the following placeholders in the upcoming command:

* `YOUR_GITLAB_USERNAME` - .
* `YOUR_PERSONAL_GITLAB_ACCESS_TOKEN_HERE` - .

After replacing the placeholders in the command, run it to create the Docker login `Secret` in Kubernetes:

```console
kubectl create \
    -n presentation-gitlab-k8s \
    secret docker-registry registry-gitlab-key \
    --docker-server=registry.example.com \
    --docker-username=YOUR_GITLAB_USERNAME \
    --docker-password=YOUR_PERSONAL_GITLAB_ACCESS_TOKEN_HERE
```

Keep the name of the `Secret` in mind that has been created by the `kubectl create` command above, it is needed in the next command.

This "patches" the `default` `ServiceAccount` to automatically use the Docker login `Secret` for pulling images from the registry.

```console
kubectl patch \
    -n presentation-gitlab-k8s \
    serviceaccount default \
    -p '{"imagePullSecrets": [{"name": "registry-gitlab-key"}]}'
```
(For more information, see [Kubernetes - Configure Service Accounts for Pods - Add ImagePullSecrets to a service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account))

Next thing is to create the Kubernetes manifests to deploy the built Docker image(s) to the cluster.

## Step 7 - Create Kubernetes manifests

Now you are creating the Kubernetes manifests for your application and add them to your repository.

Create the `Deployment` manifest (`deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: presentation-gitlab-k8s-__CI_ENVIRONMENT_SLUG__
  labels:
    app: presentation-gitlab-k8s
    ref: __CI_ENVIRONMENT_SLUG__
    track: stable
spec:
  replicas: 2
  selector:
    matchLabels:
      app: presentation-gitlab-k8s
      ref: __CI_ENVIRONMENT_SLUG__
  template:
    metadata:
      labels:
        app: presentation-gitlab-k8s
        ref: __CI_ENVIRONMENT_SLUG__
        track: stable
    spec:
      containers:
      - name: app
        image: __CI_REGISTRY_IMAGE__:__VERSION__
        imagePullPolicy: Always
        ports:
        - name: http-metrics
          protocol: TCP
          containerPort: 8000
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 3
          timeoutSeconds: 2
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 3
          timeoutSeconds: 2
```

This is a basic Kubernetes `Deployment` manifest. For more information on `Deployment` manifests please check the Kubernetes Docs page here: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/

Placeholders like `__CI_ENVIRONMENT_SLUG__` and `__VERSION__` are used for templating this single manifest for the multiple environments we want to achieve.
For example later the `__CI_ENVIRONMENT_SLUG__` get's replaced by `dev` or `live` (environment name) and `__VERSION__` with the built image tag.

To be able to connect to the generated `Pod`s of the `Deployment`, a `Service` is also required.
A `Service` manifest looks like this, includes the placeholders already (`service.yaml`):
```yaml
apiVersion: v1
kind: Service
metadata:
  name: presentation-gitlab-k8s-__CI_BUILD_REF_SLUG__
  namespace: presentation-gitlab-k8s
  labels:
    app: __CI_BUILD_REF_SLUG__
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8000"
    prometheus.io/scheme: "http"
    prometheus.io/path: "/metrics"
spec:
  type: ClusterIP
  ports:
    - name: http-metrics
      port: 8000
      protocol: TCP
  selector:
    app: __CI_BUILD_REF_SLUG__
```
The application runs on port `8000`. The port is named `http-metrics` as in my case of Kubernetes cluster I use the [prometheus-operator](https://github.com/coreos/prometheus-operator) which creates the "auto-discovery" config for Prometheus for example to monitor all `Service`s with a port named `http-metrics`.
The Kubernetes `Service` documentation can be found here: https://kubernetes.io/docs/concepts/services-networking/service/

But now we would be only able to connect to the cluster from the inside and not the outside. That's what `Ingress`es are for. As the name implies they provide a way of allowing traffic to kind of flow into the cluster to a certain `Service`.
The following manifest contains so called "annotations" that would automatically get a Let'sencrypt certificate for it and deploy it into the "loadbalancer". The file is named (`ingress.yaml`).

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: presentation-gitlab-k8s-__CI_BUILD_REF_SLUG__
  namespace: presentation-gitlab-k8s
  labels:
    app: __CI_BUILD_REF_SLUG__
  annotations:
    kubernetes.io/tls-acme: "true"
    kubernetes.io/ingress.class: "nginx"
spec:
  tls:
  - hosts:
    - __CI_BUILD_REF_SLUG__-presentation-gitlab-k8s.edenmal.net
    # the secret used here is an unsigned wildcard cert for demo purposes
    # use your own or comment this out
    secretName: tls-wildcard-demo
  rules:
  - host: __CI_BUILD_REF_SLUG__-presentation-gitlab-k8s.edenmal.net
    http:
      paths:
      - path: /
        backend:
          serviceName: presentation-gitlab-k8s-__CI_BUILD_REF_SLUG__
          servicePort: 8000
```

`Ingress` documentation can be found here: https://kubernetes.io/docs/concepts/services-networking/ingress/.
To be able to reach the domain names, you need to already have the DNS names created. With the current manifest you would need to create `__CI_ENVIRONMENT_SLUG__-presentation-gitlab-k8s.example.com`, where `__CI_ENVIRONMENT_SLUG__` `live` and `dev`. Resulting in `dev-presentation-gitlab-k8s.example.com` and `live-presentation-gitlab-k8s.example.com` to be created by yourself.

> **NOTE**
>
> The deployment stage could be expanded to use a DNS providers API or even the [kubernetes-incubator/external-dns Operator](https://github.com/kubernetes-incubator/external-dns), to create a new subdomain for each merge request. This would mean that each merge request would be reviewable under its own

Now that we have gone through all the manifests in the repository, we can move on to the next step.

## Step 8 - Make a change, push and watch the magic happen!
Now that you have the manifests and the `.gitlab-ci.yml` file in the repository or from the imported one, you can make a change to the code or just create a file by running the following commands:

```console
$ touch test1
$ git add test1
$ git commit -m"Testing the GitLab CI functionality #1"
$ git push
```

The commands create a new file, commit it and push the change to the repository on GitLab.

Now you should see GitLab creating a new pipeline for your change and start running through the stages, which you specified in the `.gitlab-ci.yml`, with their jobs.

{{< figure src="gitlab-ci-pipelines-list.png" width="800px" title="GitLab CI - Pipelines list" >}}

{{< figure src="gitlab-ci-commit-pipeline-running.png" width="800px" title="GitLab CI - Commit Pipeline list view" >}}

When you now go to the pipeline, you should see a view like this:

{{< figure src="gitlab-ci-pipeline-view.png" width="800px" title="GitLab CI - Running Pipeline Overview" >}}

The last stage shows if you did everything correct. If it passes you now have successfully deployed your application to your Kubernetes cluster.
A successful stage `review` deploy looks like this:

{{< figure src="gitlab-ci-pipeline-deploy-review-successful.png" width="1200px" title="GitLab CI - Pipeline deploy_review job successful" >}}

If any of the build/steps fail for you, you may have misconfigured your `.gitlab-ci.yml` or the GitLab CI Kubernetes integration can't reach the configured Kubernetes cluster. Make sure connectivity from the GitLab CI Runners to the Kubernetes cluster is given!
For Troubleshooting see the below section for more details on some possible issues.

## Troubleshooting
### Pipeline stuck on pending

If the build pipeline is stuck in pending, it could be that your GitLab CI runner aren't properly configured with your GitLab CI instance.

### Build failure

* If you made any changes to the `.gitlab-ci.yml`, use the "CI Lint" functionality available on the GitLab Repo pipeline page in the top right corner to check for any syntax issues.
* Did you replace all domain names `{gitlab,s3,registry}.example.com` with your own domains?

### Unable to reach the app review URL/deployed project

* Did you replace all domain names `{gitlab,s3,registry}.example.com` with your own domains?
    *
* Is your Ingress controller configured to pickup your Ingress objects?
    * Your DNS names correctly setup to point to the Ingress controller?

## Summary
I hope this helps you, using the GitLab CI Kubernetes cluster feature for your Continuous Delivery of your application(s) to Kubernetes.
For questions about the post, please leave a comment below, thanks!

Have Fun!
