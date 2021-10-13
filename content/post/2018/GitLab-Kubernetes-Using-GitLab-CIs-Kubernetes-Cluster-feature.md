---
title: "GitLab + Kubernetes: Using GitLab CI's Kubernetes Cluster feature"
description: 'This post shows possibilites on how to use GitLab in combination with Kubernetes to contionously deliver your applications with Container, using the new GitLab CI Kubernetes Cluster feature.'
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2018-06-17T12:35:42+02:00"
tags:
  - Continuous Delivery
  - GitLab
  - Kubernetes
  - Container
categories:
  - GitLab
cover: /post/2018/GitLab-Kubernetes-Using-GitLab-CIs-Kubernetes-Cluster-feature/GitLab-Kubernetes-Using-GitLab-CIs-Kubernetes-Cluster-feature.png
---

## UPDATED

An updated version of this post can be found here: [GitLab + Kubernetes: Using GitLab CI's Kubernetes Cluster feature - UPDATED]({{< ref "/post/2019/GitLab-Kubernetes-Using-GitLab-CIs-Kubernetes-Cluster-feature.md" >}}).

Please use it instead of this post which is already a bit dated again and not all uptodate with the latest changes to the example repository. Thanks!

***

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
> In this post the Kubernetes namespace `presentation-gitlab-k8s` will be used for "everything".

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

## Step 2 - Get ServiceAccount Token from Kubernetes

> **NOTE**
>
> This step is definetely a bit different for newer clusters as you need to get a `ServiceAccount` token from an account with enough permissions to create, modify and delete the following objects in Kubernetes: Create, modify and delete `Deployment`, `Service`, `Ingress`.
>
> For more information and a prescription, talk to your cluster administrator about a `ServiceAccount` that matches these requirements.

For Kubernetes `1.6` and higher with role-based access control (RBAC) enabled you need to have a `ServiceAccount` with the correct permissions, to deploy in the namespace of your choice.

For Kubernetes `1.5` and below, you just need to a) create a `ServiceAccount` (see note below) or b) use the default existing one in the namespace of your choice.

> **NOTE**
>
> It is recommended to **create a new `ServiceAccount` for each application**!
>
> For information on how create a `ServiceAccount`, please refer to the Kubernetes documentation here:
>
> * Kubernetes `1.5` and below: https://kubernetes.io/docs/admin/service-accounts-admin/
> * Kubernetes `1.6` and higher (with RBAC enabled): https://kubernetes.io/docs/admin/authorization/rbac/

In my case even if it not the best way, I'll go with the default `ServiceAccount` created in the namespace where I will run the application.
For that I check what secrets exist, then get the secret and base64 decode it.

```console
$ kubectl get -n presentation-gitlab-k8s secret
NAME                                           TYPE                                  DATA      AGE
default-token-nmx1q                            kubernetes.io/service-account-token   3         20m
$ kubectl get -n presentation-gitlab-k8s secret default-token-nmx1q -o yaml
apiVersion: v1
data:
  ca.crt: [REDACATED]
  namespace: [REDACATED]
  token: [THIS IS YOUR TOKEN BASE64 ENCODED]
kind: Secret
metadata:
  annotations:
    kubernetes.io/service-account.name: default
  [...]
  name: default-token-nmx1q
  namespace: presentation-gitlab-k8s
  [...]
type: kubernetes.io/service-account-token
$ echo YOUR_TOKEN_HERE | base64 -d
YOUR_DECODED_TOKEN
```

In the end copy `YOUR_DECODED_TOKEN` somewhere safe.

## Step 3 - Get the Kubernetes CA Certificate

At least for my cluster that I setup with the `kubernetes/contrib` Ansible deployment the Kubernetes CA certificate is located in `/etc/kubernetes/certs/ca.crt`.
So a simple `cat` does the thing ;)

```console
$ cat /etc/kubernetes/ca.crt
-----BEGIN CERTIFICATE-----
[REDACATED]
-----END CERTIFICATE-----
```

If you have gotten a `kubectl` config from your provider or administrator, you can find the CA certificate location in there at the `certificate-authority` key.
In most cases the so called `kubeconfig` will be located at `~/.kube/config`.

```yaml
[...]
apiVersion: v1
clusters:
- cluster:
    # This is where CA certificate will be located at
    certificate-authority: path/to/my/cafile
    server: https://horse.org:4443
  name: horse-cluster
[...]
```

If your `kubeconfig` does not contain a `certificate-authority:`, but a `certificate-authority-data:` take the contents of it and run `base64 -d` on it. That will base64 decode the CA certificate for you.

For more information on `kubeconfig`, see the Kubernetes documentation for "access" to Kubernetes cluster here: https://kubernetes.io/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/.

