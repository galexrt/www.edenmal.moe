---
title: Ansible User Management Role
tags:
  - User Management
  - Ansible
categories:
  - GitHub Projects
author: Alexander Trost
toc: false
description: A simple to use Ansible user management role made by me.
date: "2016-05-25T14:36:25+02:00"
---

GitHub repository: [galexrt/ansible-usersmgt](https://github.com/galexrt/ansible-usersmgt).
Ansible Galaxy: [here](https://galaxy.ansible.com/galexrt/ansible-usersmgt/)

***

This is an Ansible role for user management that I have created.
Currently has the following features:

* SSH key management (currently fixed ssh key directory `/etc/ssh/authorized_keys`, is on the roadmap).
* Creation and removal of:
    * Groups
    * Users
* Additional fine tunning through `only_on_hosts` and `not_on_hosts` lists possible.

## Examples

This is the [EXAMPLES.md](https://github.com/galexrt/ansible-usersmgt/blob/master/EXAMPLES.md) from the repository.
<script src="https://gist-it.appspot.com/https://github.com/galexrt/ansible-usersmgt/blob/master/EXAMPLES.md"></script>

***

If you have any feedback or ideas for improvements, feel free to leave it in the comments or create an issue or pull request on GitHub. :)

Have Fun!
