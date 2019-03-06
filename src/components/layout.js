import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
import PrivacyPolicy from "./privacy-policy";

class Layout extends React.Component {
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

function linkToRoot({title}) {
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
  );
}

function headerForRootLayout({title}) {
  return (
    <h1
      style={{
        ...scale(1.5),
        marginBottom: rhythm(1.5),
        marginTop: 0,
      }}
    >
      {linkToRoot({title})}
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
      {linkToRoot({title})}
    </h3>
  )
}

export default Layout
