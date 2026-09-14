// ✅ Universal Asset Helper - Works in both dev and production

/**
 * Get the base URL for assets
 * In development: returns '/'
 * In production with subfolder: returns '/arbutus-web/'
 */
export const getBaseUrl = () => {
    // Use Vite's BASE_URL which is set in vite.config.js
    const base = import.meta.env.BASE_URL || '/';
    return base;
  };
  
  /**
   * Get complete asset path
   * @param {string} path - Asset path (e.g., 'Header/Logo.png')
   * @returns {string} - Full path with base URL
   */
  export const getAssetPath = (path) => {
    const base = getBaseUrl();
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Remove 'assets/' if already present
    const finalPath = cleanPath.startsWith('assets/') ? cleanPath : `assets/${cleanPath}`;
    return `${base}${finalPath}`;
  };
  
  /**
   * Get image path (alias for getAssetPath)
   */
  export const getImagePath = (path) => {
    return getAssetPath(path);
  };
  
  /**
   * For public assets (like favicon, robots.txt)
   */
  export const getPublicPath = (path) => {
    const base = getBaseUrl();
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${base}${cleanPath}`;
  };
  
  // ✅ For direct use in components with useMemo
  export const useAssetPath = (path) => {
    return getAssetPath(path);
  };
  
  export default {
    getBaseUrl,
    getAssetPath,
    getImagePath,
    getPublicPath,
    useAssetPath
  };