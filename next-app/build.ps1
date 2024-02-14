rm -r .next ; pn install && pn build && cp -r public .next\standalone\ && cp -r .next\static .next\standalone\.next && pn docker
