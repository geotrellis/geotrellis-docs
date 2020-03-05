import Dependencies._

ThisBuild / scalaVersion := "2.12.10"
ThisBuild / version := "0.1.0-SNAPSHOT"
ThisBuild / organization := "geotrellis.docs"
ThisBuild / organizationName := "GeoTrellis Documentation"

lazy val root = (project in file("."))
  .settings(
    name := "geotrellis-docs",
    libraryDependencies ++= Seq(
      geotrellisRaster
    ),
    mdocVariables := Map(
      "VERSION" -> Version.geotrellis
    )
  )
  .enablePlugins(MdocPlugin)
