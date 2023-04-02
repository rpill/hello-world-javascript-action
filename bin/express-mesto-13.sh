#!/bin/bash

set -eu && git clone --depth 1 https://github.com/Yandex-Practicum/web-autotest-public.git
cp ./web-autotest-public/Makefile ./Makefile
npm i -f
make proj13-test-config