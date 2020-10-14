JS menu component proof-of-concept
===

This React application demonstrates one approach to providing decoupled menus
to a decoupled front end. It requires a Drupal site to be installed with a few
patches and custom modules. You will find setup instructions below.

The back end requires a couple sandbox modules (which require a couple core
patches). The back end also needs to have some default configuration and
content set up.

In order to avoid CORS configuration and multiple vhosts, this project can be
installed and used as a Drupal theme which simply loads the React SPA for all
non-admin pages.

## Setup

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
cd "$INSTALL_DIR"

# Enables automatic patch application.
composer require cweagans/composer-patches:^1.5
composer config extra.enable-patching true

# Makes the required sandbox modules and this project available to composer.
composer config repositories.1 vcs https://git.drupalcode.org/sandbox/gabesullice-3175825.git
composer config repositories.2 vcs https://git.drupalcode.org/sandbox/gabesullice-3175828.git
composer config repositories.3 vcs git@github.com:gabesullice/decoupled-navigation-demo-app.git

# Installs the required modules.
composer require --prefer-source drupal/jsonapi_navigation:1.0.x-dev
composer require --prefer-source drupal/js_menu_demo:1.0.x-dev

# Forces composer to apply the patches required by the sandbox modules.
composer install
```

### 2. Install Drupal

Change directories into the web root (`cd web`) and run the following command.

```sh
php core/scripts/drupal install standard
```

Take note of the generated username and password.

Finally, you will need to set up an Apache vhost or other server. This is left
as an exercise for the reader.

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

### 5. Install required modules

Visit `/admin/modules` and enable the _JSON:API Navigation_ module and its
dependencies.

### 6. Install the bridge theme

Visit `/admin/appearance`, find the _JS Menu Component Bridge_ theme and click
_Install and set as default_. Do not use this theme as an administration theme
and be sure to enable the _Use the administration theme when editing or
creating content_ option.

## Developer setup

If you would like to developer this project you will need to build the project.
To do so, install the project's dependencies by changing directories into
`themes/contrib/js_menu_demo` and running:

```sh
npm install
```

Next, create a `.env.js` file:

```sh
make .env.js
```

To build the project, run:

```sh
make
```

Running `make` will run both [prettier] and [webpack], but you can run them
individually with either `make prettier` or `make pack`.

[prettier]: https://prettier.io/
[webpack]: https://webpack.js.org/
