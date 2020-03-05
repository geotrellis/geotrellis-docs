import sbt._

object Version {
  val geotrellis = "3.2.0"
}

object Dependencies {
  lazy val geotrellisRaster =
    "org.locationtech.geotrellis" %% "geotrellis-raster" % Version.geotrellis
}
