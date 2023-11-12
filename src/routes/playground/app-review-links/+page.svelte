<script lang="ts">
  // sample values for Google Maps app as found in the AppStore and Play Store.
  let googlePlayStorePackageIdentifier = "com.google.android.apps.maps";
  let iOsAppStoreAppName = "google-maps";
  let iOsAppStoreIdentifier = "id585027354";
</script>
<style>
  ul {
    list-style: square;
  }
  li {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  li:nth-child(odd) {
    background-color: #f5f5f5;
    border-radius: 4px;
  }


</style>

<h2>App Review Links</h2>
<p>The goal of this playground tool is to generate links to test how they are opened on different kind of devices.</p>
<p><i>NOTE: Sample values are provided for the Google Maps app as found in the AppStore and Play Store.</i></p>
<h3>Google Play Store</h3>

<p>Check the URL of your Google Play Store application page, you will find the 
  <label for="googlePlayStorePackageIdentifier">Android Application package name</label>
  <input name="googlePlayStorePackageIdentifier" bind:value={googlePlayStorePackageIdentifier} />
</p>

<ul>
<li><a href="{`https://play.google.com/store/apps/details?id=${googlePlayStorePackageIdentifier}&hl=fr&gl=FR`}">{`https://play.google.com/store/apps/details?id=${googlePlayStorePackageIdentifier}&hl=fr&gl=FR`}</a></li>
<li><a href="{`market://details?id=${googlePlayStorePackageIdentifier}`}">{`market://details?id=${googlePlayStorePackageIdentifier}`}</a></li>
</ul>

<h3>Apple App Store</h3>

<p>First, you need to copy-paste your 
  <label for="iOsAppStoreIdentifier">AppStore App Identifier</label>
  <input type="text" name="iOsAppStoreIdentifier" bind:value={iOsAppStoreIdentifier}/>
</p>

<p>Different variants are possible given iOS version evolutions:</p>

<ul>
  <li>with <code>https</code> or <code>itms-apps</code>,</li>
  <li>using <code>itunes.apple.com/app</code> or <code>apps.apple.com</code> </li>
  <li>with or without the <label for="iOsAppStoreAppName">App Name</label><input name="iOsAppStoreAppName" type="text" bind:value={iOsAppStoreAppName} />,</li>
  <li>with or without the country code <code>US</code> (because <a href="https://openradar.appspot.com/34498138">https://openradar.appspot.com/34498138</a>), </li>
  <li>with or without the <code>action=write-review</code></li>
</ul>

<br/>

<p>Here are some of the link combinations:</p>

<ul>
  <li><a href="{`https://itunes.apple.com/app/${iOsAppStoreIdentifier}?mt=8&action=write-review`}">{`https://itunes.apple.com/app/${iOsAppStoreIdentifier}?mt=8&action=write-review`}</a></li>
  <li><a href="{`https://itunes.apple.com/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8&action=write-review`}">{`https://itunes.apple.com/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8&action=write-review`}</a></li>
  <li><a href="{`https://itunes.apple.com/us/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8&action=write-review`}">{`https://itunes.apple.com/us/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8&action=write-review`}</a></li>
  <li><a href="{`itms-apps://itunes.apple.com/app/${iOsAppStoreIdentifier}?mt=8&action=write-review`}">{`itms-apps://itunes.apple.com/app/${iOsAppStoreIdentifier}?mt=8&action=write-review`}</a></li>
  <li><a href="{`itms-apps://itunes.apple.com/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8`}">{`itms-apps://itunes.apple.com/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8`}</a></li>
  <li><a href="{`itms-apps://itunes.apple.com/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8&action=write-review`}">{`itms-apps://itunes.apple.com/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8&action=write-review`}</a></li>
  <li><a href="{`itms-apps://itunes.apple.com/us/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8&action=write-review`}">{`itms-apps://itunes.apple.com/us/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?mt=8&action=write-review`}</a></li>
  <li>This one opens the app on the AppStore:<br/>
  <a href="{`https://apps.apple.com/fr/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}`}">{`https://apps.apple.com/fr/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}`}</a></li>
  <li>This one opens the app rate and review form directly on the AppStore:<br/>
  <a href="{`https://apps.apple.com/fr/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?action=write-review`}">{`https://apps.apple.com/fr/app/${iOsAppStoreAppName}/${iOsAppStoreIdentifier}?action=write-review`}</a></li>
</ul>