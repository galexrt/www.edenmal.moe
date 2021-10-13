---
title: "Matrix Synapse SAML2 Login"
tags:
  - SSO
  - SAML2
  - Matrix Synapse
categories:
  - Matrix
author: Alexander Trost
description: "Tutorial on how to use Keycloak with Matrix Synapse Homeserver for authentication of users."
date: 2019-06-28T11:51:19+02:00
toc: true
sitemap: true
comments: true
cover: /post/2019/Matrix-Synapse-SAML2-Login/Matrix-Synapse-SAML2-Login.png
---

> **NOTE**
>
> This is a very rough write-up on how to use Keycloak SAML2 with a Matrix Synapse Homeserver for user authentication. Keep in mind that not all points outlined here may 100% work for you and "turning and changing" some parameters may be needed to get it working for your setup.

## Intro

This blog post is especially made for Keycloak SAML 2.0 SSO with Matrix with the [GitHub matrix-org/synapse - Complete the SAML2 implementation #5422](https://github.com/matrix-org/synapse/pull/5422), which is based on my draft PR [GitHub matrix-org/synapse - SAML2 Improvements and redirect stuff #5316](https://github.com/matrix-org/synapse/pull/5316).

> **THANKS**
>
> Thanks to Helder Ferreira ([@wounn Twitter](https://twitter.com/wounn), [HelderFSFerreira GitHub](https://github.com/HelderFSFerreira)) for reaching out to me and updating the configs in this post!

## Matrix Syanspe

To get SAML 2.0 working you need to have a Matrix Synapse Homeserver running version at least [version `1.1,0`](https://matrix.org/blog/2019/07/04/synapse-1-1-0-released).

In addition to that you need to have the `pysaml2` Python module installed and `xmlsec1` must be installed on the Matrix Synapse homeserver too.

On Debian and CentOS (possibly all RHEL based OSes) the package is called `xmlsec1`.

Be sure to verify that the path to `xmlsec1` is correctly configured in the upcoming `/synapse/config/sp_conf.py` section. To make sure you have the right path for the `pysaml2` config, run `which xmlsec1` and use the printed out path for the `xmlsec_binary` option.

> **NOTE**
>
> The blog post assumes that the config for the Matrix Synapse Homeserver is located in `/synapse/config/` directory, you can simply change this as long as you change it in all files and / or steps to do.

## Keycloak

### SAML2 Client

In Keycloak create a new SAML client and set the settings of that client as follows:

{{< figure src="keycloak-client-settings-tab.png" width="100%" title="Keycloak Client Settings" >}}

Two mappers should be created:

* `uid` for the username.
{{< figure src="keycloak-client-mapper-uid.png" width="100%" title="Keycloak Client Mapper uid Options" >}}
    * `Mapper Type` - `User Property`
    * `Property` - `Username`
    * `Friendly Name` - `uid`
    * `SAML Attribute Name` - `uid`
    * `SAML Attribute NameFormat` - `URI Reference`
* `displayName` for the displayed name in Keycloak.
{{< figure src="keycloak-client-mapper-displayname.png" width="100%" title="Keycloak Client Mapper displayName Options" >}}
    * `Mapper Type` - `Javascript Mapper`
    * `Script`
      ```javascript
      // Concat First and Last name of user when non-empty
      names = [];
      
      firstName = user.getFirstName();
      if (firstName.length > 0) {
          names.push(firstName);
      }
      lastName = user.getLastName();
      if (lastName.length > 0) {
          names.push(lastName);
      }
      
      exports = names.join(" ");
      ```
    * `Single Value Attribute` - `On`
    * `Friendly Name` - `displayName`
    * `SAML Attribute Name` - `displayName`
    * `SAML Attribute NameFormat` - `Basic`

In the end it should look like this:

{{< figure src="keycloak-client-mappers-list.png" width="100%" title="Keycloak Client Mappers List" >}}

> **INFO**
>
> Thanks to [this comment](http://disq.us/p/239xrfr) for pointing to the correct attributes to use for Matrix Synapse code to pick'em up!

### SAML 2.0 Identity Provider Metadata file

Now download the Keycloak "SAML 2.0 Identity Provider Metadata" file.
You can get it when you login to the "Keycloak Admin Console" and then click the "SAML 2.0 Identity Provider Metadata" link in the `General` tab (selected by default) at the `Endpoints` list.

{{< figure src="keycloak-realm-settings.png" width="100%" title="Keycloak Realm Settings" >}}

> **NOTE**
>
> Should you not have this button / link in the `Endpoints` list, update your Keycloak instance to version `6.0.1` or higher!
>
> If you have a very good reason to not keep your Keycloak uptodate, you can try to get the file from `https://YOUR_KEYCLOAK_URL/auth/realms/YOUR_REALM/protocol/saml/descriptor`.
> (Replace the placeholders according to your setup)

## Files

### Replacements

Be sure to replace the following strings with your value:

* `matrix.example.com` - Your Matrix homeserver address.
* `matrix-example-com` - The name of the SAML2 Keycloak client you chose during the client creation.

### `/synapse/config/key.pem` and `/synapse/config/cert.pem`

Certificate and key from Keycloak Client "SAML Keys" tab page.
If there is no certificate and key shown, press the `Generate new keys` button to generate them.

Click the `Export` button, set the following options before clicking the `Download` button:

* Archive Format: `PKCS12`
* Key Alias: The name of your Keycloak Client.
* Key Password: A password which is used later to "decrypt" the PKCS12 cert + key store.
* Realm Certificate Alias: `master`
* Store password: Either another password or the same as for `Key Password`.

You should get a file named `keystore.p12` after pressing the `Download` button.

Now run the following sequence of commands to extract the key and cert in PEM format (this assumes the file is named `keystore.p12` and the password chosen is `example123`):

```console
$ export KEYSTORE_PW="example123"
$ openssl pkcs12 -in keystore.p12 -password "pass:${KEYSTORE_PW}" -nocerts -nodes | openssl rsa -out key.pem
writing RSA key
$ openssl pkcs12 -in keystore.p12 -password "pass:${KEYSTORE_PW}" -nodes | openssl x509 -out cert.pem
```

Two files, `key.pem` and `cert.pem`, are now generated in your current directory and now just need to be placed in the `/synapse/config/` directory (full paths see section title) on the Matrix Synapse host(s).

### `/synapse/config/idp.xml`

> **NOTE**
>
> If you have already downloaded the "SAML 2.0 Identity Provider Metadata" file as mentioned in the [Keycloak - SAML 2.0 Identity Provider Metadata file section](#saml-2-0-identity-provider-metadata-file), you can just use and copy it to `/synapse/config/idp.xml` on the Matrix Synapse Homeserver.

You can get it when you login to the "Keycloak Admin Console" and then click the "SAML 2.0 Identity Provider Metadata" link in the `General` tab (selected by default) at the `Endpoints` list.

{{< figure src="keycloak-realm-settings.png" width="100%" title="Keycloak Realm Settings" >}}

> **NOTE**
>
> Should you not have this button / link in the `Endpoints` list, update your Keycloak instance to version `6.0.1` or higher!
>
> If you have a very good reason to not keep your Keycloak uptodate, you can try to get the file from `https://YOUR_KEYCLOAK_URL/auth/realms/YOUR_REALM/protocol/saml/descriptor`.
> (Replace the placeholders according to your setup)

Be sure to copy the downloaded file to `/synapse/config/idp.xml` on the Matrix Synapse Homeserver.

**Example Keycloak SAML 2.0 Identity Provider Metadata file**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--
  ~ Copyright 2016 Red Hat, Inc. and/or its affiliates
  ~ and other contributors as indicated by the @author tags.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<EntitiesDescriptor Name="urn:keycloak" xmlns="urn:oasis:names:tc:SAML:2.0:metadata"
					xmlns:dsig="http://www.w3.org/2000/09/xmldsig#">
	<EntityDescriptor entityID="https://__YOUR_KEYCLOAK_URL__/auth/realms/master">
		<IDPSSODescriptor WantAuthnRequestsSigned="true"
			protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
                        <KeyDescriptor use="signing">
                          <dsig:KeyInfo>
                            <dsig:KeyName>[REDACTED]</dsig:KeyName>
                            <dsig:X509Data>
                              <dsig:X509Certificate>[REDACTED]</dsig:X509Certificate>
                            </dsig:X509Data>
                          </dsig:KeyInfo>
                        </KeyDescriptor>

			<SingleLogoutService
					Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
					Location="https://__YOUR_KEYCLOAK_URL__/auth/realms/master/protocol/saml" />
			<SingleLogoutService
					Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
					Location="https://__YOUR_KEYCLOAK_URL__/auth/realms/master/protocol/saml" />
			<NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</NameIDFormat>
			<NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</NameIDFormat>
			<NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</NameIDFormat>
			<NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</NameIDFormat>
			<SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
				Location="https://__YOUR_KEYCLOAK_URL__/auth/realms/master/protocol/saml" />
			<SingleSignOnService
				Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
				Location="https://__YOUR_KEYCLOAK_URL__/auth/realms/master/protocol/saml" />
			<SingleSignOnService
				Binding="urn:oasis:names:tc:SAML:2.0:bindings:SOAP"
				Location="https://__YOUR_KEYCLOAK_URL__/auth/realms/master/protocol/saml" />
		</IDPSSODescriptor>
	</EntityDescriptor>
</EntitiesDescriptor>
```

### `/synapse/config/sp_conf.py`

This is the `pysaml2` config file. It configures `pysaml2` to talk with the Keycloak server and do SAML2 authentication.

Create this file with the following content:
(Don't forget to replace the placeholders, see [Replacements section](#replacements))

```python
import saml2
from saml2.saml import NAME_FORMAT_URI

BASE = "https://matrix.example.com/"

CONFIG = {
    "entityid": "matrix-example-com",
    "description": "Matrix Server",
    "service": {
        "sp": {
            "name": "matrix-login",
            "endpoints": {
                "single_sign_on_service": [
                    (BASE + "_matrix/saml2/authn_response", saml2.BINDING_HTTP_POST),
                ],
                "assertion_consumer_service": [
                    (BASE + "_matrix/saml2/authn_response", saml2.BINDING_HTTP_POST),
                ],
                #"single_logout_service": [
                #    (BASE + "_matrix/saml2/logout", saml2.BINDING_HTTP_POST),
                #],
            },
            "required_attributes": ["uid",],
            "optional_attributes": ["displayName"],
            "sign_assertion": True,
            "sign_response": True,
        }
    },
    "debug": 0,
    "key_file": "/synapse/config/key.pem",
    "cert_file": "/synapse/config/cert.pem",
    "encryption_keypairs": [
        {
            "key_file": "/synapse/config/key.pem",
            "cert_file": "/synapse/config/cert.pem",
        }
    ],
    "attribute_map_dir": "/synapse/saml2_attribute_maps/",
    "metadata": {
        "local": ["/synapse/config/idp.xml"]
    },
    # If you want to have organization and contact_person for the pysaml2 config
    #"organization": {
    #    "name": "Example AB",
    #    "display_name": [("Example AB", "se"), ("Example Co.", "en")],
    #    "url": "http://example.com/roland",
    #},
    #"contact_person": [{
    #    "given_name": "Example",
    #    "sur_name": "Example",
    #    "email_address": ["example@example.com"],
    #    "contact_type": "technical",
    #    },
    #],
    # Make sure to have xmlsec1 installed on your host(s)!
    "xmlsec_binary": "/usr/bin/xmlsec1",
    "name_form": NAME_FORMAT_URI,
}
```

### `/synapse/saml2_attribute_maps/map.py`

This file is your way to map attributes coming from the SSO (/ IDP) service.

```python
MAP = {
    "identifier": "urn:oasis:names:tc:SAML:2.0:attrname-format:uri",
    "fro": {
        'uid': 'uid',
        'displayName': 'displayName',
    },
    "to": {
        'uid': 'uid',
        'displayName': 'displayName',
    }
}
```

> **NOTE**
>
> **`fro` in the above file is not a typo**, see [`pysaml2` Documentation - "Configuration of pySAML2 entities" - `attribute_map_dir`](https://pysaml2.readthedocs.io/en/latest/howto/config.html#attribute-map-dir).

### Your Matrix Synapse Homeserver Config YAML file

Add or change the following lines to your Matrix Synapse Homeserver config (make sure you don't duplicate the lines as that may lead to weird server behavior and / or issues):

```yaml
[...]
## Registration ##
#
# Registration can be rate-limited using the parameters in the "Ratelimiting"
# section of this file.

# Enable registration for new users.
#
enable_registration: false


saml2_config:
  # `sp_config` is the configuration for the pysaml2 Service Provider.
  # See pysaml2 docs for format of config.
  #
  # Default values will be used for the 'entityid' and 'service' settings,
  # so it is not normally necessary to specify them unless you need to
  # override them.
  #
  sp_config:
  #  # point this to the IdP's metadata. You can use either a local file or
  #  # (preferably) a URL.
    metadata:
  #    #local: ["saml2/idp.xml"]
      remote:
        - url: https://YOUR_KEYCLOAK_URL/auth/realms/YOUR_REALM/protocol/saml/descriptor
  #
  #    # By default, the user has to go to our login page first. If you'd like
  #    # to allow IdP-initiated login, set 'allow_unsolicited: true' in a
  #    # 'service.sp' section:
  #    #
  #    #service:
  #    #  sp:
  #    #    allow_unsolicited: true
  #
  #    # The examples below are just used to generate our metadata xml, and you
  #    # may well not need them, depending on your setup. Alternatively you
  #    # may need a whole lot more detail - see the pysaml2 docs!
  #
  #    description: ["My awesome SP", "en"]
  #    name: ["Test SP", "en"]
  #
  #    organization:
  #      name: Example com
  #      display_name:
  #        - ["Example co", "en"]
  #      display_name:
  #        - ["Example co", "en"]
  #      url: "http://example.com"
  #
  #    contact_person:
  #      - given_name: Bob
  #        sur_name: "the Sysadmin"
  #        email_address": ["admin@example.com"]
  #        contact_type": technical

  # Instead of putting the config inline as above, you can specify a
  # separate pysaml2 configuration file:
  #
  config_path: "/data/sp_conf.py"
  # Or for container envs:
  config_path: "/synapse/config/sp_conf.py"

  # The lifetime of a SAML session. This defines how long a user has to
  # complete the authentication process, if allow_unsolicited is unset.
  # The default is 5 minutes.
  #
  #saml_session_lifetime: 5m

  # An external module can be provided here as a custom solution to
  # mapping attributes returned from a saml provider onto a matrix user.
  #
  user_mapping_provider:
    # The custom module's class. Uncomment to use a custom module.
    #
    #module: mapping_provider.SamlMappingProvider

    # Custom configuration values for the module. Below options are
    # intended for the built-in provider, they should be changed if
    # using a custom module. This section will be passed as a Python
    # dictionary to the module's `parse_config` method.
    #
    config:
      # The SAML attribute (after mapping via the attribute maps) to use
      # to derive the Matrix ID from. 'uid' by default.
      #
      # Note: This used to be configured by the
      # saml2_config.mxid_source_attribute option. If that is still
      # defined, its value will be used instead.
      #
      #mxid_source_attribute: displayName

      # The mapping system to use for mapping the saml attribute onto a
      # matrix ID.
      #
      # Options include:
      #  * 'hexencode' (which maps unpermitted characters to '=xx')
      #  * 'dotreplace' (which replaces unpermitted characters with
      #     '.').
      # The default is 'hexencode'.
      #
      # Note: This used to be configured by the
      # saml2_config.mxid_mapping option. If that is still defined, its
      # value will be used instead.
      #
      #mxid_mapping: dotreplace

  # In previous versions of synapse, the mapping from SAML attribute to
  # MXID was always calculated dynamically rather than stored in a
  # table. For backwards- compatibility, we will look for user_ids
  # matching such a pattern before creating a new account.
  #
  # This setting controls the SAML attribute which will be used for this
  # backwards-compatibility lookup. Typically it should be 'uid', but if
  # the attribute maps are changed, it may be necessary to change it.
  #
  # The default is 'uid'.
  #
  #grandfathered_mxid_source_attribute: upn

  # Directory in which Synapse will try to find the template files below.
  # If not set, default templates from within the Synapse package will be used.
  #
  # DO NOT UNCOMMENT THIS SETTING unless you want to customise the templates.
  # If you *do* uncomment it, you will need to make sure that all the templates
  # below are in the directory.
  #
  # Synapse will look for the following templates in this directory:
  #
  # * HTML page to display to users if something goes wrong during the
  #   authentication process: 'saml_error.html'.
  #
  #   This template doesn't currently need any variable to render.
  #
  # You can see the default templates at:
  # https://github.com/matrix-org/synapse/tree/master/synapse/res/templates
  #
  #template_dir: "res/templates"

password_config:
   # Uncomment to disable password login
   #
   enabled: false

   # Uncomment to disable authentication against the local password
   # database. This is ignored if `enabled` is false, and is only useful
   # if you have other password_providers.
   #
   #localdb_enabled: false

   # Uncomment and change to a secret random string for extra security.
   # DO NOT CHANGE THIS AFTER INITIAL SETUP!
   #
   #pepper: "EVEN_MORE_SECRET"
[...]
```

> **THANKS**
>
> And again a huge thanks to Helder Ferreira ([@wounn Twitter](https://twitter.com/wounn), [HelderFSFerreira GitHub](https://github.com/HelderFSFerreira)) for updating the configs in this post!

## Summary

That should be it, now when you go to your Riot Webapp (and chose your Matrix Homeserver) it should give you a button to login through your (SAML2) SSO.

{{< figure src="riot-webapp-sso-login.png" width="900px" title="Riot Webapp SSO Login" >}}

If it does not work, make sure your Matrix Synapse Homeserver has the required `pysaml2` module installed and check your Synapse Homeserver logs for errors and / or warnings.

Have Fun!
