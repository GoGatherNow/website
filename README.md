# GoGatherNow Website

Static website and policy pages for GoGatherNow.

## Pages

- `/` product overview
- `/privacy.html` privacy policy for app store review
- `/support.html` support contact page
- `/delete-account.html` account deletion instructions
- `/terms.html` terms of use

## GitHub Pages

This repository is intended to be published with GitHub Pages from the `main`
branch root.

Custom domain:

```text
gogathernow.com
```

## GoDaddy DNS

In GoDaddy DNS, point the apex/root domain to GitHub Pages:

```text
Type  Name  Value
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
```

Point `www` to the GitHub Pages host:

```text
Type   Name  Value
CNAME  www   gogathernow.github.io
```

After DNS propagates, open the repository's GitHub Pages settings and enable
HTTPS.

GitHub's official Pages custom-domain docs are here:
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
