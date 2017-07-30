#!/bin/bash
for i in $(ls); do
	curl --ftp-create-dirs -T "$i" -u $FTP_USER:$FTP_PASSWORD ftp://victor.zona.digital/public_shtml/
done
