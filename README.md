JS menu component proof-of-concept
===

This React application demonstrates one approach to providing decoupled menus
to a decoupled front end. It requires a Drupal site to be installed with a
small number of patches and custom modules. Instructions for setting up the
front and back ends are below.

The back end requires a couple sandbox modules (which require a couple core
patches). The back end also needs to have some default configuration and
content set up.

[Skip to front end setup](#front-end-setup).

## Back end setup

### 1. Download Drupal and the required modules/patches

To install the back end, you will need to set up Drupal as a Composer project.
Then, you will need to install Drupal using the `standard` profile. Finally,
you will need to create a few test nodes and configure one of them as a front
page.

```sh
# First, change directories to where you'd like to install Drupal.
# Second, change the value below to a directory name that you prefer.
export INSTALL_DIR=js_menu_back_end

# Third, copy and paste the remaining commands into your terminal and run them.

# Creates a Drupal project and changes into its directory.
composer create-project --no-install drupal/recommended-project "$INSTALL_DIR"
cd 1"$INSTALL_DIR"

# Enables automatic patch application.
composer require cweagans/composer-patches:^1.5
composer config extra.enable-patching true

# Makes the required sandbox modules available to composer.
composer config repositories.1 vcs https://git.drupalcode.org/sandbox/gabesullice-3175825.git
composer config repositories.2 vcs https://git.drupalcode.org/sandbox/gabesullice-3175828.git

# Installs the required modules.
composer require --prefer-source drupal/jsonapi_navigation:1.0.x-dev

# Forces composer to apply the patches required by the sandbox modules.
composer install
```

### 2. Enable CORS

Unless you will be serving the front-end application and the back-end
application with the same hostname, you will need to set up the back end to
allo "cross-origin resource sharing" (CORS). To do so, create a `services.yml`
file:

```sh
cp sites/default/default.services.yml sites/default/services.yml
```

Then, make the following changes to `services.yml`:

```diff
--- a/services.yml
+++ b/services.yml
@@ -159,7 +159,7 @@
    # for more information about the topic in general.
    # Note: By default the configuration is disabled.
   cors.config:
-    enabled: false
+    enabled: true
     # Specify allowed headers, like 'x-allowed-header'.
     allowedHeaders: []
     # Specify allowed request methods, specify ['*'] to allow all possible ones.
@@ -167,7 +167,7 @@
     # Configure requests allowed from specific origins.
     allowedOrigins: ['*']
     # Sets the Access-Control-Expose-Headers header.
-    exposedHeaders: false
+    exposedHeaders: true
     # Sets the Access-Control-Max-Age header.
     maxAge: false
     # Sets the Access-Control-Allow-Credentials header.
```

### 3. Install Drupal

Change directories into the web root (`cd web`) and run the following command.

```sh
php core/scripts/drupal install standard
```

Take note of the generated username and password.

Finally, you will need to set up an Apache vhost or other server. To avoid
having to rebuild the project and apply extra configuration, use the hostname:

```
api.jsonapi-navigation.test
```

### 4. Log in and create test content

Using the previously noted credentials, visit `/user/login` and log in as User
1.

Next, visit `/node/add/page` and save a new page node entitled _My home page_.

Visit  `/node/add/page` again and create another new page entitled _My child
page_ with a URL alias of your choice. Under _menu settings_, check _Provide a
menu link_ and set the _Parent item_ to `-- Home`. Save the page.

Visit  `/node/add/article` and save a new article entitled _My first article_.
Do not choose a URL alias for this node. Under _menu settings_, check _Provide
a menu link_ and set the _Parent item_ to `-- Home` and set the _Weight_ to
`1`. Save the article.

Visit `/admin/config/system/site-information` and change the default front page
to `/node/1`.

## Front end setup

To install the front end, you need to clone this repository.

```sh
git clone git@github.com:gabesullice/decoupled-navigation-demo-app.git
cd decoupled-navigation-demo-app
```

If you used the hostname `api.decoupled-navigation.test` for the back end, then
you're done!

If you would like to make changes you will need to be build the project. To do
so, install the project's dependencies:

```sh
npm install
```

Next, create a `.env.js` file:

```sh
make .env.js
```

You must configure the project so that it can reach your back end. To do so,
open and edit the `.env.js` file. It should look like the example below. This
should the the root URL for your back end (e.g.
`https://js-menu-initiative.localhost:8888`).  It should _not_ have a trailing
slash (`/`).

```js
// .env.js
module.exports = {
  drupal: {
    server: {
      url: "http://api.decoupled-navigation.test", // <- change this!
    },
  },
};
```

Finally, build the project again by running:

```sh
make
```

Running `make` will run both [prettier] and [webpack], but you can run them
individually with either `make prettier` or `make pack`:

[prettier]: https://prettier.io/
[webpack]: https://webpack.js.org/
