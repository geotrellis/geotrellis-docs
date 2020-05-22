/**
 * Copyright (c) 2017-present, Azavea, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

import { Container, GridBlock } from '../../core/CompLibrary.js'

const Button = props => (
  <div className="pluginWrapper buttonWrapper">
    <a className="button" href={props.href} target={props.target}>
      {props.children}
    </a>
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {props.title}
    <small>{props.tagline}</small>
  </h2>
);

class HomeSplash extends React.Component {
  render() {

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );


    return (
      <div>
        <Container background="light" padding={["bottom"]}>
        </Container>
      </div>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    return (
      <div>
        <div className="mainContainer">
          <Container padding={["bottom"]}>
            <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
          </Container>
          <Container padding={["bottom"]}>
            <p>
              If you can’t find exactly what you’re looking for in either our Guide or API docs, feel free to join us in our <a href={this.props.config.gitterUrl}>Gitter channel</a>, where we can answer your questions live.
            </p>
            <Button href={docUrl('getting_started')}>Getting Started</Button>
          </Container>
          <Container padding={["bottom"]}>
            <h3>Scala API Documentation</h3>
            <p>The latest Scaladoc tracks the master branch on GitHub. Tagged releases are identified by their version number.</p>
          </Container>
          <Container padding={["bottom"]}>
            <h3>Contributing</h3>
            <p>GeoTrellis is an open source project, so contributions of any kind are welcome and appreciated! Contributors will need to sign a CLA (Contributor’s License Agreement). These details and others relating to GeoTrellis contributions can be found <a href="https://geotrellis.readthedocs.io/en/latest/CONTRIBUTING.html">here.</a></p>
          </Container>
          <Container padding={["bottom"]}>
          </Container>
        </div>
      </div>
    );
  }
}

module.exports = Index;
