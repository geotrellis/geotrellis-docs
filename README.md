# GeoTrellis Documentation

**As of https://github.com/locationtech/geotrellis/pull/3317 this repo has been migrated and integrated into locationtech/geotrellis. It is DEPRECATED.**

This repo is the home of the GeoTrellis documentation. It is a test bed for developing GT docs with mdoc. 

## Editing the docs

All of the documentation source lives in `./docs`.

Start the mdoc watcher with `./scripts/server`. Once the documentation has compiled, it will be available at `./target/mdoc`.

## Building the docusaurus static site

If you want to view live changes, ensure you have the mdoc watcher running, then also start the docusaurus live reload with `docker-compose up`. Changes will be visible at http://localhost:3000.

If you want to build an entirely static site for export to external hosting, run `./scripts/cibuild`.
