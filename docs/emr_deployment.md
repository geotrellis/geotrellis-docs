---
id: emr_deployment
title: GeoTrellis EMR deployment with GDAL
sidebar_label: GeoTrellis EMR deployment with GDAL
---

GeoTrellis can be used with _EMR 6_. However, if there is a need in GDAL bindings usage there can be some certain complexities.
This section describes the entire _EMR 6_ deployment and GDAL installation in a way that would satisfy GeoTrellis GDAL requirements.

Starting _GeoTrellis_ `3.4.2`, _GeoTrellis_ is compatible only with the GDAL`3.1 +` versions.

## Installing GDAL on EMR

The EMR installation conatans of the following steps:

1. Install _GDAL_
2. Set Spark `LD_LIBRARY_PATH`. In this case `GeoTrellis GDAL` would be able to use the installed `GDAL`.

You can also check out [GeoTrellis Spark template](https://github.com/geotrellis/geotrellis-spark-job.g8) that is properly configured for the EMR jobs.

### EMR Bootsrap script (GDAL installation on EMR)

The EMR bootstrap script with all appropriate settings is located under the following S3 URI: [s3://geotrellis-test/emr-gdal/bootstrap.sh](s3://geotrellis-test/emr-gdal/bootstrap.sh).
It installs GDAL 3.1.2 (by default) through conda and sets all appropriate env variables in case 
it would be required to log in onto nodes and experiment with the `spark-shell`.

```bash
#!/bin/bash

set -ex

# The default GDAL version would be 3.1.2
GDAL_VERSION=$1
GDAL_VERSION=${GDAL_VERSION:="3.1.2"}

# Install Conda
wget https://repo.continuum.io/miniconda/Miniconda-latest-Linux-x86_64.sh
sudo sh Miniconda-latest-Linux-x86_64.sh -b -p /usr/local/miniconda

source ~/.bashrc
export PATH=/usr/local/miniconda/bin:$PATH

# Install GDAL
conda config --add channels conda-forge
sudo pip3 install tqdm && \
sudo /usr/local/miniconda/bin/conda install python=3.6 -y && \
sudo /usr/local/miniconda/bin/conda install -c anaconda hdf5 -y && \
sudo /usr/local/miniconda/bin/conda install -c conda-forge libnetcdf gdal=${GDAL_VERSION} -y

echo "export PATH=/usr/local/miniconda/bin:$PATH" >> ~/.bashrc
echo "export LD_LIBRARY_PATH=/usr/local/miniconda/lib/:/usr/local/lib:/usr/lib/hadoop/lib/native:/usr/lib/hadoop-lzo/lib/native:/docker/usr/lib/hadoop/lib/native:/docker/usr/lib/hadoop-lzo/lib/native:/usr/java/packages/lib/amd64:/usr/lib64:/lib64:/lib:/usr/lib" >> ~/.bashrc
```

#### Spark settings (optional)

Set `LD_LIBRARY_PATH` for spark, through the `spark-defaults` settings:

```json
{
  "Classification": "spark-defaults",
  "Properties": {
    "spark.yarn.appMasterEnv.LD_LIBRARY_PATH": "/usr/local/miniconda/lib/:/usr/local/lib",
    "spark.executorEnv.LD_LIBRARY_PATH": "/usr/local/miniconda/lib/:/usr/local/lib"
  }
}
```

These parameters (above) can be also set / overrided via the `spark-submit --conf` settings.

### SBT Lighter plugin configuration example

```scala
/** addSbtPlugin("net.pishen" % "sbt-lighter" % "1.2.0") */

import sbtlighter._

LighterPlugin.disable

lazy val EMRSettings = LighterPlugin.baseSettings ++ Seq(
  sparkEmrRelease := "emr-6.0.0",
  sparkAwsRegion := "us-east-1",
  sparkEmrApplications := Seq("Hadoop", "Spark", "Ganglia", "Zeppelin"),
  sparkEmrBootstrap := List(
    BootstrapAction(
      "Install GDAL dependencies",
      "s3://geotrellis-test/emr-gdal/bootstrap.sh",
      "3.1.2"
    )
  ),
  sparkS3JarFolder := "s3://geotrellis-test/rastersource-performance/jars",
  sparkInstanceCount := 11,
  sparkMasterType := "i3.xlarge",
  sparkCoreType := "i3.xlarge",
  sparkMasterPrice := Some(0.5),
  sparkCorePrice := Some(0.5),
  sparkClusterName := s"GeoTrellis VLM Performance ${sys.env.getOrElse("USER", "<anonymous user>")}",
  sparkEmrServiceRole := "EMR_DefaultRole",
  sparkInstanceRole := "EMR_EC2_DefaultRole",
  sparkMasterEbsSize := None, // Some(64)
  sparkCoreEbsSize := None, // Some(64)
  sparkJobFlowInstancesConfig := sparkJobFlowInstancesConfig.value.withEc2KeyName("geotrellis-emr"),
  sparkS3LogUri := Some("s3://geotrellis-test/rastersource-performance/logs"),
  sparkEmrConfigs := List(
    EmrConfig("spark").withProperties(
      "maximizeResourceAllocation" -> "false" // be careful with setting this param to true
    ),
    EmrConfig("spark-defaults").withProperties(
      "spark.driver.maxResultSize" -> "4200M",
      "spark.dynamicAllocation.enabled" -> "true",
      "spark.shuffle.service.enabled" -> "true",
      "spark.shuffle.compress" -> "true",
      "spark.shuffle.spill.compress" -> "true",
      "spark.rdd.compress" -> "true",
      "spark.driver.extraJavaOptions" ->"-XX:+UseParallelGC -XX:+UseParallelOldGC -XX:OnOutOfMemoryError='kill -9 %p'",
      "spark.executor.extraJavaOptions" -> "-XX:+UseParallelGC -XX:+UseParallelOldGC -XX:OnOutOfMemoryError='kill -9 %p'",
      "spark.yarn.appMasterEnv.LD_LIBRARY_PATH" -> "/usr/local/miniconda/lib/:/usr/local/lib",
      "spark.executorEnv.LD_LIBRARY_PATH" -> "/usr/local/miniconda/lib/:/usr/local/lib"
    ),
    EmrConfig("yarn-site").withProperties(
      "yarn.resourcemanager.am.max-attempts" -> "1",
      "yarn.nodemanager.vmem-check-enabled" -> "false",
      "yarn.nodemanager.pmem-check-enabled" -> "false"
    )
  )
)
```
