#!/bin/bash
echo "Eliminando módulos de Node"
rm -rf node_modules package-lock.json
echo "Limpiando elementos inecesarios"
rm -rf lib/fontAwesome/src lib/fontAwesome/scss lib/fontAwesome/less
rm -rf lib/pace/docs lib/pace/templates
rm -rf lib/typedjs/docs lib/typedjs/src
echo "Creando directorio para FTP"
mkdir .travis/ftp
echo "Montando FTP con fuse"
sudo curlftpfs -o allow_other,user=$FTP_USER:$FTP_PASSWORD ftp://victor.zona.digital .travis/ftp
echo "Copiando los archivos al FTP"
#rsync --info=progress2 * -v -r .travis/ftp/public_html
cp -rv * .travis/ftp/public_html
echo "Desmontando FTP"
sudo umount .travis/ftp
echo "Copia terminada"
exit 0
