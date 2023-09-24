/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "f6fa2a9949f18c6501a8042138fba628"
  },
  {
    "url": "api/index.html",
    "revision": "e1f4f722a5acdc800c2276c5e7226841"
  },
  {
    "url": "api/router-alive.html",
    "revision": "65440bd898454baa472a81691a200645"
  },
  {
    "url": "assets/css/0.styles.998bc458.css",
    "revision": "220345423c1341a0381984261532d128"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/1.d076c7c3.js",
    "revision": "0fcf6f76919a0c0e2480fd4aaa8a0278"
  },
  {
    "url": "assets/js/10.21eaf3ed.js",
    "revision": "8e73379849d64aa9c452230cf8923f53"
  },
  {
    "url": "assets/js/11.877e740a.js",
    "revision": "8b98a998eb621709390ed77257df39ac"
  },
  {
    "url": "assets/js/12.edc9b8b7.js",
    "revision": "d17efb90598fef46babb022d41f4ea2d"
  },
  {
    "url": "assets/js/13.3e28d37a.js",
    "revision": "effca08fdb67a799bc0e3412376e4e20"
  },
  {
    "url": "assets/js/14.95e665c0.js",
    "revision": "07bd56e21d8bce7de6382d2fde7de9e5"
  },
  {
    "url": "assets/js/15.aa7adc4f.js",
    "revision": "0bbf415e1b601a8e2c3b91f4a17c9f27"
  },
  {
    "url": "assets/js/16.b7fa7e25.js",
    "revision": "675444142613a1b396d351012cd323f0"
  },
  {
    "url": "assets/js/17.c9de18cf.js",
    "revision": "8b735aff8bb6046690788ea68ec39dfc"
  },
  {
    "url": "assets/js/18.ed146a75.js",
    "revision": "942b69c95ffba3cec0ddfdf2b081ed22"
  },
  {
    "url": "assets/js/19.a232a4f4.js",
    "revision": "3a3643224032745c68ab9b92d62b1ff5"
  },
  {
    "url": "assets/js/2.63a362ba.js",
    "revision": "9a65f9f9052f8ec9c3779fb27a8fedd4"
  },
  {
    "url": "assets/js/20.fbbccb63.js",
    "revision": "e9c234b2f5d3ec27d3eab99c3e454ca5"
  },
  {
    "url": "assets/js/21.8da7225a.js",
    "revision": "a55961063d9df09b41328290acb16875"
  },
  {
    "url": "assets/js/22.ba953def.js",
    "revision": "a1bca1e8840b3fd783ce9ae8c8668058"
  },
  {
    "url": "assets/js/23.3987f86e.js",
    "revision": "855e5b96b9471afde167a70646045866"
  },
  {
    "url": "assets/js/24.92ababaf.js",
    "revision": "4824c216367cd7c806e0a4f12201d9c7"
  },
  {
    "url": "assets/js/25.ea775cf5.js",
    "revision": "7af8a171aaf8b126e82a43083912b309"
  },
  {
    "url": "assets/js/26.0b59aa70.js",
    "revision": "180807f9b9b3ba89ef0193ddc8ab617e"
  },
  {
    "url": "assets/js/27.e5bd29b5.js",
    "revision": "5e69629fe9ab4c084b50607a4443035c"
  },
  {
    "url": "assets/js/28.dcff4c5f.js",
    "revision": "9b2a95de4f83d5b8e8ad89ad8741709d"
  },
  {
    "url": "assets/js/29.656045c2.js",
    "revision": "00be0c3359f2d5c4ed5152a894a6b708"
  },
  {
    "url": "assets/js/3.e97be4d8.js",
    "revision": "f2833760f934b40ce30f6a0048f791d7"
  },
  {
    "url": "assets/js/30.13e59812.js",
    "revision": "f465d84dcb7456f8f9d5b07d01868f7a"
  },
  {
    "url": "assets/js/31.af41b5b6.js",
    "revision": "161c625694d972b676124152803817ef"
  },
  {
    "url": "assets/js/32.85f71648.js",
    "revision": "71392b083e67a55751462c9014edc39b"
  },
  {
    "url": "assets/js/33.5b076330.js",
    "revision": "9a7d81425b8d3ab299c0ad110c15cd64"
  },
  {
    "url": "assets/js/34.6e3aa66c.js",
    "revision": "7715497ced38b9b109b5b6a4e0cc613f"
  },
  {
    "url": "assets/js/35.1d998f03.js",
    "revision": "7a155367b8dd72be4e901ef2ebe382e4"
  },
  {
    "url": "assets/js/36.2c2958ee.js",
    "revision": "6dc5ada3703ac3777e56a102f2389c2f"
  },
  {
    "url": "assets/js/37.b5eea1b3.js",
    "revision": "39bb513e5bdec30ba981e740be2a3045"
  },
  {
    "url": "assets/js/38.12d54ee1.js",
    "revision": "812772afb349dca656369a0ab375bdbe"
  },
  {
    "url": "assets/js/39.f445ba29.js",
    "revision": "5163f624c7b92a12c6ea00d9988c077f"
  },
  {
    "url": "assets/js/4.8ebc2106.js",
    "revision": "b7d767384fb838ef66b385ab30248fe9"
  },
  {
    "url": "assets/js/40.d70b8bae.js",
    "revision": "8fa84e6d943908c70b2e723f445c6296"
  },
  {
    "url": "assets/js/41.bd51c20b.js",
    "revision": "82ad68fda667953cc456d4e388ff865f"
  },
  {
    "url": "assets/js/42.d1ec340f.js",
    "revision": "bc70bbd2e499551aa7a70eb6144a3cb3"
  },
  {
    "url": "assets/js/43.7c70ce99.js",
    "revision": "eacf772b4efe363d399ca6c24fe8ab92"
  },
  {
    "url": "assets/js/44.62a48fbf.js",
    "revision": "2e5a944442299344f85495500450a2a1"
  },
  {
    "url": "assets/js/45.80065c80.js",
    "revision": "960dc6418e307bfd8b13914e392db9bd"
  },
  {
    "url": "assets/js/46.5ebd4c07.js",
    "revision": "78e5f43b8582f73cf089a1a1b226ac84"
  },
  {
    "url": "assets/js/47.2802542d.js",
    "revision": "7a0f1bb940ab373167be8d5dfef8dfaf"
  },
  {
    "url": "assets/js/48.972a564c.js",
    "revision": "cb83adc1142ac1a35933b2544b0c11d6"
  },
  {
    "url": "assets/js/49.cacfe59e.js",
    "revision": "721170a9dc04f5b9f49945857ae80b7c"
  },
  {
    "url": "assets/js/5.a0309397.js",
    "revision": "98cca5aefdd5c2eb18e78bf1ffe2ce22"
  },
  {
    "url": "assets/js/50.7856100c.js",
    "revision": "c63918564e2e0512948bf7525d7921ba"
  },
  {
    "url": "assets/js/51.5b1de28b.js",
    "revision": "d21838aabdf781c6442d5fdc963055af"
  },
  {
    "url": "assets/js/52.a11c919d.js",
    "revision": "36a4d7c2e6e655d9c212cade1dd12628"
  },
  {
    "url": "assets/js/53.62a5c909.js",
    "revision": "e660d33e7429a4f45fe15dcef5b3f762"
  },
  {
    "url": "assets/js/54.5a337d39.js",
    "revision": "efe86323df560246f95465d3b31d76c8"
  },
  {
    "url": "assets/js/55.30b5f5e0.js",
    "revision": "234c3043c19127a7d2aec5bf1450b406"
  },
  {
    "url": "assets/js/56.0ca63990.js",
    "revision": "9947a0fb0e1edefbf1b1d30775c3d14b"
  },
  {
    "url": "assets/js/57.7b7450d9.js",
    "revision": "2b6576976e4193606be432b6db351cc4"
  },
  {
    "url": "assets/js/58.8a080824.js",
    "revision": "ec4a8a05898f3f7f850068a797957d54"
  },
  {
    "url": "assets/js/59.e712d66f.js",
    "revision": "f2b318e752add8f538a4ac2f9324da09"
  },
  {
    "url": "assets/js/6.d60efe52.js",
    "revision": "fbe4f6eaa14922bf7391c8fb01407c60"
  },
  {
    "url": "assets/js/60.6e1d368a.js",
    "revision": "0603e72bbf108683cc0c3f62c7440ed5"
  },
  {
    "url": "assets/js/61.319c1de1.js",
    "revision": "efe5d74116d03727f08793efb563d36e"
  },
  {
    "url": "assets/js/62.7c69587b.js",
    "revision": "8815a8fb078bfec889d78d1a7e8857f8"
  },
  {
    "url": "assets/js/63.b874dabd.js",
    "revision": "9fbd1c10a2dcef24e8945f3c48b0ff9b"
  },
  {
    "url": "assets/js/64.4feb526c.js",
    "revision": "6fe425e8be270d17b0fafe176845385c"
  },
  {
    "url": "assets/js/65.1bce7224.js",
    "revision": "386afe1026e93af4ffeb2153a6dd1e4a"
  },
  {
    "url": "assets/js/66.5d40c479.js",
    "revision": "bc55e58c89b6b7181c358b42e4316859"
  },
  {
    "url": "assets/js/67.125968fa.js",
    "revision": "81c3bab0305e7a5f2c828044ff6b9bbc"
  },
  {
    "url": "assets/js/68.75d5fd82.js",
    "revision": "c364612fc2e23c9c9dc32a915029f24b"
  },
  {
    "url": "assets/js/69.11d4a077.js",
    "revision": "8c3e8770bd7b543fa3afc2baaf103caa"
  },
  {
    "url": "assets/js/7.798e2d70.js",
    "revision": "e90da52685c859786b0a296158332100"
  },
  {
    "url": "assets/js/70.2f9ae04e.js",
    "revision": "7bcc8de6037f70f807fb3ab2dd6ba859"
  },
  {
    "url": "assets/js/71.f845c4c2.js",
    "revision": "be236d5ec144236acfef6c2358387ea6"
  },
  {
    "url": "assets/js/72.f96f5886.js",
    "revision": "b6ca9438ba5dd9131a0c0bc56e8fa1da"
  },
  {
    "url": "assets/js/73.0dd6c7c5.js",
    "revision": "27c4f1662f4d00ba3222b07d0ed1ca75"
  },
  {
    "url": "assets/js/74.2aaacbf3.js",
    "revision": "096eb63afee0e03862f645e237587ab9"
  },
  {
    "url": "assets/js/75.9a3b45e4.js",
    "revision": "fbc3d057d7218e5408fb5e2d6abec3e6"
  },
  {
    "url": "assets/js/app.be265bbd.js",
    "revision": "0a972403a77a98d402b3ca843bd7fcb4"
  },
  {
    "url": "assets/js/vendors~docsearch.1bff6fe0.js",
    "revision": "0585d98fd3a95791d3ec3b0fb13bc932"
  },
  {
    "url": "guide/advanced/cache.html",
    "revision": "bb7f811fd7cfcd795cb942f2727e2dc4"
  },
  {
    "url": "guide/advanced/dynamic-tab-info.html",
    "revision": "0159ab1b142b735297c7144bd6f50ce9"
  },
  {
    "url": "guide/advanced/initial-tabs.html",
    "revision": "3002fd6de05472a4bf9ccbddb20fac2f"
  },
  {
    "url": "guide/advanced/page-leave.html",
    "revision": "86d935680bae302143976f80ba8438db"
  },
  {
    "url": "guide/advanced/restore.html",
    "revision": "8c10306b110629f0a8bda40c5f6e1978"
  },
  {
    "url": "guide/changelog.html",
    "revision": "de208f355d8097ec94984a2a5731a360"
  },
  {
    "url": "guide/custom/contextmenu.html",
    "revision": "ef1f0893eb35156679a4bd3b658d8184"
  },
  {
    "url": "guide/custom/i18n.html",
    "revision": "3f9fc5251d34c3f5f16013468eaf82eb"
  },
  {
    "url": "guide/custom/index.html",
    "revision": "c925f9e547227c56f0125a67ca4935d1"
  },
  {
    "url": "guide/custom/scroll.html",
    "revision": "45dd2e68efb614fb2b6d2f7961fb86e1"
  },
  {
    "url": "guide/custom/slot.html",
    "revision": "29aedd7b4efcd51b8197b0d4b9779dc0"
  },
  {
    "url": "guide/custom/transition.html",
    "revision": "c64c0699a863c8f4488cc0f81362ffd5"
  },
  {
    "url": "guide/essentials/iframe.html",
    "revision": "a400f70b053a1f755da6b8b6d9c9fcc5"
  },
  {
    "url": "guide/essentials/index.html",
    "revision": "aabc4f272b456b01782b004a366866ff"
  },
  {
    "url": "guide/essentials/installation.html",
    "revision": "3ef48cad1921eba8b891e7ab20f87b1c"
  },
  {
    "url": "guide/essentials/nuxt.html",
    "revision": "a279ceb027b3af41dd6aa20210ebd3a2"
  },
  {
    "url": "guide/essentials/operate.html",
    "revision": "1a9596b0c0098028f8e038e5ac559cd5"
  },
  {
    "url": "guide/essentials/rule.html",
    "revision": "96e9dc0e50ed8499d0e2dba55c3fdc5a"
  },
  {
    "url": "guide/index.html",
    "revision": "aeacc0cc8387cf64ca469cc0fa2dee2b"
  },
  {
    "url": "guide/meta/faqs.html",
    "revision": "ac97c71741cd2b12b2ab1f78a2cec390"
  },
  {
    "url": "guide/meta/solutions.html",
    "revision": "049c40c2e6a1710e9f28c96e832c0966"
  },
  {
    "url": "guide/meta/uninstall.html",
    "revision": "e13ec977be15deec1c89c9cd09dae894"
  },
  {
    "url": "index.html",
    "revision": "0d97a2867a9159b20028ee1bd9acf571"
  },
  {
    "url": "zh/api/index.html",
    "revision": "fb2ecb4ae460ade15645ad3e8dfa6f3c"
  },
  {
    "url": "zh/api/router-alive.html",
    "revision": "263cf8417cb164364db863023292c6ae"
  },
  {
    "url": "zh/guide/advanced/cache.html",
    "revision": "7828ef7a0e4d969357ed2106ea21deee"
  },
  {
    "url": "zh/guide/advanced/dynamic-tab-info.html",
    "revision": "966e88d75f21b6ac5b9dfbc7c3b0ca81"
  },
  {
    "url": "zh/guide/advanced/initial-tabs.html",
    "revision": "3171546c78ca491aefcb8ad93910b5f7"
  },
  {
    "url": "zh/guide/advanced/page-leave.html",
    "revision": "5641ae65e8be58b72529bc090a8ef84c"
  },
  {
    "url": "zh/guide/advanced/restore.html",
    "revision": "82d497b6d3436f370a497459340dc5de"
  },
  {
    "url": "zh/guide/changelog.html",
    "revision": "371ed3d85cd86028bb35cfe359f35e6c"
  },
  {
    "url": "zh/guide/custom/contextmenu.html",
    "revision": "57b8960f481bc5930d503d27d18b19c5"
  },
  {
    "url": "zh/guide/custom/i18n.html",
    "revision": "ea64d58eaec7082f2bd646ca6506ad2e"
  },
  {
    "url": "zh/guide/custom/index.html",
    "revision": "467cdcb927616bdff24f02b7aae15f3a"
  },
  {
    "url": "zh/guide/custom/scroll.html",
    "revision": "0a2283d9e31b149269f020d62687f9f4"
  },
  {
    "url": "zh/guide/custom/slot.html",
    "revision": "b692775eb1777cb3b847f99fa9257a07"
  },
  {
    "url": "zh/guide/custom/transition.html",
    "revision": "54622842e0bd303c6a4fdd0471c7e743"
  },
  {
    "url": "zh/guide/essentials/iframe.html",
    "revision": "63a4798ff1d6d403bec6a142fd0a9d1f"
  },
  {
    "url": "zh/guide/essentials/index.html",
    "revision": "70e1f9149c7eefdd08f1125762e1a45a"
  },
  {
    "url": "zh/guide/essentials/installation.html",
    "revision": "1a80787b8767c78ff67649154627631d"
  },
  {
    "url": "zh/guide/essentials/nuxt.html",
    "revision": "97bd1cb74b7c25a66134a1709f3327ef"
  },
  {
    "url": "zh/guide/essentials/operate.html",
    "revision": "ce724f7ebd052ad32e6e638a5f9996f9"
  },
  {
    "url": "zh/guide/essentials/rule.html",
    "revision": "80415d228ae9fc6ce05a89ccb4811cf7"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "bb14baf6d90c879151db0caeea14bbdc"
  },
  {
    "url": "zh/guide/meta/faqs.html",
    "revision": "d4f9c8e64a518b08b2862a665ed2d06b"
  },
  {
    "url": "zh/guide/meta/solutions.html",
    "revision": "38dd22c86be8e8154c303f4b0ce48c77"
  },
  {
    "url": "zh/guide/meta/uninstall.html",
    "revision": "17979825249be65683cfbb340ba15aa1"
  },
  {
    "url": "zh/index.html",
    "revision": "90086ea9efc71795eaa08462d7ae96dd"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
