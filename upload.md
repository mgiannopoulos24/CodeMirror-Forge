# Uploading to WordPress.org

## Prerequisites
- WordPress account (https://wordpress.org)
- Plugin approved (or use your existing account)

## Steps

### 1. Create the zip
```bash
bun run bundle
```
This creates `codemirror-forge.zip` with only the required plugin files.

### 2. Test the zip
Extract and test on a fresh WordPress install to ensure everything works.

### 3. Submit to WordPress.org
1. Go to https://wordpress.org/plugins/developers/
2. Click "Add New" → "Upload"
3. Select your zip file
4. Fill in the required information

### 4. After approval (first time)
You'll get SVN credentials. Use a GUI or:

```bash
svn checkout https://plugins.svn.wordpress.org/codemirror-forge/
cd codemirror-forge
# Copy contents from your codemirror-forge.zip (excluding .zip)
# svn add .
# svn commit -m "Initial commit"
```