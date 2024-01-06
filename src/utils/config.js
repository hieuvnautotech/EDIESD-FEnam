const config = {
  api: {
    API_BASE_URL: 'https://localhost:44301',
    // API_BASE_URL: "http://baseapi.autonsi.com",
    ROUTER_BASE_NAME: null,
  },
  app: {
    /**
     * The base URL for all locations. If your app is served from a sub-directory on your server, you'll want to set
     * this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash.
     */
    ROUTER_BASE_NAME: null,
  },
};

export default config;
