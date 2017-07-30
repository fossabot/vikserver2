#!/bin/bash
mkdir .travis/ftp
sudo curlftpfs -o user=$FTP_USER:$FTP_PASSWORD ftp://victor.zona.digital .travis/ftp
(cp -ur * .travis/ftp/public_html && cp -ur * .travis/ftp/public_shtml && sudo umount .travis/ftp && exit 0) || (echo "Ha habido un fallo en el deploy" && exit 1)
