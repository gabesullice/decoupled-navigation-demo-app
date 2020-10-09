JS menu component proof-of-concept
===

This React application demonstrates one approach to providing decoupled menus
to a decoupled front end. It requires a Drupal site to be installed with a
small number of patches and custom modules. Instructions for setting up the
back end are below.

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

### 2. Install Drupal

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

### 3. Log in and create test content

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
you do not have to rebuild the project. If you did _not_ use that hostname, you
will have to configure the application to use a different hostname and rebuild
the project. To do so, open and edit the `.env.js` file to use the correct
server URL. It should include the URI scheme, hostname, and port (if it's
not `80` or `443`). It should _not_ have a trailing slash (`/`).

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

Next, install the project's dependencies:

```sh
npm install
```

Finally, rebuild the `dist` directory:

```sh
npx webpack
```
