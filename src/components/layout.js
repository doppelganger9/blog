import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
import PrivacyPolicy from "./privacy-policy"
import Helmet from 'react-helmet'

class Layout extends React.Component {

  componentDidMount() {
    if (window.twttr) {
      if (typeof window.twttr.widgets !== 'undefined') {
        window.twttr.widgets.load()
      }
    }
  }

  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header
    const isRootLayout = location.pathname === rootPath

    if (isRootLayout) {
      header = headerForRootLayout({ title })
    } else {
      header = headerForPostLayout({ title })
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <Helmet>{/* Adding Twitter Widget wherever we use Layout */}
          <script type="text/javascript">{`
            window.twttr = (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
              if (d.getElementById(id)) return t;
              js = d.createElement(s);
              js.id = id;
              js.src = "https://platform.twitter.com/widgets.js";
              fjs.parentNode.insertBefore(js, fjs);

              t._e = [];
              t.ready = function(f) {
                t._e.push(f);
              };

              return t;
            }(document, "script", "twitter-wjs"));`}
          </script>
          <style>{`
          .no-box-shadow {
              box-shadow: none;
          }
          `}
          </style>
        </Helmet>
        <header>{header}</header>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
          &nbsp;-&nbsp;
          <PrivacyPolicy />
        </footer>
      </div>
    )
  }
}

function linkToRoot({ title }) {
  return (
    <Link
      style={{
        boxShadow: `none`,
        textDecoration: `none`,
        color: `inherit`,
      }}
      to={`/`}
    >
      {title}
    </Link>
  )
}

function headerForRootLayout({ title }) {
  return (
    <h1
      style={{
        ...scale(1.5),
        marginBottom: rhythm(1.5),
        marginTop: 0,
      }}
    >
      {linkToRoot({ title })}
    </h1>
  )
}

function headerForPostLayout({ title }) {
  return (
    <h3
      style={{
        fontFamily: `Montserrat, sans-serif`,
        marginTop: 0,
      }}
    >
      {linkToRoot({ title })}
    </h3>
  )
}

export default Layout
