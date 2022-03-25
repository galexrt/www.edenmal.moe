---
title: 'Zulip: Installation'
date: "2016-09-14T09:23:42+02:00"
description: "A tutorial that guides you through installing Zulip."
tags:
  - Zulip
  - Installation
cover: /post/2016/Zulip-Installation/zulip-icon-512x512.png
---

> **Please note**: This post is more of a "draft" that may not be on my level of post quality.

Zulip is a powerful open source group chat able to handle multi channel communications. It runs on python.

## Requirements

An Ubuntu Server with at least `2GB` of RAM (`2GB` RAM is currently the recommended amount for a small site).
My example server for this tutorial has the following address:

* `203.0.113.1 zulip-tutorial-example`

## Preparing your server for Zulip

> **NOTE**
>
> The current Zulip installation deployment uses one full server! The deployment doesn't care about other services on the server.

Make sure your server is at the latest version before continuing with the
To update all packages on Ubuntu run:
```console
apt-get update
apt-get upgrade
```
Confirm with (depending on the system locale) with `y`.`

## Step 1 - Downloading Zulip

Please login as root user.
On most Ubuntu systems, you would use

```console
sudo -i
```

to switch to the root user.
Next up we make sure that we are in the root user's home directory `/root`.

```console
cd /root
pwd
```

`pwd` prints the current working directoy.

For the latest Zulip version the download and extraction commands are:

```console
cd /root
wget https://www.zulip.com/dist/releases/zulip-server-latest.tar.gz
rm -rf /root/zulip && mkdir /root/zulip
tar -xf zulip-server-latest.tar.gz --directory=/root/zulip --strip-components=1
```

> **NOTE**
>
> You need to have `tar` and `wget` installed on the server. On most servers these tools are already installed.

Now that we have Zulip downloaded, we can continue to the next step.

## Step 2 - Install Zulip

With the following command, we start the Zulip installation.

> **!! WARNING !!** This will install Zulip to your server and if other applications are also running on this server it can completely mess them up, as mentioned earlier!

```console
/root/zulip/scripts/setup/install
```

The command may take some to complete. The command installs Zulip's dependencies and Zulip itself on the server.

## Step 3 - Checking the Zulip installation

Navigate to the bottom of the file and check that it reports the success of the installation.
The command for opening the installation log file in a "paginator" is:

```console
less /var/log/zulip/install.log
```

## Step 4 - Configuring the Zulip instance

For Zulip to function you need to set some mandatory settings.
Zulip's config file is located at `/etc/zulip/settings.py`.

The following list contains the mandatory settings.

* `EXTERNAL_HOST` should be your external address.
* `ZULIP_ADMINISTRATOR` the email of the administrator that will be also shown as the contact email address.
* `AUTHENTICATION_BACKENDS`
* `EMAIL_*` the email server settings, please look at the comments in the file for more information about the variables.
* `DEFAULT_FROM_EMAIL` the default sender email address used for the outgoing email traffic.
* `NOREPLY_EMAIL_ADDRESS` the address for noreply in the outgoing email traffic.
* `ALLOWED_HOSTS` the fully qualified DNS name of the server you installed Zulip on or just set it to `*`.

The config file contains a comment above all the variables.
Go ahead and configure the mandatory values to your needs.

## Step 5 - Preparing the Zulip instance for usage

Now that you have Zulip configured, we can now initialize the database.

```console
su zulip -c /home/zulip/deployments/current/scripts/setup/initialize-database
```

After the database initialization has successfully completed, we should now you should verify that your Zulip email settings are correct:

```console
./manage.py send_test_email YOUR_EMAIL_ADDRESS
```

> **NOTE**
>
> Replace the placeholders with your own values.

The command above will send a test email to the specified email address, please make sure the email successfully arrives.
If it's not in the inbox make sure to also check your SPAM folder.

We need a Zulip organistation for your users.
For that we need to switch to the `zulip` user, switch into the current Zulip installation and create a link for realm generation with the command:

```console
su zulip
cd /home/zulip/deployments/current
./manage.py generate_realm_creation_link
```

Go to the link the last command outputs and you will be prompted with a form for an account and realm creation.
A realm is like an organization.

## Step 6 - Using your Zulip instance

Now just navigate to your Zulip instance and if you need to login go ahead.

You now have a working Zulip instance!

If you want to read more about configuration and the integration possibilities you can go to the official documentation of Zulip.
See [Zulip Official Documentation](https://zulip.readthedocs.io/en/latest/index.html).

***

## Tips and Tricks

### Restarting Zulip

Use the below command to restart your Zulip instance, after making changes to the config:

```console
su zulip -c /home/zulip/deployments/current/scripts/restart-server
```

***

## Troubleshooting

A good guide for troubleshooting can be found on the official documentation of Zulip [here](https://zulip.readthedocs.io/en/latest/prod-troubleshooting.html).
