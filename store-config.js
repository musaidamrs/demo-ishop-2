/* Public storefront settings. Never place API tokens or secrets here.
   See README.md before enabling orders. */
globalThis.SHOP_CONFIG = {
  name: 'iShop', demo: true, city: '', address: '', hours: '', legalName: '',
  phone: '', email: '', telegram: '', channel: '', bot: '', mapUrl: '',
  delivery: '', payment: '', warranty: '', privacyUrl: '',
  orderEndpoint: '', siteUrl: '',
  // Orders remain previews until demo=false AND a real endpoint and privacy URL are set.
};
