import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"
import { FaTwitter, FaGithub, FaLinkedin, FaDev, FaStackOverflow, FaGitlab, FaFacebook, FaCodepen } from "react-icons/fa";

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <p>
              Written by <strong>{author}</strong> who lives in{" "}
              <a href="https://en.wikipedia.org/wiki/Senlis">
                Senlis{" "}
                <span role="img" aria-label="Stag">
                  🦌
                </span>
              </a>
              , and works in Paris{" "}
              <span role="img" aria-label="France">
                🇫🇷
              </span>
              , and{" "}
              <span role="img" aria-label="Love">
                🧡
              </span>{" "}
              building things with code.
              {` `}
              <a href={`https://twitter.com/${social.twitter}`} style={{ boxShadow: 'none' }}>
                <FaTwitter/>
              </a>{` `}
              <a href={`https://github.com/doppelganger9/`} style={{ boxShadow: 'none' }}>
                <FaGithub />
              </a>{` `}
              <a href={`https://www.linkedin.com/in/davidlacourt/`} style={{ boxShadow: 'none' }}>
                <FaLinkedin />
              </a>{` `}
              <a href={`https://dev.to/doppelganger9`} style={{ boxShadow: 'none' }}>
                <FaDev />
              </a>{` `}
              <a href={`https://stackoverflow.com/users/526660/doppelganger9`} style={{ boxShadow: 'none' }}>
                <FaStackOverflow />
              </a>{` `}
              <a href={`https://gitlab.com/davidlacourt`} style={{ boxShadow: 'none' }}>
                <FaGitlab />
              </a>{` `}
              <a href={`https://www.facebook.com/david.lacourt`} style={{ boxShadow: 'none' }}>
                <FaFacebook />
              </a>{` `}
              <a href={`https://codepen.io/doppelganger9/`} style={{ boxShadow: 'none' }}>
                <FaCodepen />
              </a>
            </p>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.(png|jpg)/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
