#!/bin/bash

# Script to handle i18n for a specific language
# Usage: ./scripts/i18n-lang.sh es_ES [update|make-mo|all]

if [ -z "$1" ]; then
    echo "Usage: $0 <locale> [update|make-mo|all]"
    echo "Example: $0 es_ES all"
    echo "Example: $0 es_ES update"
    echo "Example: $0 es_ES make-mo"
    exit 1
fi

LANG_CODE=$1
ACTION=${2:-all}

# Find plugin directory inside wp-env
PLUGIN_DIR=$(wp-env run cli sh -c 'find /var/www/html/wp-content/plugins -name codemirror-forge.php -type f | head -1 | xargs dirname')

if [ -z "$PLUGIN_DIR" ]; then
    echo "Error: Could not find plugin directory. Make sure wp-env is running."
    exit 1
fi

case $ACTION in
    update)
        echo "Updating PO file for $LANG_CODE..."
        wp-env run cli sh -c "cd $PLUGIN_DIR && if [ ! -f ./languages/codemirror-forge-$LANG_CODE.po ]; then echo \"Creating PO file from POT...\"; cp ./languages/codemirror-forge.pot ./languages/codemirror-forge-$LANG_CODE.po; fi && wp i18n update-po ./languages/codemirror-forge.pot ./languages/codemirror-forge-$LANG_CODE.po"
        ;;
    make-mo)
        echo "Creating MO file for $LANG_CODE..."
        wp-env run cli sh -c "cd $PLUGIN_DIR && if [ -f ./languages/codemirror-forge-$LANG_CODE.po ]; then wp i18n make-mo ./languages/codemirror-forge-$LANG_CODE.po ./languages/codemirror-forge-$LANG_CODE.mo; else echo \"Error: PO file codemirror-forge-$LANG_CODE.po does not exist. Run 'update' action first.\"; exit 1; fi"
        ;;
    all)
        echo "Running full i18n process for $LANG_CODE..."
        # First make sure POT is up to date
        echo "Generating POT file..."
        wp-env run cli sh -c "cd $PLUGIN_DIR && wp i18n make-pot . ./languages/codemirror-forge.pot --domain=codemirror-forge"
        # Create PO from POT if it doesn't exist, then update it
        echo "Updating PO file for $LANG_CODE..."
        wp-env run cli sh -c "cd $PLUGIN_DIR && if [ ! -f ./languages/codemirror-forge-$LANG_CODE.po ]; then echo \"Creating PO file from POT...\"; cp ./languages/codemirror-forge.pot ./languages/codemirror-forge-$LANG_CODE.po; fi && wp i18n update-po ./languages/codemirror-forge.pot ./languages/codemirror-forge-$LANG_CODE.po"
        # Make MO
        echo "Creating MO file for $LANG_CODE..."
        wp-env run cli sh -c "cd $PLUGIN_DIR && wp i18n make-mo ./languages/codemirror-forge-$LANG_CODE.po ./languages/codemirror-forge-$LANG_CODE.mo"
        echo "Successfully completed i18n process for $LANG_CODE!"
        ;;
    *)
        echo "Invalid action: $ACTION"
        echo "Valid actions: update, make-mo, all"
        exit 1
        ;;
esac
