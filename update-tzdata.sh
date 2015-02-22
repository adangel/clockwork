##!/bin/bash

# NOTE: Run from your webroot

TZDATA_DIR=tzdata

# Create the /tzdata directory
mkdir -p $TZDATA_DIR

# Download the latest Olson files
curl ftp://ftp.iana.org/tz/tzdata-latest.tar.gz -o $TZDATA_DIR/tzdata-latest.tar.gz

# Expand the files
tar -xvzf $TZDATA_DIR/tzdata-latest.tar.gz -C $TZDATA_DIR

# Optionally, you can remove the downloaded archives.
rm $TZDATA_DIR/tzdata-latest.tar.gz
