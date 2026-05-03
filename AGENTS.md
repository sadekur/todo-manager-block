# AGENTS.md - Todo Manager Block

## Build Commands

- `npm install` - Install JS dependencies (run once)
- `npm run build` - Build all assets (block, admin, frontend)
- `npm run start` - Watch mode for development
- `composer install --no-dev` - Install PHP dependencies (autoloading)

## Architecture

### Entry Points
- **Plugin**: `todo-manager-block.php` (main plugin file, currently missing/broken - needs fixing)
- **PHP Classes**: `src/php/` with PSR-4 autoloading via Composer
  - `Plugin.php` - Main plugin bootstrap (singleton)
  - `Post_Type.php` - Custom post type registration
  - `Admin.php` - Admin page
  - `Assets.php` - Asset enqueuing

### JavaScript Entry Points
- `src/blocks/todo-manager/index.js` - Block registration
- `src/admin.js` - Admin page React app
- `src/frontend.js` - Frontend React app

### Build Output
- `build/` - Compiled assets (already in repo)
- Block assets: `build/blocks/todo-manager/`
- Admin JS: `build/admin.js`
- Frontend JS: `build/frontend.js`

## Critical Quirks

### PHP Syntax Issues
- PHP files were corrupted during creation - always verify with `php -l <file>` before committing
- Constants must use single quotes: `define('ABSPATH', ...)` not double quotes
- WordPress constants: `ABSPATH`, `__FILE__` (double underscores)
- Array syntax: Use `array()` not `[]` for compatibility

### Plugin Header
- Must use `/*` and `*/` (not `/**` style)
- Format: ` * Plugin Name: ...` (with space after `*`)

### WordPress Constants
- `ABSPATH` not `ABSPATH`
- `__FILE__` not `__FILE__` (double underscores on both sides)

### Build System
- Uses `@wordpress/scripts` for building
- Webpack config extends default with custom entry points
- Block JSON references `build/` paths: `editorScript`, `editorStyle`, `style`

## Testing
- No formal test suite
- Verify plugin shows in WordPress admin after fixing `todo-manager-block.php`
- Check browser console for JavaScript errors
- Test block in Gutenberg editor
- Test admin page at "Todo Manager" menu

## Common Fixes

### Plugin Not Showing
1. Check `todo-manager-block.php` exists in plugin root
2. Verify plugin header has correct syntax
3. Check PHP syntax: `php -l todo-manager-block.php`
4. Ensure `vendor/autoload.php` exists (run `composer install`)

### Fatal Error: Class Not Found
1. Verify `composer.json` has PSR-4: `"TodoManagerBlock\\": "src/php/"`
2. Run `composer dump-autoload` to regenerate autoloader
3. Check PHP files in `src/php/` have correct `namespace TodoManagerBlock;`

## Git Commits
- 20+ commits already made
- Latest commits fix PHP syntax errors
- Push to `origin master` when ready
