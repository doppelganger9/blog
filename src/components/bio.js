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
              <a alt="twitter" href={`https://twitter.com/${social.twitter}`} style={{ boxShadow: 'none' }}>
                <FaTwitter role="img" aria-label="twitter icon"/>
              </a>{` `}
              <a alt="github" href={`https://github.com/doppelganger9/`} style={{ boxShadow: 'none' }}>
                <FaGithub role="img" aria-label="github icon"/>
              </a>{` `}
              <a alt="linkedin" href={`https://www.linkedin.com/in/davidlacourt/`} style={{ boxShadow: 'none' }}>
                <FaLinkedin role="img" aria-label="linkedin icon"/>
              </a>{` `}
              <a alt="dev.to" href={`https://dev.to/doppelganger9`} style={{ boxShadow: 'none' }}>
                <FaDev role="img" aria-label="dev.to icon"/>
              </a>{` `}
              <a alt="stackoverflow" href={`https://stackoverflow.com/users/526660/doppelganger9`} style={{ boxShadow: 'none' }}>
                <FaStackOverflow role="img" aria-label="stackoverflow icon"/>
              </a>{` `}
              <a alt="gitlab" href={`https://gitlab.com/davidlacourt`} style={{ boxShadow: 'none' }}>
                <FaGitlab role="img" aria-label="gitlab icon"/>
              </a>{` `}
              <a alt="facebook" href={`https://www.facebook.com/david.lacourt`} style={{ boxShadow: 'none' }}>
                <FaFacebook role="img" aria-label="facebook icon"/>
              </a>{` `}
              <a alt="codepen" href={`https://codepen.io/doppelganger9/`} style={{ boxShadow: 'none' }}>
                <FaCodepen role="img" aria-label="codepen icon"/>
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