For other cluster "types"/deployments, please refer to your cluster administrator or guide.

Save the CA certificate somewhere safe with the token from [Step 2 - Get ServiceAccount Token from Kubernetes](#Step2-Get-ServiceAccount-Token-from-Kubernetes).

## Step 4 - Create a Kubernetes cluster in GitLab CI

You will now need the `ServiceAccount` token, the CA certificate, Kubernetes API server address and the namespace you want to run the application in.

In your GitLab's sidebar, go to `CI / CD` -> `Kubernetes` and you should get to this page:

{{< figure src="gitlab-ci-kubernetes-cluster-empty-cluster-list.png" width="800px" title="GitLab CI Kubernetes cluster - Cluster list page" >}}

Now click the `Add Kubernetes cluster` button and you get this page:

{{< figure src="gitlab-ci-kubernetes-cluster-add-cluster.png" width="800px" title="GitLab CI Kubernetes cluster - Create GKE cluster or add existing cluster page" >}}

On this page you can decide, if you want to create a new Google GKE cluster or add an existing cluster.
Click `Add an existing Kubernetes cluster` button, so we can the Kubernetes cluster we just gathered the information for.

{{< figure src="gitlab-ci-kubernetes-cluster-add-existing-cluster.png" width="800px" title="GitLab CI Kubernetes cluster - Add existing cluster form" >}}

The `Kubernetes cluster name` can be "anything", pick something you are able to identify the cluster later on again in case of issues. The other fields should be filled with the information we gathered it in the previous steps.

The `Project namespace` is optional though the `.gitlab-ci.yml` shown above/used here "must" have a Kubernetes namespace provided, so set it to `presentation-gitlab-k8s` (or your own value, but you need to change all manifests in the repository to match this one then).

Click `Add Kubernetes cluster` to add the cluster to GitLab and you now have the Kubernetes integration activated and ready.

## Step 5 - Add a `.gitlab-ci.yml` to your project

> **NOTE**
>
> Replace `registry.example.com` is the address to your GitLab container registry.
> `s3.example.com` is just a [minio](https://minio.io/) instance where I upload the artifact to an "external" destination for demonstration. To remove this step just delete the `release_upload` structure.
> Replace `{gitlab,s3,registry}.example.com` with your corresponding domain name!
>
> **WARNING** You should first commit when you are done with adding the manifests from the **sixth step** too!

The `.gitlab-ci.yml` is based on the official GitLab CI Go template.

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
# For jobs without a image specified use the below
image: golang:1.10.3-stretch
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

The whole `.gitlab-ci.yml` file looks like this:

```yaml
image: golang:1.10.3-stretch

# The problem is that to be able to use go get, one needs to put
# the repository in the $GOPATH. So for example if your gitlab domain
# is mydomainperso.com, and that your repository is repos/projectname, and
# the default GOPATH being /go, then you'd need to have your
# repository in /go/src/mydomainperso.com/repos/projectname
# Thus, making a symbolic link corrects this.
before_script:
  - mkdir -p "/go/src/gitlab.zerbytes.net/${CI_PROJECT_NAMESPACE}"
  - ln -sf "${CI_PROJECT_DIR}" "/go/src/gitlab.zerbytes.net/${CI_PROJECT_PATH}"
  - cd "/go/src/gitlab.zerbytes.net/${CI_PROJECT_PATH}/"

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
#  image: minio/mc
#  script:
#    - echo "=> We already have artifact sotrage in GitLab! This is for demonstational purposes only."
#    - mc config host add edenmalnet https://s3.edenmal.net ${S3_ACCESS_KEY} ${S3_SECRET_KEY} S3v4
#    - mc mb -p edenmalnet/build-release-${CI_PROJECT_NAME}/
#    - mc cp app edenmalnet/build-release-${CI_PROJECT_NAME}/


image_build:
  stage: release
  image: docker:latest
  variables:
    DOCKER_HOST: tcp://localhost:2375
  services:
    - docker:dind
  script:
    - docker info
    - docker login -u gitlab-ci-token -p ${CI_JOB_TOKEN} registry.zerbytes.net
    - docker build -t registry.zerbytes.net/${CI_PROJECT_PATH}:latest .
    - docker tag registry.zerbytes.net/${CI_PROJECT_PATH}:latest registry.zerbytes.net/${CI_PROJECT_PATH}:${CI_COMMIT_REF_NAME}
    - test ! -z "${CI_COMMIT_TAG}" && docker push registry.zerbytes.net/${CI_PROJECT_PATH}:latest
    - docker push registry.zerbytes.net/${CI_PROJECT_PATH}:${CI_COMMIT_REF_NAME}

deploy_review:
  image: lachlanevenson/k8s-kubectl:latest
  stage: review
  only:
    - branches
  except:
    - tags
  environment:
    name: review/$CI_BUILD_REF_NAME
    url: https://$CI_BUILD_REF_SLUG-presentation-gitlab-k8s.edenmal.net
    on_stop: stop_review
    kubernetes:
      namespace: presentation-gitlab-k8s
  script:
    - kubectl version
    - cd manifests/
    - sed -i "s/__CI_BUILD_REF_SLUG__/${CI_BUILD_REF_SLUG}/" deployment.yaml ingress.yaml service.yaml
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
    - kubectl get all,ing -l app=${CI_BUILD_REF_SLUG}

stop_review:
  image: lachlanevenson/k8s-kubectl:latest
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
    - kubectl delete ing -l app=${CI_BUILD_REF_SLUG}
    - kubectl delete all -l app=${CI_BUILD_REF_SLUG}

deploy_live:
  image: lachlanevenson/k8s-kubectl:latest
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
    - sed -i "s/__CI_BUILD_REF_SLUG__/${CI_ENVIRONMENT_SLUG}/" deployment.yaml ingress.yaml service.yaml
    - sed -i "s/__VERSION__/${CI_COMMIT_REF_NAME}/" deployment.yaml ingress.yaml service.yaml
    - kubectl apply -f deployment.yaml
    - kubectl apply -f service.yaml
    - kubectl apply -f ingress.yaml
    - kubectl rollout status -f deployment.yaml
    - kubectl get all,ing -l app=${CI_ENVIRONMENT_SLUG}
```

There are special control keys like `when` and `only` that allow for limiting the runs of the CI, to for example with `only: ["tags"]` to run for created tags only and so on.
More on this topic can be found at the GitLab CI YAML file documentation here: https://docs.gitlab.com/ce/ci/yaml/README.html

I hope you can what it does by looking at the `script` parts of the jobs and the stages that will be run.

## Step 6 - Add Docker login information to Kubernetes

To be able to deploy the built image from the GitLab registry later on, you need to add the Docker login information for the GitLab Registry as a `Secret` to Kubernetes. You need to have `kubectl` downloaded and usable on your system for that.
The command for creating the Docker login secret is:

```console
# YOUR_SECRET_NAME for example "registry-example-gitlab-key"
$ kubectl create \
    -n presentation-gitlab-k8s \
    secret docker-registry YOUR_PULLSECRET_NAME_HERE \
    --docker-server=registry.example.com \
    --docker-username=YOUR_GITLAB_USERNAME \
    --docker-password=YOUR_PERSONAL_GITLAB_ACCESS_TOKEN_HERE \
    --docker-email=YOUR_GITLAB_EMAIL_ADDRESS
```

Write down the name you gave the secret (`YOUR_PULLSECRET_NAME_HERE`). You will need to put it into the `Deployment` manifest that is coming up next.

## Step 7 - Create Kubernetes manifests

Now you are creating the Kubernetes manifests for your application and add them to your repository.

Create the `Deployment` manifest (`deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: __CI_BUILD_REF_SLUG__
  labels:
    app: __CI_BUILD_REF_SLUG__
    track: stable
spec:
  replicas: 2
  selector:
    matchLabels:
      app: __CI_BUILD_REF_SLUG__
  template:
    metadata:
      labels:
        app: __CI_BUILD_REF_SLUG__
        track: stable
    spec:
      imagePullSecrets:
        - name: regsecret
      containers:
      - name: app
        image: registry.zerbytes.net/atrost/presentation-gitlab-k8s:__VERSION__
        imagePullPolicy: Always
        ports:
        - containerPort: 8000
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

> **NOTE**
>
> Don't forget to replace `YOUR_SECRET_NAME_HERE` with the actual name of your Docker login secret created in the previous step.

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

> **NOTE** The deployment stage could be expanded to use the DNS providers API to create the domain name for you or the [external-dns operator](https://github.com/kubernetes-incubator/external-dns) from the [Kubernetes incubator](https://github.com/kubernetes-incubator) project could be used.

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
* Did you replace all domain names `{gitlab,s3,registry}.zerbytes.net` with your own domains?

### Unable to reach the app review URL/deployed project

* Did you replace all domain names `{gitlab,s3,registry}.zerbytes.net` with your own domains?
* Is your Ingress (class) correctly setup in the `Ingress` object/Kubernetes cluster?

## Summary

I hope this helps you, using the GitLab CI Kubernetes cluster feature for your Continuous Delivery of your application(s) to Kubernetes.
For questions about the post, please leave a comment below, thanks!

Have Fun!
