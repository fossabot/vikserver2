#!/bin/bash
mkdir .travis/ftp
curlftpfs -o user=$FTP_USER:$FTP_PASSWORD ftp://victor.zona.digital .travis/ftp
cp -ur * .travis/ftp/public_html
cp -ur * .travis/ftp/public_shtml
fusermount -u .travis/ftp
