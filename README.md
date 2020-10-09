JS menu component proof-of-concept
===

This React application demonstrates one approach to providing decoupled menus
to a decoupled front end. It requires a Drupal site to be installed with a
small number of patches and custom modules. Instructions for setting up the
back end are below.

# Back end setup

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
