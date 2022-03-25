---
title: "Kubernetes Elasticsearch Operator"
toc: true
sitemap: true
comments: true
author: Alexander Trost
date: "2017-05-30T10:51:42+02:00"
tags:
  - Kubernetes
  - Operator
  - Golang
  - Open Source
cover: https://avatars1.githubusercontent.com/u/13629408?s=400&v=4
description: 'Installation and examples for using my elasticsearch operator (GitHub galexrt/elasticsearch-operator).'
---

I got the inspiration for writing a so called operator for Kubernetes from the [CoreOS](https://coreos.com/) project [prometheus-operator](https://github.com/coreos/prometheus-operator).
So a big thanks to them for creating the project, as also the code is almost completely based on their operator code.

The project can be found on GitHub: [https://github.com/galexrt/elasticsearch-operator](https://github.com/galexrt/elasticsearch-operator).

### Installation

Use the `bundle.yaml` that is in the repo root, to run the operator on the cluster.

```console
kubectl create -f bundle.yaml
```

### Verify the installation of the ThirdPartyResources

To verify that the operator has successful installed its `ThirdPartyResources`, you simply check the Kubernetes server for them:

```console
$ kubectl get thirdpartyresources
NAME                                       DESCRIPTION                           VERSION(S)
[...]
curator.elasticsearch.zerbytes.net         Managed Curator instance(s)           v1alpha1
elasticsearch.elasticsearch.zerbytes.net   Managed Elasticsearch instance(s)     v1alpha1
[...]
```

If those two entries are shown, the operator should now be working.

## Examples

### Use the examples

You use the `kubectl create` command for that. If you need help, check the help menu.

### Elasticsearch manifest

The manifest below would create a simple Elasticsearch cluster, consisting of 1x master, 1x data and 1x ingest node.

```yaml
apiVersion: "elasticsearch.zerbytes.net/v1alpha1"
kind: "Elasticsearch"
metadata:
  name: "example"
spec:
  version: "5.4.0"
  # automatically calculate java memory opts
  # not implemented yet
  javaMemoryControl: true
  # this is currently not implemented due to it being missing
  # from the used k8s go-client
  #imagePullSecrets: "example"
  # config that is added to *all* autogenrated config file
  additionalConfig: |
    action.auto_create_index: .security,.monitoring*,.watches,.triggered_watches,.watcher-history*,filebeat-*,metricbeat-*,packetbeat-*,winlogbeat-*,heartbeat-*
  master:
    replicas: 1
    #nodeSelector:
    #  elasticsearch-data: "yes"
    resources:
      limits:
        memory: "512Mi"
      requests:
        memory: "512Mi"
    # add to the jvm.options file
    javaOpts: |
      # your additional java opts here
    additionalConfig: |
      # your addtional elasticsearch configuration here
    storage:
      class: rbd
      resources:
        requests:
          storage: 10Gi
  data:
    replicas: 1
    #nodeSelector:
    #  elasticsearch-data: "yes"
    resources:
      limits:
        memory: "512Mi"
      requests:
        memory: "512Mi"
    javaOpts: |
      # your additional java opts here
    additionalConfig: |
      # your addtional elasticsearch configuration here
    storage:
      class: rbd
      resources:
        requests:
          storage: 15Gi
  ingest:
    replicas: 1
    #nodeSelector:
    #  elasticsearch-data: "yes"
    resources:
      limits:
        memory: "512Mi"
      requests:
        memory: "512Mi"
    javaOpts: |
      # your additional java opts here
    additionalConfig: |
      # your addtional elasticsearch ingest configuration here
```

### Curator manifest

Curator manifests are very primitive. You have to provide a full configuration for it.
I may improve them in the future.

```yaml
apiVersion: "elasticsearch.zerbytes.net/v1alpha1"
kind: Curator
metadata:
  name: "example"
spec:
  schedule: "1 0 * * *"
  config: |
  # Remember, leave a key empty if there is no value.  None will be a string,
  # not a Python "NoneType"
  client:
    hosts:
      - elasticsearch-example
    port: 9200
    url_prefix:
    use_ssl: False
    certificate:
    client_cert:
    client_key:
    ssl_no_validate: False
    http_auth: "elastic:changeme"
    timeout: 30
    master_only: False
  logging:
    loglevel: INFO
    logfile:
    logformat: default
    blacklist: ['elasticsearch', 'urllib3']
  actions: |
    # Remember, leave a key empty if there is no value.  None will be a string,
    # not a Python "NoneType"
    #
    # Also remember that all examples have 'disable_action' set to True.  If you
    # want to use this action as a template, be sure to set this to False after
    # copying it.
    actions:
      1:
        action: delete_indices
        description: "Clean up ES by deleting old indices"
        options:
          timeout_override:
          continue_if_exception: False
          disable_action: False
          ignore_empty_list: True
          timeout_override: 300
        filters:
        - filtertype: age
          source: name
          direction: older
          timestring: '%Y.%m.%d'
          unit: days
          unit_count: 4
          field:
          stats_result:
          epoch:
          exclude: False
```

***

If you have any questions about the operator or the usage, feel free to open an issue on GitHub or leave a comment.

Have Fun!
