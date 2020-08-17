# GeoTrellis Documentation

This repo is the home of the GeoTrellis documentation. It does not yet have a home on the web.

## Editing the docs

All of the documentation source lives in `./docs`.

Start the mdoc watcher with `./scripts/server`. Once the documentation has compiled, it will be available at `./target/mdoc`.

## Building the docusaurus static site

If you want to view live changes, ensure you have the mdoc watcher running, then also start the docusaurus live reload with `docker-compose up`. Changes will be visible at http://localhost:3000.

If you want to build an entirely static site for export to external hosting, run `./scripts/cibuild`.

The usual development process can be the following:

1. `./scripts/server`
2. `docker-compose up`
